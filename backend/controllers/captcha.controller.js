const puppeteer = require("puppeteer"); // ✅ CHANGE

const { createCaptchaSession } = require("../utils/sessionStore.js");

const initCaptchaController = async (req, res) => {
  const url = "https://examweb.ggsipu.ac.in/web/login.jsp";
  const selector = "#captchaImage";

  const attempts = Number(process.env.CAPTCHA_INIT_ATTEMPTS || 2);
  const navTimeoutMs = Number(process.env.CAPTCHA_NAV_TIMEOUT_MS || 30000);
  const selectorTimeoutMs = Number(
    process.env.CAPTCHA_SELECTOR_TIMEOUT_MS || 20000
  );

  let browser;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      browser = await puppeteer.launch({
        headless: true, // Render/Linux-friendly
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

      await page.goto(url, { waitUntil: "load", timeout: navTimeoutMs });

      await page.waitForSelector(selector, { timeout: selectorTimeoutMs });
      const captchaEl = await page.$(selector);
      if (!captchaEl) {
        throw new Error(
          `captcha element missing (${selector}) after wait (attempt ${attempt})`
        );
      }

      const captchaBuffer = await captchaEl.screenshot({ encoding: "binary" });
      const captchaBase64 = Buffer.from(captchaBuffer).toString("base64");
      const cookies = await page.cookies();

      const sessionId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

      createCaptchaSession(sessionId, { cookies });

      await browser.close().catch(() => {});
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
          message:
            error?.message ||
            "Captcha init failed due to an unknown error",
        });
      }

      // Small backoff before retrying
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
};

module.exports = { initCaptchaController };