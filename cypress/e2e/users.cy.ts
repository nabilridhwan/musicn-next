describe('Users page', () => {
  beforeEach(() => {
    cy.visit('/users');
  });

  it('Should show all users', () => {
    cy.get('[data-test-id="users-list"]').should('have.length', 1);
  });
});

export {};
