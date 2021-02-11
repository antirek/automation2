const {StepWorker} = require('./../lib/stepWorker');

class SendmailWorker extends StepWorker {
  async do (params, input) {
    const result = 'send mail success';
    return result;
  }
}

module.exports = {SendmailWorker};