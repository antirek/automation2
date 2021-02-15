
const {StepWorker} = require('./../lib/stepWorker');

class DelayWorker extends StepWorker {
  delay;

  async do (stepTask, inputData) {

    const delay = inputData.delay;
    this.delay = Number(delay) * 1000;

    const result = {message: `delay task created success ${this.delay}`, status: 'OK'};
    console.log('result', result);
    return {result};
  }

  async passResultToReadyQueue (stepTask) {
    this.readyQueue.add('executor', stepTask, {delay: this.delay, removeOnComplete: true, });
  }
}

module.exports = {DelayWorker};