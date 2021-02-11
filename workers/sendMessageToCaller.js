const {StepWorker} = require('./../lib/stepWorker');

class SendMessageToCaller extends StepWorker {
  async do (stepTask) {
    const result = 'send mail success';
    return {result};
  }
}

module.exports = {SendMessageToCaller};