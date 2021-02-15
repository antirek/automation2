const {StepWorker} = require('./../lib/stepWorker');

class SendmailWorker extends StepWorker {
  async do (stepTask) {
    const result = 'send mail success';
    return {result};
  }
}

SendmailWorker.step = 'sendmail';

module.exports = {SendmailWorker};