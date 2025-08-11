/// <reference types="cypress" />

describe('Team memeber form', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/add-team-member');
        cy.location('pathname').should('include', '/add-team-member');
    });

    it('shoould show the form', () => {
        cy.get('[data-test="form"]').should('exist');
    })
})