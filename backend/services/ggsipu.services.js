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
  const url = "https://examweb.ggsipu.ac.in/web/login.jsp";
  const navTimeoutMs = Number(process.env.CAPTCHA_NAV_TIMEOUT_MS || 60000);

  const session = getCaptchaSession(sessionId);
  if (!session) {
    throw new Error("Captcha session expired. Please refresh captcha.");
  }

  let browser;
  const { cookies = [] } = session;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(navTimeoutMs);
    page.setDefaultTimeout(navTimeoutMs);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 720 });
    if (cookies.length) {
      await page.setCookie(...cookies);
    }
    await page.goto(url, {
      waitUntil: "load",
      timeout: navTimeoutMs,
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
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: navTimeoutMs }),
    ]);

    // ❗ LOGIN FAILURE CHECK (RIGHT PLACE)
    if (page.url().includes("login.jsp")) {
      const bodyText = await page.evaluate(() => document.body?.innerText || "");
      throw new Error(
        `Login failed (still on login.jsp). Possible invalid credentials/captcha. Page says: ${bodyText
          .trim()
          .slice(0, 200)}`
      );
    }

    // ===== DASHBOARD =====
    try {
      await page.waitForSelector("#euno", { timeout: navTimeoutMs });
    } catch (e) {
      // Fallback: sometimes the portal changes ids; try broader selectors.
      const bodyText = await page.evaluate(() => document.body?.innerText || "");
      const currentUrl = page.url();
      throw new Error(
        `Dashboard not loaded (missing #euno). url=${currentUrl}. Page says: ${bodyText
          .trim()
          .slice(0, 200)}`
      );
    }

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

