const axios = require("axios");
const fs = require("fs");
const path = require("path");


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

  const resultUrl = `https://examweb.ggsipu.ac.in/web/StudentSearchProcess?flag=2&euno=100`;

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
      // Cookie invalid or expired, continue to Puppeteer flow
    }
  }

  // 🔴 STEP 2: Puppeteer login (only if needed)
  const session = getCaptchaSession(sessionId);
  if (!session) {
    throw new Error("Captcha session expired. Please refresh captcha.");
  }

  const { page, browser } = session;

  try {
    page.setDefaultNavigationTimeout(navTimeoutMs);
    page.setDefaultTimeout(navTimeoutMs);


    // ===== LOGIN =====
    await page.waitForSelector("#username", { timeout: 10000 });
    await page.type("#username", enrollment);

    await page.waitForSelector("#passwd", { timeout: 10000 });
    await page.type("#passwd", password);

    await page.waitForSelector("#captcha", { timeout: 10000 });
    await page.type("#captcha", captcha);

    const submitBtn = await page.$('button[type="submit"]') || await page.$('input[type="submit"]');
    if (!submitBtn) {
      // Try alternative selectors
      const altBtn = await page.$('#btnSubmit') || await page.$('.btn-submit') || await page.$('button.btn');
      if (!altBtn) {
        throw new Error("Submit button not found on login page");
      }
    }

    // Use navigationPromise BEFORE clicking to avoid race condition
    const navigationPromise = page.waitForNavigation({ waitUntil: "networkidle2", timeout: navTimeoutMs });
    await (submitBtn || await page.$('#btnSubmit') || await page.$('.btn-submit') || await page.$('button.btn')).click();
    await navigationPromise;

    // ❗ LOGIN FAILURE CHECK
    if (page.url().includes("login.jsp")) {
      // Try to get error message from page
      const errorMsg = await page.evaluate(() => {
        const el = document.querySelector('.error, .alert, .alert-danger, #error, .text-danger');
        return el ? el.textContent.trim() : null;
      });
      throw new Error(errorMsg || "Invalid credentials or captcha");
    }

    // ===== GET COOKIE =====
    const cookies = await page.cookies();
    const jsessionid = cookies.find((c) => c.name === "JSESSIONID")?.value;

    if (!jsessionid) {
      throw new Error("Session cookie not found after login.");
    }

    const cookieString = `JSESSIONID=${jsessionid}`;

    // 🔥 SAVE GLOBAL COOKIE
    setGlobalCookie(cookieString);

    // ===== FETCH RESULT =====
    const semsToTry = [100, 1, 2, 3, 4, 5, 6, 7, 8];
    let finalHtml = "";

    for (const euno of semsToTry) {
        try {
            const fetchUrl = `https://examweb.ggsipu.ac.in/web/StudentSearchProcess?flag=2&euno=${euno}`;
            
            const html = await page.evaluate(async (url) => {
                try {
                    const res = await fetch(url, { credentials: "include" });
                    return await res.text();
                } catch (e) { return "ERROR: " + e.message; }
            }, fetchUrl);

            if (html && html.includes("stresult") && !html.includes("\"stresult\" : null")) {
                finalHtml = html;
                break; 
            } else {
                if (!finalHtml && html.includes("stprofile")) {
                    finalHtml = html; 
                }
            }
            // Small delay to prevent rate limit
            await new Promise(r => setTimeout(r, 1000));
        } catch (loopErr) {}
    }


    return finalHtml;

  } catch (err) {
    throw err;
  } finally {
    // 🔥 close session
    deleteCaptchaSession(sessionId);
  }
};

module.exports = { logicandFetchHtml };
