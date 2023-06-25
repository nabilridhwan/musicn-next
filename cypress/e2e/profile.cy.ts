describe('Profile', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('POST', '/api/login').as('completeLogin');
    cy.get('input[data-test-id="username-input"]').type(
      Cypress.env('VALID_MUSICN_EMAIL'),
    );
    cy.get('input[data-test-id="password-input"]').type(
      Cypress.env('VALID_MUSICN_PASSWORD'),
    );
    cy.get('[data-test-id="login-button"]').click();
    cy.wait('@completeLogin');
    cy.visit('/profile');
  });

  it('Shows me the correct user based off credentials', () => {
    cy.get('[placeholder="Username"]').should(
      'have.value',
      Cypress.env('VALID_EXPECTED_MUSICN_USERNAME'),
    );
  });

  it('Shows me the correct Musicn profile link', () => {
    const expectedLink =
      location.origin +
      '/user/' +
      Cypress.env('VALID_EXPECTED_MUSICN_USERNAME');

    cy.get('[id="musicn_link"]').should('have.value', expectedLink);
  });

  it('Clicking on the profile link will lead me to the profile page', () => {
    const expectedLink =
      '/user/' + Cypress.env('VALID_EXPECTED_MUSICN_USERNAME');
    cy.get('[data-test-id="musicn-profile-link"]').click();
    cy.location('pathname').should('eq', expectedLink);
  });
});

export {};
