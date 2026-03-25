const express = require('express');
const rateLimiter = require('../middlewares/rateLimit.middleware.js');
const { initCaptchaController } = require('../controllers/captcha.controller.js');
const { fetchResultController } = require('../controllers/result.controller.js');
const { getResultStatusController } = require('../controllers/resultstatus.js');


const router = express.Router();

router.post('/result', rateLimiter, fetchResultController);
router.post('/captcha/init', initCaptchaController);
router.get('/status/:requestId', getResultStatusController);

module.exports = router;