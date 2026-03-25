const puppeteer = require("puppeteer"); // ✅ CHANGE

const { captchaSessions } = require('../utils/sessionStore.js');

const initCaptchaController = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // ✅ simple use
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
  }
};

module.exports = { initCaptchaController };