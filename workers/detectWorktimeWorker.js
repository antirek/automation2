const {StepWorker} = require('./../lib/stepWorker');

class DetectWorktimeWorker extends StepWorker {
  type = 'selector';
  async do (stepTask) {
    console.log('next variants', stepTask.step.nextVariants);

    const result = stepTask.input;
    const next = stepTask.step.nextVariants.worktime;
    return {result, next};
  }
}

module.exports = {DetectWorktimeWorker};