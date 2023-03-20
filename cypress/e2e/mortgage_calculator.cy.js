/// <reference types="cypress" />

describe("Interest Rate Tests", () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: /^https:\/\/mortgageapi\.zillow\.com\/getCurrentRates\?[^#]*program=Fixed30Year/,
      },
      { fixture: "30YearFixed.json" }
    ).as("get30FixedRate");
    cy.visit("/mortgage-calculator/");
  });
  it("interest rate field interaction", () => {
    cy.wait("@get30FixedRate");
    cy.get("#rate").should("contain.value", "6.425");

    // calculator setup
    cy.get("#homePrice").clear().type("300,000");
    cy.get("#form-1_downPayment").clear().type("60,000");
    cy.get("#form-1_downPaymentPercent").clear().type("20");
    cy.get("#form-1_term").select("30 year fixed");
    cy.contains("Your payment: $2,023/mo");

    cy.findByDisplayValue("6.425").clear().type("5.432").blur();
    cy.contains("Your payment: $1,870/mo");
  });

  it("loan program selection changes interest rate", () => {
    // default 30 year fixed
    cy.wait("@get30FixedRate");
    cy.get("#form-1_term").should("contain.text", "30 year fixed");
    // cy.get("#rate").should("contain.value", "6.425");
    cy.findByDisplayValue("6.425").should("exist");

    // 15 year
    cy.intercept("GET", "https://mortgageapi.zillow.com/**", {
      fixture: "15yearFixed.json",
    }).as("getCurrentRate");
    cy.get("#form-1_term").select("15 year fixed");
    cy.wait("@getCurrentRate").should(({ request }) => {
      expect(request.url).to.include("program=Fixed15Year");
    });
    // cy.get("#rate").should("contain.value", "5.502");
    cy.findByDisplayValue("5.502").should("exist");

    // 5 year ARM
    cy.intercept("GET", "https://mortgageapi.zillow.com/**", {
      fixture: "5YearARM.json",
    }).as("getCurrentRate");
    cy.get("#form-1_term").select("5-year ARM");
    cy.wait("@getCurrentRate").should(({ request }) => {
      expect(request.url).to.include("program=ARM5");
    });
    // cy.get("#rate").should("contain.value", "5.82");
    cy.findByDisplayValue("5.82").should("exist");
  });
});
