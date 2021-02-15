const {StepWorker} = require('./../lib/stepWorker');

class DetectWorktimeWorker extends StepWorker {
  type = 'selector';

  paramsSchema = [
    {
      name: 'startHour',
      type: "string",
    },
    {
      name: 'endHour',
      type: "string",
    },
  ];

  nextVariantsSchema = [
    'worktime',
    'notworktime',
  ];

  varsOutSchema = [
    {
      name: 'delayToWorktime',
      type: 'string',
      description: 'количество секунд до начала следующего рабочего интервала',
    }
  ];

  async do (stepTask, inputData) {
    console.log('next variants', stepTask.step.nextVariants);

    const date = new Date();
    const currentHour = date.getHours();
    const params = stepTask.step.params;

    console.log('detect worktime', {
      currentHour,
      startHour: Number(params.startHour),
      endHour: Number(params.endHour),
    });

    const nextStepLabel = (Number(currentHour) < Number(params.startHour) || Number(currentHour) > Number(params.endHour)) 
      ? 'notworktime' : 'worktime';

    const result = {delayToWorktime: '30'};

    const next = stepTask.step.nextVariants[nextStepLabel];
    return {result, next};
  };
}

module.exports = {DetectWorktimeWorker};