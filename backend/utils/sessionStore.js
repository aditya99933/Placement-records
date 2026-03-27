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

const getCaptchaSession = (sessionId) => {
  const session = captchaSessions.get(sessionId);
  if (!session) return null;

  if (Date.now() - session.createdAt > CAPTCHA_SESSION_TTL_MS) {
    captchaSessions.delete(sessionId);
    return null;
  }

  return session;
};

const deleteCaptchaSession = (sessionId) => {
  captchaSessions.delete(sessionId);
};

// Lightweight periodic cleanup for expired sessions.
setInterval(() => {
  for (const [sessionId, session] of captchaSessions.entries()) {
    if (Date.now() - session.createdAt > CAPTCHA_SESSION_TTL_MS) {
      captchaSessions.delete(sessionId);
    }
  }
}, 60 * 1000).unref();

module.exports = {
  createCaptchaSession,
  getCaptchaSession,
  deleteCaptchaSession,
};