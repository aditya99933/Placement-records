const jobQueue = [];

let activeWorkers = 0; // 👈 private to this module

const MAX_WORKERS = 1;
const MAX_QUEUE_SIZE = 10;

const getActiveWorkers = () => activeWorkers;

const incrementWorkers = () => {
  activeWorkers++;
};

const decrementWorkers = () => {
  activeWorkers = Math.max(0, activeWorkers - 1); // 🔥 SAFE
};
 
module.exports = {
  jobQueue,
  MAX_WORKERS,
  MAX_QUEUE_SIZE,
  getActiveWorkers,
  incrementWorkers,
  decrementWorkers,
};