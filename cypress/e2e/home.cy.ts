describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Get started button redirects to sign up page', () => {
    cy.get('button[data-test-id="get-started-button"]').click();
    cy.location('pathname').should('eq', '/signup');
  });

  it('Changelog button redirects to changelog page', () => {
    cy.get('button[data-test-id="changelog-button"]').click();
    cy.location('pathname').should('eq', '/changelog');
  });
});

export {};
