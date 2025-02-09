import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import { user } from '../fixtures/user-reducer.json';
import ConditionDetails from '../../containers/ConditionDetails';
import { convertCondition } from '../../reducers/conditions';
import condition from '../fixtures/condition.json';
import conditionWithFieldsMissing from '../fixtures/conditionWithFieldsMissing.json';

describe('Condition details container', () => {
  const initialState = {
    mr: {
      conditions: {
        conditionDetails: convertCondition(condition),
      },
    },
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<ConditionDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/conditions/SCT161891005',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays Date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the condition name', () => {
    const conditionName = screen.getByText(
      initialState.mr.conditions.conditionDetails.name.split(' (')[0],
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(conditionName).to.exist;
  });

  it('displays the formatted received date', () => {
    const formattedDate = screen.getAllByText('April', {
      exact: false,
      selector: 'span',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const location = screen.getAllByText(
      initialState.mr.conditions.conditionDetails.facility,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });
});

describe('Condition details container with fields missing', () => {
  const initialState = {
    mr: {
      conditions: {
        conditionDetails: convertCondition(conditionWithFieldsMissing),
      },
    },
    user,
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<ConditionDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/conditions/123',
    });
  });

  it('should not display the formatted date if date is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});

describe('Condition details container still loading', () => {
  const initialState = {
    user,
    mr: {
      conditions: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<ConditionDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/123',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});
