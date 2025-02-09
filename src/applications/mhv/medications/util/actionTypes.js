export const Actions = {
  Breadcrumbs: {
    SET_BREAD_CRUMBS: 'SM_SET_BREAD_CRUMBS',
  },
  Prescriptions: {
    GET: 'RX_PRESCRIPTIONS_GET',
    GET_PAGINATED_SORTED_LIST: 'RX_PRESCRIPTIONS_GET_PAGINATED_SORTED_LIST',
    SET_SORTED_LIST: 'RX_PRESCRIPTIONS_SET_SORTED_LIST',
    CLEAR_ERROR: 'RX_PRESCRIPTIONS_CLEAR_ERROR',
    FILL: 'RX_PRESCRIPTIONS_FILL',
    FILL_ERROR: 'RX_PRESCRIPTIONS_FILL_ERROR',
  },
  // TODO: consider re-using this from medical-records
  Allergies: {
    GET_LIST: 'RX_ALLERGIES_GET_LIST',
    GET_LIST_ERROR: 'RX_ALLERGIES_GET_LIST_ERROR',
    GET_LIST_ERROR_RESET: 'GET_LIST_ERROR_RESET',
  },
};
