describe('Sign Up', () => {
	beforeEach(() => {
		cy.visit('/signup');
	});

	it("Should reject me if I don't fill the email in the correct format", () => {
		cy.get("input[placeholder='Display Name']").type('abc123');
		cy.get("input[placeholder='Username']").type('abc123');
		cy.get("input[placeholder='Email']").type('abc123');
		cy.get("input[placeholder='Password']").type('abc123');
		cy.get("input[placeholder='Confirm Password']").type('abc123');
		cy.get("[data-test-id='signup-button']").click();
		cy.get('.error').should('contain', 'email must be a valid email');
	});

	it("Should reject me if my passwords didn't match", () => {
		cy.get("input[placeholder='Display Name']").type('abc123');
		cy.get("input[placeholder='Username']").type('abc123');
		cy.get("input[placeholder='Email']").type('abc123@gmail.com');
		cy.get("input[placeholder='Password']").type('abc123');
		cy.get("input[placeholder='Confirm Password']").type('abcdef');
		cy.get("[data-test-id='signup-button']").click();
		cy.get('.error').should('contain', 'Passwords do not match');
	});

	it('Agreement button should redirect me to the agreement page', () => {
		cy.get("[data-test-id='agreement-button']").click();
		cy.location('pathname').should('eq', '/agreement');
	});
});
