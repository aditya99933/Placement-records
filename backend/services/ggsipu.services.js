const puppeteer = require("puppeteer");
const {
  getCaptchaSession,
  deleteCaptchaSession,
} = require("../utils/sessionStore.js");

const logicandFetchHtml = async ({
  sessionId,
  enrollment,
  password,
  captcha,
}) => {

  const session = getCaptchaSession(sessionId);
  if (!session) {
    throw new Error("Captcha session expired. Please refresh captcha.");
  }

  let browser;
  const { cookies = [] } = session;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    if (cookies.length) {
      await page.setCookie(...cookies);
    }
    await page.goto("https://examweb.ggsipu.ac.in/web/login.jsp", {
      waitUntil: "domcontentloaded",
    });

    // ===== LOGIN =====
    await page.waitForSelector("#username", { timeout: 30000 });
    await page.type("#username", enrollment);

    await page.waitForSelector("#passwd", { timeout: 30000 });
    await page.type("#passwd", password);

    await page.waitForSelector("#captcha", { timeout: 30000 });
    await page.type("#captcha", captcha);

    await Promise.all([
      page.click('button[type="submit"], input[type="submit"]'),
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    ]);

    // ❗ LOGIN FAILURE CHECK (RIGHT PLACE)
    if (page.url().includes("login.jsp")) {
      throw new Error("Invalid credentials or captcha");
    }

    // ===== DASHBOARD =====
    await page.waitForSelector("#euno", { timeout: 30000 });

    // select ALL
    await page.evaluate(() => {
      const select = document.querySelector("#euno");
      select.value = "100"; // 👈 THIS WAS THE BUG
      select.dispatchEvent(new Event("change", { bubbles: true }));
      select.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // 🔥 GET RESULT CLICK (MISSING PART)
    await page.waitForSelector("input.btn-submit", { timeout: 30000 });
    await page.click("input.btn-submit");

    // ⏳ WAIT FOR RESULT TABLE (NOT NAVIGATION)
    await page.waitForSelector("table", { timeout: 30000 });

    // ===== RESULT PAGE =====
    const html = await page.content();

    return html;
  } finally {
    deleteCaptchaSession(sessionId);
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};

module.exports = { logicandFetchHtml };

