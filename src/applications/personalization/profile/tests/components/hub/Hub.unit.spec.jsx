import React from 'react';
import { expect } from 'chai';

import { renderWithProfileReducersAndRouter } from '@@profile/tests/unit-test-helpers';
import { Hub } from '@@profile/components/hub/Hub';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { PROFILE_PATHS } from '../../../constants';

function createInitialState(
  { badAddress, signInServiceName } = {
    badAddress: false,
    signInServiceName: 'idme',
  },
) {
  return {
    featureToggles: {
      loading: false,
      [Toggler.TOGGLE_NAMES.profileUseHubPage]: true,
    },
    user: {
      profile: {
        veteranStatus: {
          status: 'OK',
        },
        vapContactInfo: {
          mailingAddress: {
            badAddress,
          },
        },
        signIn: {
          serviceName: signInServiceName,
        },
      },
    },
  };
}

const defaultOptions = {
  path: PROFILE_PATHS.PROFILE_ROOT,
  badAddress: false,
  signInServiceName: 'idme',
};

const setup = (options = defaultOptions) => {
  const optionsWithDefaults = { ...defaultOptions, ...options };
  return renderWithProfileReducersAndRouter(<Hub />, {
    initialState: createInitialState(optionsWithDefaults),
    path: optionsWithDefaults.path,
  });
};

describe('<Hub />', () => {
  it('should render without crashing', () => {
    const { getByText } = setup();
    expect(getByText('Profile', { selector: 'h1' })).to.exist;
  });

  it('should render BadAddressAlert when hasBadAddress is true', () => {
    const { getByTestId } = setup({ badAddress: true });
    expect(getByTestId('bad-address-profile-alert')).to.exist;
  });

  it('should not render BadAddressAlert when hasBadAddress is false', () => {
    const { queryByTestId } = setup({ badAddress: false });
    expect(queryByTestId('bad-address-profile-alert')).to.not.exist;
  });

  Object.values(SERVICE_PROVIDERS).forEach(service => {
    it('should render with the correct service name and link', () => {
      const { container } = setup({
        signInServiceName: service.policy,
      });
      expect(
        container.querySelector(
          `[text="Update your sign-in info on the ${service.label} website"]`,
        ),
      ).to.exist;
      expect(container.querySelector(`[href="${service.link}"]`)).to.exist;
    });
  });
});
