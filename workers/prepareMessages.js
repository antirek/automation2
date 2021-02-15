const {StepWorker} = require('./../lib/stepWorker');

class PrepareMessagesWorker extends StepWorker {
  async do (stepTask, storeData) {
    const simpledata = storeData.simpleData;
    
    console.log('simpledata', simpledata);
    const result = 'modified calldata';
    console.log('stepId', stepTask.taskId);

    const callerNumber = '121212121212';
    const calleeNumber = '133333333333';

    const callerMessage = 'caller message';
    const calleeMessage = 'callee message';

    return {
      result: {
        callerNumber,
        calleeNumber,
        callerMessage,
        calleeMessage,
      },
    };
  }
}

PrepareMessagesWorker.step = 'prepareMessages';

module.exports = {PrepareMessagesWorker};