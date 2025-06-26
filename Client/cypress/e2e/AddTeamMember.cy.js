/// <reference types="cypress" />

describe('Team Member Form', () => {
    beforeEach(() =>{
        cy.loginAsAdmin()
        cy.visit('/add-team-member')
    })

    it('should show the form', () => {
        cy.get('[data-test="form"]').should('exist');
    });
    
})