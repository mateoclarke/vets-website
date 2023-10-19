import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';
import { aboutVALinks } from './about-va-links';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - about va', () => {
  Cypress.config({
    includeShadowDom: true,
    waitForAnimations: true,
    pageLoadTimeout: 120000,
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('/v0/maintenance_windows', {
      data: [],
    }).as('maintenanceWindows');
    cy.intercept('POST', 'https://www.google-analytics.com/*', {}).as(
      'analytics',
    );
  });

  const verifyAboutVALinks = (staticLinks = null) => {
    for (const columnData of aboutVALinks) {
      for (const link of columnData.links) {
        h.verifyLink(`a[data-e2e-id*="${link.id}"]`, link.text, link.href);

        // Only need to check the header-footer-data.json links once (on desktop)
        if (staticLinks) {
          const staticLink = staticLinks?.filter(
            hardCodedLink => hardCodedLink.text === link.text,
          )[0];

          if (!staticLink) {
            throw new Error(
              `Unable to find a matching link in header-footer-data.json for ${
                link.text
              }`,
            );
          }

          if (
            staticLink?.href !== link.href ||
            staticLink?.text !== link.text
          ) {
            throw new Error(
              `Link attributes for ${
                link.text
              } do not match those in header-footer-data.json`,
            );
          }
        }
      }
    }
  };

  const verifyAboutVAHeaders = staticHeaders => {
    for (const column of aboutVALinks) {
      h.verifyText(column.desktopId, column.title);

      // Only need to check the header-footer-data.json headers once (on desktop)
      if (staticHeaders) {
        const staticHeader = staticHeaders?.filter(
          head => head === column.title,
        )?.[0];

        if (!staticHeader?.length) {
          throw new Error(
            `Unable to find a matching header in header-footer-data.json for ${
              column.title
            }`,
          );
        }
      }
    }
  };

  const verifyAboutVADesktopMenu = () => {
    const aboutVAButton = '[data-e2e-id="about-va-1"]';

    h.verifyElement(aboutVAButton);
    h.clickButton(aboutVAButton);

    const staticColumnsData = h.getStaticColumnsDataForAboutVA();
    const staticLinks = Object.keys(staticColumnsData)
      .map(columnData => staticColumnsData[columnData]?.links)
      .flat();

    verifyAboutVALinks(staticLinks);

    const staticHeaders = Object.keys(staticColumnsData).map(
      columnData => staticColumnsData[columnData]?.title,
    );

    verifyAboutVAHeaders(staticHeaders);
  };

  describe('desktop menu', () => {
    it('should correctly load all of the about va elements', () => {
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      h.verifyElement('.header');

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          verifyAboutVADesktopMenu();
        });
    });
  });

  describe('mobile menu', () => {
    it('should correctly load all of the about va elements', () => {
      cy.viewport(400, 1000);
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      const menuSelector = '.header-menu-button';
      h.verifyElement(menuSelector);
      h.clickButton(menuSelector);

      const headerNav = () => cy.get('#header-nav-items');
      const aboutVAButton = () => cy.get('.header-menu-item-button').eq(1);

      headerNav().within(() => {
        aboutVAButton().click();

        const aboutVASections = () => cy.get('ul[aria-label="About VA"]');

        h.verifyElement('ul[aria-label="About VA"]');

        // console.log('looking inside the UL');
        aboutVASections().within(() => {
          for (const section of aboutVALinks) {
            h.verifyText(section.mobileId, section.title);
            h.verifyElement(section.mobileId);
            h.clickButton(section.mobileId);

            for (const link of section.links) {
              h.verifyLink(
                `a[data-e2e-id*="${link.id}"]`,
                link.text,
                link.href,
              );
            }

            const backToMenuButton = () => cy.get('#header-back-to-menu');
            h.verifyElement('#header-back-to-menu');
            backToMenuButton().click();
          }
        });
      });
    });
  });
});
