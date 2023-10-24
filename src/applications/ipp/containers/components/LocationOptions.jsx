import React from 'react';
import mockLocations from '../../data/locations';

export default function LocationOptions({ location, setLocation }) {
  const toggleLocation = newLocation => {
    setLocation(newLocation);
  };

  return (
    <div>
      <fieldset className="usa-fieldset">
        <ul className="usa-card-group">
          {mockLocations.data.map((site, index) => {
            const { name } = site.attributes;
            const {
              address1,
              city,
              state,
              zip,
            } = site.attributes.address.physical;
            const { main, mentalHealthClinic } = site.attributes.phone;
            const isChecked = site.id === location.id;

            return (
              <li className="usa-card" key={index}>
                <div className="usa-card__container">
                  <div className="usa-radio">
                    <h2> {name}</h2>
                    <p>
                      {address1}
                      <br />
                      {city}, {state} {zip}
                      <br />
                      Main phone: {main}
                      <br />
                      Mental health care: {mentalHealthClinic}
                    </p>
                    <input
                      className="usa-radio__input"
                      id={site.id}
                      type="radio"
                      name="site-selection"
                      value={site.id}
                      checked={isChecked}
                      onClick={() => toggleLocation(site)}
                      onChange={() => toggleLocation(site)}
                    />
                    <label className="usa-radio__label" htmlFor={site.id}>
                      Verify at this site
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}
