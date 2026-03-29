const puppeteer = require("puppeteer");

const { createCaptchaSession } = require("../utils/sessionStore.js");

const initCaptchaController = async (req, res) => {
  const url = "https://examweb.ggsipu.ac.in/web/login.jsp";
  const selector = "#captchaImage";

  const attempts = Number(process.env.CAPTCHA_INIT_ATTEMPTS || 2);
  const navTimeoutMs = Number(process.env.CAPTCHA_NAV_TIMEOUT_MS || 60000); // 🔥 increase
  const selectorTimeoutMs = Number(
    process.env.CAPTCHA_SELECTOR_TIMEOUT_MS || 30000 // 🔥 increase
  );

  let browser;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      browser = await puppeteer.launch({
        headless: "new", // 🔥 IMPORTANT CHANGE
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-zygote",
          "--single-process", // 🔥 Render fix
          "--no-first-run"
        ],
      });

      const page = await browser.newPage();

      page.setDefaultNavigationTimeout(navTimeoutMs);
      page.setDefaultTimeout(navTimeoutMs);

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      );

      await page.setViewport({ width: 1280, height: 720 });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: navTimeoutMs }); // 🔥 change

      await page.waitForSelector(selector, { timeout: selectorTimeoutMs });

      const captchaEl = await page.$(selector);
      if (!captchaEl) {
        throw new Error(`captcha element missing (${selector})`);
      }

      const captchaBuffer = await captchaEl.screenshot({ encoding: "binary" });
      const captchaBase64 = Buffer.from(captchaBuffer).toString("base64");

      const sessionId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

      createCaptchaSession(sessionId, { browser, page });
      browser = null;

      return res.json({
        success: true,
        sessionId,
        captchaImage: captchaBase64,
      });

    } catch (error) {
      console.error(`CAPTCHA INIT ERROR (attempt ${attempt}):`, {
        message: error?.message,
        name: error?.name,
      });

      if (browser) {
        await browser.close().catch(() => {});
        browser = null;
      }

      if (attempt === attempts) {
        return res.status(500).json({
          success: false,
          message: error?.message || "Captcha init failed",
        });
      }

      await new Promise((r) => setTimeout(r, 2000));
    }
  }
};

module.exports = { initCaptchaController };