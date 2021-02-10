
const {StepWorker} = require('./../lib/stepWorker');
const {logSteptask} = require('./../lib/logsteptask');

class DelayWorker extends StepWorker {
  async process (job) {
    console.log(job.data);
    const stepTask = job.data;

    const params = stepTask.step.params;    // хранятся во flowDefinition
    const input = stepTask.input;           // от предыдущего шага

    await logSteptask(stepTask, this.workerName, 'start', 'info', JSON.stringify({params, input}));

    const result = 'delay success';
    stepTask.result = result;
    console.log('result', result);

    this.readyQueue.add('executor', stepTask, {delay: 5000, removeOnComplete: true, });
    console.log('result', result);
    await logSteptask(stepTask, this.workerName, 'end', 'info', result);
  }
}


module.exports = {DelayWorker};