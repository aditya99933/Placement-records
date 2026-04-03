const { getResult, isPending } = require("../utils/resultCache.js");
const getResultStatusController = (req, res) => {
  const { requestId } = req.params;

  const data = getResult(requestId);

  if (!data) {
    if (isPending(requestId)) {
      return res.json({ status: "processing" });
    }
    return res.json({
      status: "done",
      success: false,
      message: "Request expired or invalid. Please submit again.",
    });
  }

  res.json({ status: "done", ...data });
};

module.exports = {getResultStatusController};