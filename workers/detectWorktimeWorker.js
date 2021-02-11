const {StepWorker} = require('./../lib/stepWorker');

class DetectWorktimeWorker extends StepWorker {
  type = 'selector';
  async do (params, input) {

    const result = 'detect worktime';
    return result;
  }
}

module.exports = {DetectWorktimeWorker};