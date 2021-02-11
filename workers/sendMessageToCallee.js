
const {StepWorker} = require('./../lib/stepWorker');

class SendMessageToCallee extends StepWorker {
  async do (stepTask) {

    const to = await this.store.getData(stepTask.taskId, 'to');
    console.log('!!!!!!!! to ', to);
    const result = 'send mail success' + to;
    return {result};
  }
}

module.exports = {SendMessageToCallee};