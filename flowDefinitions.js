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
        worker: 'modifyCalldata',
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
        worker: 'detectWorktime',
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
        worker: 'sendMessage',
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
        worker: 'sendMessage',
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
        worker: 'delay',
        next: 'sendMessageToCaller',
      },
    ],
  },
];
