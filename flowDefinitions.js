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
        type: 'executor',
        worker: 'modifyCalldataWorker',
        params: {
          validate: true,
          connectionId: 'crm',
        },
        next: 'detectWorktime',
      },
      {
        id: 'detectWorktime',
        type: 'selector',
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
        type: 'executor',
        worker: 'sendMessageToCallerWorker',
        next: 'sendMessageToCallee',
      },
      {
        id: 'sendMessageToCallee',
        type: 'executor',
        worker: 'sendMessageToCalleeWorker',
      },
      {
        id: 'delayToWorktime',
        type: 'executor',
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
        type: 'executor',
        worker: 'httprequestExecutor',
        params: {
          validate: true,
          connectionId: 'crm',
        },
        next: 'delay',
      },
      {
        id: 'selector-one',
        type: 'selector',
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
        type: 'executor',
        worker: 'successhttprequest2emailModificator',
        next: 'executor-email',
      },
      {
        id: 'failmodificator-email2',
        type: 'executor',
        worker: 'failhttprequest2email',
        next: 'executor-email',
      },
      {
        id: 'executor-email',
        type: 'executor',
        worker: 'email',
      },
      {
        id: 'delay',
        type: 'executor',
        worker: 'delay',
        params: {
          until: '2021-01-01',
        },
        // next: 'selector-one',
      },
    ],
  },
];
