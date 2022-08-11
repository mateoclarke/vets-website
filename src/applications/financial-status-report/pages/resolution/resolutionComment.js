import ResolutionAdditional from '../../components/ResolutionAdditional';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': ' ',
      resolutionComment: {
        'ui:widget': ResolutionAdditional,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        required: ['resolutionComment'],
        properties: {
          resolutionComment: {
            type: 'string',
          },
        },
      },
    },
  },
};
