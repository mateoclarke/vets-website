import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - careers and employment', () => {
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

  const careersEmployment =
    '[data-e2e-id="vetnav-level2--careers-and-employment"]';
  const viewAll = {
    id: 'view-all-in-careers-and-employment',
    href: '/careers-employment',
    text: 'View all in careers and employment',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get employment benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your career',
    },
  ];

  const links = [
    {
      id: 'about-veteran-readiness-and-employment-vr',
      href: '/careers-employment/vocational-rehabilitation',
      text: 'About Veteran Readiness and Employment (VR&E)',
    },
    {
      id: 'how-to-apply',
      href: '/careers-employment/vocational-rehabilitation/how-to-apply',
      text: 'How to apply',
    },
    {
      id: 'educational-and-career-counseling',
      href: '/careers-employment/education-and-career-counseling',
      text: 'Educational and career counseling',
    },
    {
      id: 'veteran-owned-small-business-support',
      href: '/careers-employment/veteran-owned-business-support',
      text: 'Veteran-owned small business support',
    },
    {
      id: 'apply-for-vr',
      href:
        '/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/',
      text: 'Apply for VR&E benefits',
    },
    {
      id: 'va-transition-assistance',
      href: 'https://www.benefits.va.gov/tap/',
      text: 'VA transition assistance',
    },
    {
      id: 'find-a-job',
      href: 'https://www.dol.gov/veterans/findajob/',
      text: 'Find a job',
    },
    {
      id: 'find-va-careers-and-support',
      href: '/jobs/',
      text: 'Find VA careers and support',
    },
    {
      id: 'print-your-civil-service-preference-letter',
      href: '/records/download-va-letters',
      text: 'Print your civil service preference letter',
    },
  ];

  describe('desktop menu', () => {
    it('should correctly load the elements', () => {
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      h.verifyElement('.header');

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          const vaBenefitsAndHealthCareButton =
            '[data-e2e-id="va-benefits-and-health-care-0"]';

          // VA Benefits and Health Care
          h.verifyElement(vaBenefitsAndHealthCareButton);
          h.clickButton(vaBenefitsAndHealthCareButton);

          // -> Careers and employment
          h.verifyMenuItems(
            careersEmployment,
            headings,
            links,
            viewAll,
            'Careers and employment',
          );
        });
    });
  });

  describe('mobile menu', () => {
    it('should correctly load the elements', () => {
      cy.viewport(400, 1000);
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      const menuSelector = '.header-menu-button';
      h.verifyElement(menuSelector);
      h.clickButton(menuSelector);

      const headerNav = () => cy.get('#header-nav-items');

      headerNav().within(() => {
        const vaBenefitsAndHealthCareButton = () =>
          cy.get('.header-menu-item-button').eq(0);
        vaBenefitsAndHealthCareButton().click();

        const careersEmploymentButton = () =>
          cy.get('.header-menu-item-button').eq(4);
        careersEmploymentButton().click();

        const backToMenuButton = () => cy.get('#header-back-to-menu');
        h.verifyElement(backToMenuButton);

        const headerMenu = () => cy.get('.header-menu');

        headerMenu()
          .scrollIntoView()
          .within(() => {
            for (const link of links) {
              h.verifyLink(`[data-e2e-id*="${link.id}"]`, link.text, link.href);
            }
          });
      });
    });
  });
});
