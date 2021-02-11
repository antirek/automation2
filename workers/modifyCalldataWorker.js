const {StepWorker} = require('./../lib/stepWorker');

class ModifyCalldataWorker extends StepWorker {
  async do (params, input) {
    const calldata = input;

    const result = 'modified calldata';
    return result;
  }
}

module.exports = {ModifyCalldataWorker};