const axios = require("axios");

const {
  getCaptchaSession,
  deleteCaptchaSession,
  getGlobalCookie,
  setGlobalCookie
} = require("../utils/sessionStore.js");

const navTimeoutMs = Number(process.env.CAPTCHA_NAV_TIMEOUT_MS || 60000);

const logicandFetchHtml = async ({ sessionId, enrollment, password, captcha }) => {

  // 🔥 STEP 1: Try existing cookie (NO PUPPETEER)
  let cookie = getGlobalCookie();

  const resultUrl = `https://examweb.ggsipu.ac.in/StudentSearchProcess?flag=2&euno=${enrollment}`;

  if (cookie) {
    try {
      const res = await axios.get(resultUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Cookie": cookie,
        },
        timeout: 30000,
      });

      return res.data;
    } catch (err) {
      console.log("⚠️ Cookie expired, doing fresh login...");
    }
  }

  // 🔴 STEP 2: Puppeteer login (only if needed)
  const session = getCaptchaSession(sessionId);
  if (!session) throw new Error("Captcha session expired. Please refresh captcha.");

  const { page } = session;

  try {
    page.setDefaultNavigationTimeout(navTimeoutMs);
    page.setDefaultTimeout(navTimeoutMs);

    // ===== LOGIN =====
    await page.waitForSelector("#username");
    await page.type("#username", enrollment);

    await page.waitForSelector("#passwd");
    await page.type("#passwd", password);

    await page.waitForSelector("#captcha");
    await page.type("#captcha", captcha);

    await Promise.all([
      page.click('button[type="submit"], input[type="submit"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    // ❗ LOGIN FAILURE CHECK
    if (page.url().includes("login.jsp")) {
      throw new Error("Invalid credentials or captcha");
    }

    // ===== GET COOKIE =====
    const cookies = await page.cookies();
    const jsessionid = cookies.find((c) => c.name === "JSESSIONID")?.value;

    if (!jsessionid) throw new Error("Session cookie not found after login.");

    const cookieString = `JSESSIONID=${jsessionid}`;

    // 🔥 SAVE GLOBAL COOKIE
    setGlobalCookie(cookieString);

    // ===== AXIOS CALL =====
    const resultRes = await axios.get(resultUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Cookie": cookieString,
      },
      timeout: 30000,
    });

    return resultRes.data;

  } finally {
    // 🔥 close session
    deleteCaptchaSession(sessionId);
  }
};

module.exports = { logicandFetchHtml };
