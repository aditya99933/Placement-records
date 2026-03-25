const jobQueue = [];

let activeWorkers = 0; // 👈 private to this module

const MAX_WORKERS = 2;
const MAX_QUEUE_SIZE = 100;

const getActiveWorkers = () => activeWorkers;

const incrementWorkers = () => {
  activeWorkers++;
};

const decrementWorkers = () => {
  activeWorkers--;
};
 
module.exports = {
  jobQueue,
  MAX_QUEUE_SIZE,
  getActiveWorkers,
  incrementWorkers,
  decrementWorkers,
};