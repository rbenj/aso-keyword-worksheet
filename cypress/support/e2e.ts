/// <reference types="@testing-library/cypress" />

import '@testing-library/cypress/add-commands';

beforeEach(() => {
  cy.clearLocalStorage();
});
