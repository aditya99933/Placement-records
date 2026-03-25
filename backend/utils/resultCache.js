const cache = new Map();

const setResult = (id, data) => {
  cache.set(id, data);
  setTimeout(() => {
    cache.delete(id);
  }, 3 * 60 * 1000);
};

const getResult = (id) => {
  return cache.get(id);
};

module.exports = { setResult, getResult };
