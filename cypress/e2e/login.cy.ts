describe('Login page', () => {
	beforeEach(() => {
		cy.visit('/login');
	});

	it('Button should be disabled if there is no input', () => {
		cy.get('button').should('be.disabled');
	});

	it('It should alert me that I only typed one field (email)', () => {
		cy.get('input[data-test-id="username-input"]').type('abc123@gmail.com');
		cy.get('[data-test-id="login-button"]').click();
		cy.get('.error').should('contain', 'Password is required');
	});

	it('It should alert me that I only typed one field (password)', () => {
		cy.get('input[data-test-id="password-input"]').type('abc123@gmail.com');
		cy.get('[data-test-id="login-button"]').click();
		cy.get('.error').should('contain', 'Username or email is required');
	});

	it('When singing in, the button should be disabled', () => {
		cy.get('input[data-test-id="username-input"]').type(
			Cypress.env('VALID_MUSICN_EMAIL')
		);
		cy.get('input[data-test-id="password-input"]').type(
			Cypress.env('VALID_MUSICN_PASSWORD')
		);
		cy.get('[data-test-id="login-button"]').click();

		// Check the button needs to be disabled
		cy.get('[data-test-id="login-button"]').should('be.disabled');

		// Check if it redirects the user to the profile page
		cy.location('pathname').should('eq', '/profile');
	});
});
