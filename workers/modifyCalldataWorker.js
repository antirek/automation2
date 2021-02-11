const {StepWorker} = require('./../lib/stepWorker');

class ModifyCalldataWorker extends StepWorker {
  async do (stepTask) {
    const calldata = stepTask.input;

    const result = 'modified calldata';
    return {result};
  }
}

module.exports = {ModifyCalldataWorker};