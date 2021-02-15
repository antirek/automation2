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
        vars: {
          out: ['calldata'],
        }
      },
      {
        id: 'modifyCalldata',
        worker: 'modifyCalldataWorker',
        vars: {
          in: ['calldata'],
          out: ['simpleData'],
        },
        params: {
          validate: true,
          connectionId: 'crm',
        },
        next: 'prepareMessages',
      },
      {
        id: 'prepareMessages',
        worker: 'prepareMessages',
        vars: {
          in: ['simpleData'],
          out: [
            'callerNumber',
            'calleeNumber',
            'callerMessage',
            'calleeMessage',
          ],
        },
        params: {
          callerMessageTemplate: '',
          calleeMessageTemplate: '',
        },
        next: 'detectWorktime',
      },
      {
        id: 'detectWorktime',
        worker: 'detectWorktimeWorker',
        params: {
          startHour: '09',
          endHour: '10',
        },
        nextVariants: {
          'worktime': 'sendMessageToCaller',
          'notworktime': 'delayToWorktime',
        },
        vars: {
          out: ['delayToWorktime'],
        }
      },
      {
        id: 'sendMessageToCaller',
        worker: 'sendMessageWorker',
        next: 'sendMessageToCallee',
        vars: {
          in: [
            'to:callerNumber',
            'message:callerMessage',
          ],
          out: [
            'status:callerStatus',
          ],
        },
      },
      {
        id: 'sendMessageToCallee',
        worker: 'sendMessageWorker',
        vars: {
          in: [
            'to:calleeNumber',
            'message:calleeMessage',
          ],
          out: [
            'status:calleeStatus',
          ],
        },
      },
      {
        id: 'delayToWorktime',
        vars: {
          in: [
            'delay:delayToWorktime',
          ]
        },
        worker: 'delayWorker',
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
