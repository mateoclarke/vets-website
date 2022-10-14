export const uiSchema = {
  'ui:title': 'Your work history -- test 1',
  testArray: {
    'ui:title': 'testArray',
    items: {
      'ui:title': 'testArray item',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    testArray: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
  },
};
