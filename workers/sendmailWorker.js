const {StepWorker} = require('./../lib/stepWorker');

class SendmailWorker extends StepWorker {
  async do (stepTask) {
    const result = 'send mail success';
    return {result};
  }
}

module.exports = {SendmailWorker};