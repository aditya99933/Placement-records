const cache = new Map();
const pending = new Map();
const RESULT_TTL_MS = Number(process.env.RESULT_CACHE_TTL_MS || 3 * 60 * 1000);
const PENDING_TTL_MS = Number(process.env.RESULT_PENDING_TTL_MS || 5 * 60 * 1000);

const setResult = (id, data) => {
  cache.set(id, data);
  pending.delete(id);
  setTimeout(() => {
    cache.delete(id);
  }, RESULT_TTL_MS);
};

const getResult = (id) => {
  return cache.get(id);
};

const markPending = (id) => {
  pending.set(id, Date.now());
  setTimeout(() => {
    pending.delete(id);
  }, PENDING_TTL_MS);
};

const isPending = (id) => pending.has(id);

module.exports = { setResult, getResult, markPending, isPending };
