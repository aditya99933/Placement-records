const captchaSessions = new Map();

// Production note: Reducing TTL to 2 minutes for Render Free Tier (512MB RAM)
// This ensures unused browsers are closed almost immediately to free up memory.
const CAPTCHA_SESSION_TTL_MS = Number(
  process.env.CAPTCHA_SESSION_TTL_MS || 2 * 60 * 1000
);

const createCaptchaSession = (sessionId, data) => {
  captchaSessions.set(sessionId, {
    ...data,
    createdAt: Date.now(),
  });
};

const closeSessionResources = async (session) => {
  if (session?.page) {
    await session.page.close().catch(() => {});
  }
  if (session?.browser) {
    await session.browser.close().catch(() => {});
  }
};

const getCaptchaSession = (sessionId) => {
  const session = captchaSessions.get(sessionId);
  if (!session) return null;

  if (Date.now() - session.createdAt > CAPTCHA_SESSION_TTL_MS) {
    captchaSessions.delete(sessionId);
    closeSessionResources(session).catch(() => {});
    return null;
  }

  return session;
};

const deleteCaptchaSession = (sessionId) => {
  const session = captchaSessions.get(sessionId);
  if (session) {
    captchaSessions.delete(sessionId);
    // Fires and forgets closing to unblock the main thread
    closeSessionResources(session).catch(() => {});
  }
};

// More frequent cleanup (every 20 seconds) to purge stale browser instances aggressively
setInterval(() => {
  for (const [sessionId, session] of captchaSessions.entries()) {
    if (Date.now() - session.createdAt > CAPTCHA_SESSION_TTL_MS) {
      captchaSessions.delete(sessionId);
      closeSessionResources(session).catch(() => {});
    }
  }
}, 20 * 1000).unref();

/* 🔥 GLOBAL COOKIE REMOVED 🔥
   A shared global cookie is dangerous for 2000 concurrent users as it overwrites session data.
   Each student session should have its own browser/cookie logic.
*/

module.exports = {
  createCaptchaSession,
  getCaptchaSession,
  deleteCaptchaSession
};
