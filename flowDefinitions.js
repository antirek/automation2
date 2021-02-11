module.exports = [
  {
    id: 'test2',
    params: {
      title: 'test',
    },
    steps: [
      {
        type: 'start',
        next: 'modifyCalldata',
      },
      {
        id: 'modifyCalldata',
        worker: 'modifyCalldataWorker',
        params: {
          validate: true,
          connectionId: 'crm',
        },
        next: 'detectWorktime',
      },
      {
        id: 'detectWorktime',
        worker: 'detectWorktimeWorker',
        params: {
          worktime: {
            startTime: '09:00',
            endTime: '18:00',
          }
        },
        nextVariants: {
          'worktime': 'sendMessageToCaller',
          'notworktime': 'delayToWorktime',
        },
      },
      {
        id: 'sendMessageToCaller',
        worker: 'sendMessageToCallerWorker',
        next: 'sendMessageToCallee',
      },
      {
        id: 'sendMessageToCallee',
        worker: 'sendMessageToCalleeWorker',
      },
      {
        id: 'delayToWorktime',
        worker: 'delayToWorktimeWorker',
        next: 'sendMessageToCaller',
      },
    ],
  },
  {
    id: 'test',
    params: {
      title: 'test',
    },
    steps: [
      {
        type: 'start',
        next: 'exec-httprequest',
      },
      {
        id: 'exec-httprequest',
        worker: 'httprequestExecutor',
        params: {
          validate: true,
          connectionId: 'crm',
        },
        next: 'delay',
      },
      {
        id: 'selector-one',
        worker: 'successFailSelector',
        params: {
          
        },
        nextVariants: {
          'success': 'successmodificator-email1',
          'fail': 'failmodificator-email2',
        },
      },
      {
        id: 'successmodificator-email1',
        worker: 'successhttprequest2emailModificator',
        next: 'executor-email',
      },
      {
        id: 'failmodificator-email2',
        worker: 'failhttprequest2email',
        next: 'executor-email',
      },
      {
        id: 'executor-email',
        worker: 'email',
      },
      {
        id: 'delay',
        worker: 'delay',
        params: {
          until: '2021-01-01',
        },
      },
    ],
  },
];
