
const availableSteps = [
  {
    stepName: 'modifyCalldataWorker',
    inputType: 'callData',
    outputType: 'simpleData',
  },
  {
    stepName: 'detectWorktimeWorker',
    paramsType: worktimeSheet,
    inputType: null,
    outputType: null,
  },
  {
    stepName: 'sendMessageToCallerWorker',
    inputType: 'messageData',
    outputType: null,
  },
];
