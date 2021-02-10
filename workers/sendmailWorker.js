const {StepWorker} = require('./../lib/stepWorker');
const {logSteptask} = require('./../lib/logsteptask');

class SendmailWorker extends StepWorker {
  async process (job) {
    console.log(job.data);
    const stepTask = job.data;
    await logSteptask(stepTask, this.workerName, 'start');
      
    const result = 'send mail success';
    stepTask.result = result;
    console.log('result', result);

    this.readyQueue.add('executor', stepTask, {removeOnComplete: true, });
    console.log('result', result);
    await logSteptask(stepTask, this.workerName, 'end', 'info', result);
  }
}

module.exports = {SendmailWorker};