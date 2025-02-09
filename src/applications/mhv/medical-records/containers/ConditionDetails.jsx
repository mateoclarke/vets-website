import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { makePdf } from '../util/helpers';
import ItemList from '../components/shared/ItemList';
import {
  getConditionDetails,
  clearConditionDetails,
} from '../actions/conditions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import PrintDownload from '../components/shared/PrintDownload';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import {
  updatePageTitle,
  generatePdfScaffold,
} from '../../shared/util/helpers';
import { EMPTY_FIELD, pageTitles } from '../util/constants';

const ConditionDetails = props => {
  const { runningUnitTest } = props;
  const record = useSelector(state => state.mr.conditions.conditionDetails);
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { conditionId } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/conditions',
            label: 'Conditions',
          },
        ]),
      );
      return () => {
        dispatch(clearConditionDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (conditionId) dispatch(getConditionDetails(conditionId));
    },
    [conditionId, dispatch],
  );

  useEffect(
    () => {
      if (record?.name) {
        focusElement(document.querySelector('h1'));
        const titleDate = record !== EMPTY_FIELD ? `${record} - ` : '';
        updatePageTitle(
          `${titleDate}${record.name} - ${
            pageTitles.HEALTH_CONDITIONS_PAGE_TITLE
          }`,
        );
      }
    },
    [record],
  );

  const generateConditionDetails = async () => {
    const title = `Conditions: ${record.name} on ${record.date}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      items: [
        {
          title: 'Date',
          value: record.date,
          inline: true,
        },
        {
          title: 'Provider',
          value: record.provider,
          inline: true,
        },
        {
          title: 'Provider Notes',
          value: record.note,
          inline: !record.comments.length,
        },
        {
          title: 'Status of health condition',
          value: record.active,
          inline: true,
        },
        {
          title: 'Location',
          value: record.facility,
          inline: true,
        },
        {
          title: 'SNOMED Clinical term',
          value: record.name,
          inline: true,
        },
      ],
    };

    const pdfName = `VA-Conditions-details-${user.userFullName.first}-${
      user.userFullName.last
    }-${moment()
      .format('M-D-YYYY_hhmmssa')
      .replace(/\./g, '')}`;

    makePdf(pdfName, scaffold, 'Health condition details', runningUnitTest);
  };

  const download = () => {
    generateConditionDetails();
  };

  const content = () => {
    if (record) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0"
            aria-describedby="condition-date"
            data-dd-privacy="mask"
          >
            {record.name.split(' (')[0]}
          </h1>
          <div className="condition-subheader vads-u-margin-bottom--3">
            <div className="time-header">
              <h2
                className="vads-u-font-size--base vads-u-font-family--sans"
                id="condition-date"
              >
                Date entered:{' '}
                <span
                  className="vads-u-font-weight--normal"
                  data-dd-privacy="mask"
                  data-testid="header-time"
                >
                  {record.date}
                </span>
              </h2>
            </div>
            <PrintDownload
              download={download}
              allowTxtDownloads={allowTxtDownloads}
            />
            <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          </div>
          <div className="condition-details max-80">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Status of health condition
            </h2>
            <p data-dd-privacy="mask">{record.active}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Provider
            </h2>
            <p data-dd-privacy="mask">{record.provider}</p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Location
            </h2>
            <p data-dd-privacy="mask">
              {record.facility || 'There is no facility reported at this time'}
            </p>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              SNOMED Clinical term
            </h2>
            <p data-dd-privacy="mask">{record.name}</p>
            <h2 className="vads-u-margin-bottom--0">Provider notes</h2>
            <ItemList list={record.comments} />
          </div>
        </>
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
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default ConditionDetails;

ConditionDetails.propTypes = {
  runningUnitTest: PropTypes.bool,
};
