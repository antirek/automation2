
const {StepWorker} = require('./../lib/stepWorker');

class SendMessageToCallee extends StepWorker {
  async do (stepTask, storeData) {

    console.log('storeData', storeData);

    const to = storeData
    console.log('!!!!!!!! to ', to);
    const result = 'send mail success' + to;
    return {result};
  }
}

module.exports = {SendMessageToCallee};