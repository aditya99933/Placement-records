const { getResult } = require("../utils/resultCache.js");
const getResultStatusController = (req, res) => {
  console.log("STATUS HIT:", req.params.requestId);

  const data = getResult(req.params.requestId);

  if (!data) {
    return res.json({ status: "processing" });
  }

  res.json({ status: "done", ...data });
};

module.exports = {getResultStatusController};