module.exports = [
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
