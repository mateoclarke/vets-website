import features from '~/platform/utilities/tests/header-footer/mocks/features';
import * as h from '~/platform/utilities/tests/header-footer/utilities/helpers';

describe('global header', () => {
  const verifyElement = selector =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible');

  const verifyLinkWithoutSelector = (index, text, href) =>
    cy
      .get('a')
      .eq(index)
      .should('be.visible')
      .should('contain.text', text)
      .should('have.attr', 'href')
      .and('include', href);

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

  describe('desktop header', () => {
    it('should correctly load all of the header elements', () => {
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      verifyElement('.header');

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          verifyElement('.va-crisis-line');
          verifyElement('.va-notice--banner');
          verifyElement('.va-header-logo-wrapper');
          verifyElement(
            '[alt="VA logo and Seal, U.S. Department of Veterans Affairs"]',
          );
          verifyElement('.sitewide-search-drop-down-panel-button');
          verifyLinkWithoutSelector(1, 'Contact us', '/contact-us');
          verifyElement('.sign-in-link');
          verifyElement('#vetnav');
          verifyElement('[data-e2e-id*="va-benefits-and-health-care"]');
          verifyElement('[data-e2e-id*="about-va"]');

          // Benefit hub menus and About VA menu with links are tested
          // in the /mega-menu directory tests folder

          verifyElement('[data-e2e-id*="find-a-va-location"]');
        });
    });
  });

  describe('mobile header', () => {
    it('should correctly load all of the header elements', () => {
      cy.viewport('iphone-4');
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      verifyElement('.header');

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          verifyElement('#header-crisis-line');
          verifyElement('.header-logo-row svg');
          verifyElement('.sign-in-link');

          const menuSelector = '.header-menu-button';
          verifyElement(menuSelector);
          const menuAndCloseButton = () => cy.get(menuSelector);

          menuAndCloseButton().contains('Menu');
          h.clickButton(menuSelector);
          menuAndCloseButton().contains('Close');

          h.verifyText('[for="header-search"]', 'Search');
          verifyElement('#search-header-dropdown-component');

          const searchContainer = () =>
            cy.get('#search-header-dropdown-component');

          searchContainer()
            .scrollIntoView()
            .within(() => {
              verifyElement('input');
              verifyElement('button');
            });

          verifyElement('#header-nav-items');

          const buttonContainer = () => cy.get('#header-nav-items');

          buttonContainer()
            .scrollIntoView()
            .within(() => {
              cy.get('li')
                .eq(0)
                .contains('VA Benefits and Health Care');

              cy.get('li')
                .eq(1)
                .contains('About VA');

              cy.get('li')
                .eq(2)
                .contains('Find a VA location');

              cy.get('li')
                .eq(3)
                .contains('Contact us');
            });

          // Benefit hub menus and About VA menu with links are tested
          // in the /mega-menu directory tests folder

          h.clickButton(menuSelector);
          menuAndCloseButton().contains('Menu');
        });
    });
  });
});
