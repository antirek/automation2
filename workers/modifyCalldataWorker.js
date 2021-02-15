const {StepWorker} = require('./../lib/stepWorker');

class ModifyCalldataWorker extends StepWorker {
  async do (stepTask, storeData) {
    const calldata = storeData.calldata;
    

    this.store.setData('10', '11', {eerer:12});
    console.log('stepId', stepTask.taskId);

    return {
      result: {
        simpleData: {
          to: '1212',
          from: '122111',
          time: '12111212',
        }
      }
    };
  }
}

ModifyCalldataWorker.step = 'modifyCalldata';

module.exports = {ModifyCalldataWorker};