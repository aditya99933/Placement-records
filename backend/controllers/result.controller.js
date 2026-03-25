const { v4: uuid } = require('uuid');
const { jobQueue, MAX_QUEUE_SIZE } = require('../utils/jobQueue.js');

const fetchResultController = (req, res, next) => {
  try {
    const { sessionId, enrollment, password, captcha, consent } = req.body;

    // ✅ validation stays here
    if (!consent) {
      return res.status(400).json({
        success: false,
        message: "User consent is required",
      });
    }

    if (!enrollment || !password || !captcha || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (jobQueue.length >= MAX_QUEUE_SIZE) {
      return res.status(429).json({
        success: false,
        message: "Server busy. Please try again in a minute.",
      });
    }

    const requestId = uuid();

    jobQueue.push({
      id: requestId,
      payload: {
        sessionId,
        enrollment,
        password,
        captcha,
      },
    });
    return res.json({
      success: true,
      status: "queued",
      requestId,
    });

  } catch (error) {
    next(error);
  }
};
module.exports = {fetchResultController};