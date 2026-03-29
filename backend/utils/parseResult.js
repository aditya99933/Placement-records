const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const subjectsPath = path.join(__dirname, "subjects.json");
const subjectsList = fs.existsSync(subjectsPath)
  ? JSON.parse(fs.readFileSync(subjectsPath, "utf-8"))
  : [];
const creditsMap = {};
subjectsList.forEach((s) => { creditsMap[s.subjectName] = s.credits; });

const parseResult = (html) => {
  const $ = cheerio.load(html);

  const studentInfo = {};

  $("#dataContainer .student-info-card .info-item").each((_, el) => {
    const label = $(el).find(".info-label").text().trim();
    const value = $(el).find(".info-value").text().trim();

    if (!label || !value) return;

    if (label.includes("Enrollment")) {
      studentInfo.enrollmentNumber = value;
    } else if (label.includes("Student Name")) {
      studentInfo.studentName = value;
    } else if (label.includes("Institute")) {
      studentInfo.institute = value;
    } else if (label.includes("Program")) {
      studentInfo.program = value;
    } else if (label.includes("Batch")) {
      studentInfo.batch = value;
    } else if (label.includes("Year")) {
      studentInfo.yearOfAdmission = value;
    }
  });

  const subjects = [];

  $(".table-responsive table.modern-table tbody tr").each((_, row) => {
    const cols = $(row).find("td");

    // Safety check
    if (cols.length < 8) return;

    const semester = $(cols[0]).text().trim();
    const paperCode = $(cols[1]).text().trim();
    const subjectName = $(cols[2]).text().trim();

    const internal = parseInt($(cols[3]).text().trim(), 10);
    const external = parseInt($(cols[4]).text().trim(), 10);
    const total = parseInt($(cols[5]).text().trim(), 10);

    // Skip empty / header rows
    if (!subjectName) return;

    subjects.push({
      semester,
      paperCode,
      subject: subjectName,
      credits: creditsMap[subjectName] ?? null,
      internal: isNaN(internal) ? null : internal,
      external: isNaN(external) ? null : external,
      total: isNaN(total) ? null : total,
    });
  });

  if (subjects.length === 0) {
    throw new Error("Result not found or layout changed");
  }

  return {
    studentInfo,
    subjects,
  };
};

module.exports = { parseResult };