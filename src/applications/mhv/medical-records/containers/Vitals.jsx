import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import RecordList from '../components/RecordList/RecordList';
import { getVitals } from '../actions/vitals';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { recordType, vitalTypes, pageTitles } from '../util/constants';
import { updatePageTitle } from '../../shared/util/helpers';

const Vitals = () => {
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const [cards, setCards] = useState(null);
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getVitals());
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          { url: '/my-health/medical-records/', label: 'Medical records' },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.VITALS_PAGE_TITLE);
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (vitals?.length) {
        setCards([
          vitals.find(vital => vital.type === vitalTypes.BLOOD_PRESSURE),
          vitals.find(vital => vital.type === vitalTypes.BREATHING_RATE),
          vitals.find(vital => vital.type === vitalTypes.PULSE),
          vitals.find(vital => vital.type === vitalTypes.HEIGHT),
          vitals.find(vital => vital.type === vitalTypes.TEMPERATURE),
          vitals.find(vital => vital.type === vitalTypes.WEIGHT),
          vitals.find(vital => vital.type === vitalTypes.PAIN),
        ]);
      }
    },
    [vitals],
  );

  const content = () => {
    if (cards?.length) {
      return (
        <RecordList
          records={cards}
          type={recordType.VITALS}
          perPage={7}
          hidePagination
        />
      );
    }
    if (vitals?.length === 0) {
      return (
        <div className="vads-u-margin-bottom--3">
          <va-alert background-only status="info">
            You don’t have any records in Vitals
          </va-alert>
        </div>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
    );
  };

  return (
    <div id="vitals">
      <h1 className="vads-u-margin--0">Vitals</h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
        Vitals are basic health numbers your providers check at your
        appointments.
      </p>
      {content()}
    </div>
  );
};

export default Vitals;
