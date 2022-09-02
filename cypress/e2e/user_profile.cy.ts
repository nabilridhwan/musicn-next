describe('User Profile', () => {
	it('Clicking on song preview will open up its preview and show the the correct name', () => {
		let song_name;
		cy.visit('/user/nabil');
		cy.get('[data-test-id="song-card"]').first().click();

		// Check for the name
		cy.get('[data-test-id="song-name"]')
			.first()
			.then(($elem) => {
				song_name = $elem.text();

				cy.get('[data-test-id="preview-song-name"]').should(
					'have.text',
					song_name
				);
			});
	});

	it('Closes the window when pressing the background', () => {
		cy.visit('/user/nabil');
		cy.get('[data-test-id="song-card"]').first().click();
		cy.get('[data-test-id="preview-black-background"]').click({
			force: true,
		});
		cy.get('[data-test-id="preview-song-name"]').should('not.be.visible');
	});

	it('Redirects me to users page if user is not found', () => {
		cy.visit('/user/jwoeifewoifjwoiefjweoifj');

		cy.location('pathname').should('eq', '/users');
	});
});

export {};
