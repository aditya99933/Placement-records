const rateLimitMiddleware = async (req, res, next) => {
  const user = req.user;
  const today = new Date().toDateString();

  if (user.lastSearchDate !== today) {
    user.searchesDone = 0;
    user.lastSearchDate = today;
  }

  if (user.searchesDone >= 4) {
    return res.status(429).json({ error: "Search limit reached. Max 4 searches per day allowed." });
  }

  user.searchesDone += 1;
  await user.save();
  next();
};

module.exports = rateLimitMiddleware;
