
const availableSteps = [
  {
    stepName: 'modifyCalldataWorker',
    vars: {
      in: ['callData'],
      out: ['simpleData'],
    },
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
