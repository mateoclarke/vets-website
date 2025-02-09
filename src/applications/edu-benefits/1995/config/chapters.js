import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';
import environment from 'platform/utilities/environment';
import createContactInformationPage from '../../pages/contactInformation';
import createOldSchoolPage from '../../pages/oldSchool';
import createDirectDepositChangePage from '../../pages/directDepositChange';
import createDirectDepositChangePageUpdate from '../../pages/directDepositChangeUpdate';

import {
  benefitSelection,
  benefitSelectionUpdate,
  dependents,
  militaryHistory,
  newSchool,
  newSchoolUpdate,
  servicePeriods,
} from '../pages';

export const chapters = {
  applicantInformation: {
    title: 'Applicant information',
    pages: {
      applicantInformation: createApplicantInformationPage(fullSchema1995, {
        isVeteran: true,
        fields: [
          'veteranFullName',
          'veteranSocialSecurityNumber',
          'view:noSSN',
          'vaFileNumber',
        ],
        required: ['veteranFullName'],
      }),
    },
  },
  benefitSelection: {
    title: 'Education benefit',
    pages: {
      benefitSelection: {
        title: 'Education benefit selection',
        path: 'benefits/eligibility',
        uiSchema: environment.isProduction()
          ? benefitSelection.uiSchema
          : benefitSelectionUpdate.uiSchema,
        schema: environment.isProduction()
          ? benefitSelection.schema
          : benefitSelectionUpdate.schema,
      },
    },
  },
  militaryService: {
    title: 'Service history',
    pages: {
      servicePeriods: {
        path: 'military/service',
        title: 'Service periods',
        uiSchema: servicePeriods.uiSchema,
        schema: servicePeriods.schema,
      },
      militaryHistory: {
        title: 'Military history',
        depends: () => environment.isProduction(),
        path: 'military/history',
        uiSchema: militaryHistory.uiSchema,
        schema: militaryHistory.schema,
      },
    },
  },
  schoolSelection: {
    title: 'School selection',
    pages: {
      newSchool: {
        path: 'school-selection/new-school',
        title:
          'School, university, program, or training facility you want to attend',
        initialData: {
          newSchoolAddress: {},
        },
        uiSchema: environment.isProduction()
          ? newSchool.uiSchema
          : newSchoolUpdate.uiSchema,
        schema: environment.isProduction()
          ? newSchool.schema
          : newSchoolUpdate.schema,
      },
      oldSchool: createOldSchoolPage(fullSchema1995),
    },
  },
  personalInformation: {
    title: 'Personal information',
    pages: {
      contactInformation: createContactInformationPage(fullSchema1995),
      dependents: {
        title: 'Dependents',
        path: 'personal-information/dependents',
        depends: form => {
          return (
            environment.isProduction() &&
            form['view:hasServiceBefore1978'] === true
          );
        },
        uiSchema: dependents.uiSchema,
        schema: dependents.schema,
      },
      directDeposit: environment.isProduction()
        ? createDirectDepositChangePage(fullSchema1995)
        : createDirectDepositChangePageUpdate(fullSchema1995),
    },
  },
};
