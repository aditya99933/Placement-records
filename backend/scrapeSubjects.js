const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// ✅ Add as many student URLs as you want
const STUDENT_URLS = [
  "https://www.ipuranklist.com/student/02414812721",
  "https://www.ipuranklist.com/student/00216101421",
  "https://www.ipuranklist.com/student/01496202821",
  "https://www.ipuranklist.com/student/04914815923",
  "https://www.ipuranklist.com/student/00113311022",
  "https://www.ipuranklist.com/student/00314803621",
  "https://www.ipuranklist.com/student/04114811121",
  "https://www.ipuranklist.com/student/06014803121",
];

const OUTPUT_PATH = path.join(__dirname, "utils", "subjects.json");

async function scrapeFromUrl(page, url) {
  console.log(`\n🌐 Fetching: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));

  const subjects = [];

  for (let sem = 1; sem <= 8; sem++) {
    await page.evaluate((sem) => {
      const target = Array.from(document.querySelectorAll(".nav-link")).find(
        (t) => t.textContent.trim() === `Sem ${sem}`
      );
      if (target) target.click();
    }, sem);

    await new Promise((r) => setTimeout(r, 3000));

    const semSubjects = await page.evaluate((sem) => {
      const data = [];
      const table = document.querySelector("table.table-striped");
      if (!table) return data;

      table.querySelectorAll("tbody tr").forEach((row) => {
        const firstCell = row.querySelector("td");
        if (!firstCell) return;
        const text = firstCell.innerText.replace(/\s+/g, " ").trim();
        if (!text) return;
        const match = text.match(/^(.+)\s*\((\d+)\)$/);
        if (match) {
          data.push({
            subjectName: match[1].trim(),
            credits: parseInt(match[2]),
          });
        }
      });
      return data;
    }, sem);

    console.log(`  Sem ${sem}: ${semSubjects.length} subjects`);
    subjects.push(...semSubjects);
  }

  return subjects;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  const allSubjects = [];

  for (const url of STUDENT_URLS) {
    const subjects = await scrapeFromUrl(page, url);
    allSubjects.push(...subjects);
  }

  await browser.close();

  // load existing subjects.json if present
  const existing = fs.existsSync(OUTPUT_PATH)
    ? JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"))
    : [];

  const existingNames = new Set(existing.map((s) => s.subjectName));

  // only add subjects that don't already exist
  const newOnly = allSubjects.filter((s) => !existingNames.has(s.subjectName));

  // deduplicate within newOnly as well
  const unique = [
    ...existing,
    ...Array.from(new Map(newOnly.map((s) => [s.subjectName, s])).values()),
  ];

  console.log(`📝 ${newOnly.length} new subjects added, ${existing.length} already existed`);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2));
  console.log(`\n✅ Done! ${unique.length} unique subjects saved to utils/subjects.json`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
