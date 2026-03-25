const {
  jobQueue,
  MAX_WORKERS,
  getActiveWorkers,
  incrementWorkers,
  decrementWorkers,
} = require("./jobQueue.js");

const { setResult } = require("./resultCache.js");
const { logicandFetchHtml } = require("../services/ggsipu.services.js");
const { parseResult } = require("./parseResult.js");

setInterval(async () => {
  if (getActiveWorkers() >= MAX_WORKERS) return;
  if (jobQueue.length === 0) return;

  const job = jobQueue.shift();
  if (!job) return;

  incrementWorkers(); // ✅ SAFE

  try {
    const html = await logicandFetchHtml(job.payload);
    const data = parseResult(html);

    setResult(job.id, {
      success: true,
      data,
    });
  } catch (err) {
    setResult(job.id, {
      success: false,
      message: err.message,
    });
  } finally {
    decrementWorkers(); // ✅ SAFE
  }
}, 1000);