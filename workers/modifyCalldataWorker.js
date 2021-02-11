const {StepWorker} = require('./../lib/stepWorker');

class ModifyCalldataWorker extends StepWorker {
  async do (stepTask) {
    const calldata = stepTask.input;

    const result = 'modified calldata';
    console.log('stepId', stepTask.taskId);

    await this.store.setData(stepTask.taskId, 'to', {data: '110@mobilon.ru'});
    await this.store.setData(stepTask.taskId, 'from', {data: '1212@mobilon.ru'});
    return {result};
  }
}

module.exports = {ModifyCalldataWorker};