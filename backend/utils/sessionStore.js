const captchaSessions = new Map();
// Production note: users often take time to read captcha / type credentials.
// Default 10 minutes; override via CAPTCHA_SESSION_TTL_MS env.
const CAPTCHA_SESSION_TTL_MS = Number(
  process.env.CAPTCHA_SESSION_TTL_MS || 10 * 60 * 1000
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
  captchaSessions.delete(sessionId);
  closeSessionResources(session).catch(() => {});
};

// Lightweight periodic cleanup for expired sessions.
setInterval(() => {
  for (const [sessionId, session] of captchaSessions.entries()) {
    if (Date.now() - session.createdAt > CAPTCHA_SESSION_TTL_MS) {
      captchaSessions.delete(sessionId);
      closeSessionResources(session).catch(() => {});
    }
  }
}, 60 * 1000).unref();


// 🔥 GLOBAL COOKIE (shared session)
let globalCookie = null;
let cookieCreatedAt = null;

const COOKIE_TTL = 10 * 60 * 1000; // 10 min

const setGlobalCookie = (cookie) => {
  globalCookie = cookie;
  cookieCreatedAt = Date.now();
};

const getGlobalCookie = () => {
  if (!globalCookie) return null;

  if (Date.now() - cookieCreatedAt > COOKIE_TTL) {
    globalCookie = null;
    return null;
  }

  return globalCookie;
};


module.exports = {
  createCaptchaSession,
  getCaptchaSession,
  deleteCaptchaSession,
  setGlobalCookie,
  getGlobalCookie
};
