const puppeteer = require("puppeteer"); // ✅ CHANGE

const { createCaptchaSession } = require("../utils/sessionStore.js");

const initCaptchaController = async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // ✅ simple use
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    await page.goto(
      "https://examweb.ggsipu.ac.in/web/login.jsp",
      { waitUntil: "domcontentloaded" }
    );

    await page.waitForSelector("#captchaImage", { timeout: 15000 });

    const captchaEl = await page.$("#captchaImage");
    const captchaBuffer = await captchaEl.screenshot();
    const captchaBase64 = captchaBuffer.toString("base64");
    const cookies = await page.cookies();

    const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    createCaptchaSession(sessionId, { cookies });

    // Important: close browser here to avoid memory/process leaks in production.
    await browser.close();
    browser = null;

    res.json({
      success: true,
      sessionId,
      captchaImage: captchaBase64,
    });

  } catch (error) {
    console.error("ERROR:", error); // 🔥 important for logs
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};

module.exports = { initCaptchaController };