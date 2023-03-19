/// <reference types="cypress" />

describe('Interest Rate Tests', () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: /^https:\/\/mortgageapi\.zillow\.com\/getCurrentRates\?[^#]*program=Fixed30Year/
      }, { fixture: '30YearFixed.json'}).as('get30FixedRate')
    cy.visit('/mortgage-calculator/')
    
  })
    it('checks the interest rate for a 30 year fixed loan', () => {
      cy.wait('@get30FixedRate')
      cy.get('#form-1_term').should('contain.text', '30 year fixed')

      cy.get('#rate').should('contain.value', '6.425')
    })
    it('checks the interest rate for a 15 year fixed loan', () => {

      cy.intercept('GET', 'https://mortgageapi.zillow.com/**', { fixture: '15yearFixed.json'}).as('getCurrentRate')

      cy.get('#rate').should('contain.value', '6.425')

      cy.get('#form-1_term').select('15 year fixed')

      cy.wait('@getCurrentRate').should(({request}) => {
        expect(request.url).to.include('program=Fixed15Year')
      })

      cy.get('#rate').should('contain.value', '5.502')
    });
    it('checks the interest rate for a 5 year arm loan', () => {
      cy.intercept('GET', 'https://mortgageapi.zillow.com/**', { fixture: '5YearARM.json'}).as('getCurrentRate')

      cy.get('#rate').should('contain.value', '6.425')

      cy.get('#form-1_term').select('5-year ARM')

      cy.wait('@getCurrentRate').should(({request}) => {
        expect(request.url).to.include('program=ARM5')
      })
      cy.get('#rate').should('contain.value', '5.82')
    });
  })


