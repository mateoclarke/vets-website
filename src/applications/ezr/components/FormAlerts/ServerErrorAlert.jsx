import React from 'react';
import content from '../../locales/en/content.json';

const ServerErrorAlert = () => (
  <va-alert status="error" uswds>
    <h3 slot="headline">{content['alert-server-title']}</h3>
    <p>{content['alert-server-message']}</p>
  </va-alert>
);

export default ServerErrorAlert;
