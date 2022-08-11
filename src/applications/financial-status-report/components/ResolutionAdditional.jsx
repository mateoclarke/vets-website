import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';

const inputLabel = selection => {
  switch (selection) {
    case 'payments':
      return 'How much can you afford to pay monthly on this debt?';
    case 'compromise':
      return 'How much can you afford to pay as a one-time payment?';
    default:
      return 'By checking this box, I’m agreeing that I understand that forgiveness of education debt will reduce any remaining education benefit I may have.';
  }
};

const ResolutionAdditional = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];
  const { deductionCode, benefitType, resolutionOption } = currentDebt;
  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...formData,
        selectedDebtsAndCopays: [
          ...selectedDebtsAndCopays.slice(0, formContext.pagePerItemIndex),
          {
            ...currentDebt,
            resolutionComment: target.value,
          },
          ...selectedDebtsAndCopays.slice(formContext.pagePerItemIndex + 1),
        ],
      }),
    );
  };

  return (
    <div>
      <h3>
        Debt {parseInt(formContext.pagePerItemIndex, 10) + 1} of{' '}
        {selectedDebtsAndCopays.length}:{' '}
        {deductionCodes[deductionCode] || benefitType}
      </h3>
      {resolutionOption === 'payments' || resolutionOption === 'compromise' ? (
        <va-number-input
          className="schemaform-currency-input input-size-3"
          inputmode="decimal"
          label={inputLabel(resolutionOption)}
          name="my-input"
          error="Please enter a valid dollar amount."
          min="0.00"
          onBlur={function noRefCheck() {}}
          onInput={onChange}
          required
          value={currentDebt.resolutionComment ?? 0.0}
        />
      ) : (
        <div className="vads-u-display--flex vads-u-margin-y--2">
          {/* <input
            name="waiver-confirmation"
            id={copay.id}
            type="checkbox"
            checked={isChecked || false}
            className="vads-u-width--auto"
            onChange={() => onChange(copay)}
          />
          <label className="vads-u-margin--0" htmlFor={copay.id}>
            {inputLabel(resolutionOption)}
          </label> */}
        </div>
      )}
    </div>
  );
};

ResolutionAdditional.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.number.isRequired,
  }),
};

export default ResolutionAdditional;
