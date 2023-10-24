import React from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ProofingMap from './components/ProofingMap';
import LocationOptions from './components/LocationOptions';

export default function LocationSelectorScreen({
  onPageChange,
  location,
  setLocation,
}) {
  const handleSubmit = event => {
    event.preventDefault();
  };

  return (
    <body className="page map-page">
      <div className="container">
        <div className="white-box">
          <br />
          <h1>Choose a nearby site</h1>
          <div className="text">
            <p>
              At this time In-person Identity Verification is available by
              walk-in appointment only. Enter your postal code below to find
              participating VA Medical Centers near you.
            </p>

            <VaSearchInput
              label="Search"
              onSubmit={e => handleSubmit(e)}
              value="21201"
              buttonText="Search"
            />

            <ProofingMap location={location} />

            <LocationOptions location={location} setLocation={setLocation} />

            <div className="wrapper">
              <button
                type="button"
                className="usa-button mo-full-width-btn"
                onClick={() => onPageChange(3)}
              >
                Continue
              </button>
            </div>
            <div className="wrapper">
              <button
                type="button"
                className="usa-button-secondary mo-full-width-btn"
                onClick={() => onPageChange(1)}
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
