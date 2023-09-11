import '@department-of-veterans-affairs/platform-polyfills';
import './sass/vaos.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/router';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import makeFlipperClient from '@department-of-veterans-affairs/platform-utilities/flipper-client';
import createRoutesWithStore from './routes';
import manifest from './manifest.json';
import reducer from './redux/reducer';

async function fetchFeatureToggles() {
  const flipperClient = makeFlipperClient();
  return flipperClient.fetchToggleValues().then(resp => {
    return resp;
  });
}

async function getRootUrl() {
  const toggles = await fetchFeatureToggles();

  if (environment.isProduction()) return manifest.rootUrl;

  if (toggles.vaOnlineSchedulingBreadcrumbUrlUpdate) return manifest.newRootUrl;

  return manifest.rootUrl;
}

// NOTE: Changed to call 'startApp' this way to get around the 'The top-level-await
// experiment is not enabled (set experiments.topLevelAwait: true to enabled it)'
// compile error.
// The intent is to change the BrowserRouter basename depending on whether or not
// the vaOnlineSchedulingBreadcrumbUrlUpdate feature flag is set.
(async () => {
  const url = await getRootUrl();
  startApp({
    url,
    createRoutesWithStore,
    reducer,
    entryName: manifest.entryName,
  });
})();
