import React, { useState } from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { setData } from 'platform/forms-system/src/js/actions';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const LoopBackPage = ({ goBack, goForward, data, goToPath, setFormData }) => {
  const [radio, setRadio] = useState(false);

  // Here is the tricky part
  const gotoNextPage = () => {
    // fun annoying truthy check, I got annoyed and just made it work
    // but anyhow, this is is going to be super tricky still.

    // we need to add a new item to the array if we're at the end of it, and
    // navigate to the appropriate page if not... example woudl be, I'm going back to edit
    // a specific employment history, and in between each one I see the loopback page.
    // This probably means we need to find a different approach with the design for adding AND REMOVING
    // employment histories.
    if (radio === 'true') {
      setFormData({
        ...data,
        testArray: [...data.testArray, { name: 'name3' }],
      });
    }

    // This is the magic, it will go to the next page if No is selected
    // and will looop back to the 'employment information' pages if Yes is selected
    const destinationPath = `/employment-test/${data.testArray.length + 1}`;
    return radio === 'true' ? goToPath(destinationPath) : goForward(data);
  };

  // This is some default stuffs from the following default page
  // https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-bypass-schema-form
  const navButtons = (
    <FormNavButtons goBack={goBack} goForward={gotoNextPage} />
  );

  return (
    <form>
      <fieldset>
        <legend
          id="emergency-contact-date-description"
          className="vads-u-font-family--serif"
          name="addIssue"
        >
          Welcome one and all to this hilarious mess of a page.
        </legend>
        {/**
         * Excuse the mess, this was done quickly lol
         */}
        <RadioButtons
          options={[
            { label: 'Yes', value: true, key: 1 },
            { label: 'No', value: false, key: 2 },
          ]}
          label="Add Another employment?"
          required
          value={radio}
          onValueChange={({ value }) => {
            setRadio(value);
          }}
        />
        {navButtons}
      </fieldset>
    </form>
  );
};

// map setData to component props
const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(LoopBackPage);
