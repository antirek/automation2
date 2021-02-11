
const {StepWorker} = require('./../lib/stepWorker');

class DelayWorker extends StepWorker {
  async do (params, input) {
    const result = 'delay success';
    return result;
  }

  async passResultToReadyQueue (stepTask) {
    this.readyQueue.add('executor', stepTask, {delay: 5000, removeOnComplete: true, });
  }
}

module.exports = {DelayWorker};