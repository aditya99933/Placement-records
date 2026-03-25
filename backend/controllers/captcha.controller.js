const puppeteer = require('puppeteer-core');
const { captchaSessions } = require('../utils/sessionStore.js');

const initCaptchaController = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: "new", // ✅ background only
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(
      "https://examweb.ggsipu.ac.in/web/login.jsp",
      { waitUntil: "domcontentloaded" }
    );

    await page.waitForSelector("#captchaImage", { timeout: 15000 });

    const captchaEl = await page.$("#captchaImage");
    const captchaBuffer = await captchaEl.screenshot();
    const captchaBase64 = captchaBuffer.toString("base64");

    const sessionId = Date.now().toString();

    captchaSessions.set(sessionId, {
      browser,
      page,
      createdAt: Date.now(),
    });

    // ✅ KEY NAME FIXED
    res.json({
      success: true,
      sessionId,
      captchaImage: captchaBase64, // 👈 ONLY base64
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { initCaptchaController };