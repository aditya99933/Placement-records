const { captchaSessions } = require("../utils/sessionStore.js");

const logicandFetchHtml = async ({
  sessionId,
  enrollment,
  password,
  captcha,
}) => {

  const session = captchaSessions.get(sessionId);
  if (!session) {
    throw new Error("Captcha session expired. Please refresh captcha.");
  }

  const { browser, page } = session;

  // ===== LOGIN =====
  await page.waitForSelector("#username", { timeout: 15000 });
  await page.type("#username", enrollment);

  await page.waitForSelector("#passwd", { timeout: 15000 });
  await page.type("#passwd", password);

  await page.waitForSelector("#captcha", { timeout: 15000 });
  await page.type("#captcha", captcha);

  await Promise.all([
    page.click('button[type="submit"], input[type="submit"]'),
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  ]);

  // ❗ LOGIN FAILURE CHECK (RIGHT PLACE)
  if (page.url().includes("login.jsp")) {
    await browser.close();
    captchaSessions.delete(sessionId);
    throw new Error("Invalid credentials or captcha");
  }

  // ===== DASHBOARD =====
  await page.waitForSelector("#euno", { timeout: 15000 });

  // select ALL
  await page.evaluate(() => {
    const select = document.querySelector("#euno");
    select.value = "100"; // 👈 THIS WAS THE BUG
    select.dispatchEvent(new Event("change", { bubbles: true }));
    select.dispatchEvent(new Event("input", { bubbles: true }));
  });

  // 🔥 GET RESULT CLICK (MISSING PART)
  await page.waitForSelector('input.btn-submit', { timeout: 15000 });
await page.click('input.btn-submit');

  // ⏳ WAIT FOR RESULT TABLE (NOT NAVIGATION)
  await page.waitForSelector("table", { timeout: 15000 });

  // ===== RESULT PAGE =====
  const html = await page.content();

  // cleanup
  captchaSessions.delete(sessionId);
  await browser.close();

  return html;
};

module.exports = { logicandFetchHtml };

