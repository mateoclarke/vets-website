import React from 'react';

export default function LocationConfirmationScreen({ onPageChange, location }) {
  const { name } = location.attributes;
  const { address1, city, state, zip } = location.attributes.address.physical;

  return (
    <body className="page">
      <div className="container">
        <div className="white-box">
          <br />
          <h1>Confirm your selection</h1>
          <div className="text">
            <p>You have chosen to verify at the following location:</p>
            <p>
              {name}
              <br />
              {address1}
              <br />
              {city}, {state} {zip}
            </p>
            <p>
              Please confirm that this is a location you will be able to visit
              in the next 10 days before continuing.
            </p>
            <div className="wrapper">
              <button
                type="button"
                className="usa-button mo-full-width-btn"
                onClick={() => onPageChange(4)}
              >
                Continue
              </button>
            </div>
            <div className="wrapper">
              <button
                type="button"
                className="usa-button-secondary mo-full-width-btn"
                onClick={() => onPageChange(2)}
              >
                Back
              </button>
            </div>
            <br />
          </div>
        </div>
      </div>
    </body>
  );
}
