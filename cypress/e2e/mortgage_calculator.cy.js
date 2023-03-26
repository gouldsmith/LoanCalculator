/// <reference types="cypress" />

import { mortgageFields } from "../support/helper";

describe("Interest Rate Tests", () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: /mortgageapi\.zillow\.com\/getAnnualPropertyTaxRate(\?partnerId=[^&]*)?/,
      },
      { fixture: "getAnnualPropertyTaxRate.json" }
    ).as("getPropertyTax");
    cy.intercept(
      {
        url: /^https:\/\/mortgageapi\.zillow\.com\/getCurrentRates\?[^#]*program=Fixed30Year/,
      },
      { fixture: "rates30YearFixed.json" }
    ).as("get30FixedRate");
    cy.visit("/mortgage-calculator/");
    cy.intercept(
      { url: /^https:\/\/mortgageapi\.zillow\.com\/getZIPCodeLocation/ },
      {
        fixture: "getZipCodeLocation.json",
      }
    ).as("getRegion");
  });

  it("Interest rate field interaction", () => {
    cy.wait("@get30FixedRate");
    cy.get(mortgageFields.interestRate).should("contain.value", "6.425");

    // calculator setup
    cy.get(mortgageFields.homePrice).clear().type("300,000");
    cy.get(mortgageFields.downpaymentAmount).clear().type("60,000");
    cy.get(mortgageFields.downpaymentPercent).clear().type("20");
    cy.get(mortgageFields.loanProgram).select("30 year fixed");
    cy.contains("Your payment: $1,830/mo");

    cy.findByDisplayValue("6.425").clear().type("5.432").blur();
    cy.contains("Your payment: $1,677/mo");
  });

  it("Loan program selection changes interest rate", () => {
    // default 30 year fixed
    cy.wait("@get30FixedRate");
    cy.get(mortgageFields.loanProgram).should("contain.text", "30 year fixed");
    cy.findByDisplayValue("6.425").should("exist");

    // 15 year
    cy.intercept("GET", "https://mortgageapi.zillow.com/**", {
      fixture: "rates15yearFixed.json",
    }).as("getCurrentRate");
    cy.get(mortgageFields.loanProgram).select("15 year fixed");
    cy.wait("@getCurrentRate").should(({ request }) => {
      expect(request.url).to.include("program=Fixed15Year");
    });
    cy.findByDisplayValue("5.502").should("exist");

    // 5 year ARM
    cy.intercept("GET", "https://mortgageapi.zillow.com/**", {
      fixture: "rates5YearARM.json",
    }).as("getCurrentRate");
    cy.get(mortgageFields.loanProgram).select("5-year ARM");
    cy.wait("@getCurrentRate").should(({ request }) => {
      expect(request.url).to.include("program=ARM5");
    });
    cy.findByDisplayValue("5.82").should("exist");
  });

  it("User input boundaries on interest rate field", () => {
    cy.get(mortgageFields.interestRate).clear().type("hello").blur();
    cy.findAllByText(/is not a valid number/i).should("exist");

    cy.get(mortgageFields.interestRate).clear().type("   ").blur();
    cy.findAllByText(/is not a valid number/i).should("exist");

    cy.get(mortgageFields.interestRate).clear().type("101").blur();
    cy.findAllByText(/Rate must be less than or equal to 100/i).should("exist");

    cy.get(mortgageFields.interestRate).clear().type("-1").blur();
    cy.findAllByText(/Rate must be greater than or equal to 0/i).should(
      "exist"
    );

    cy.get(mortgageFields.interestRate).clear().type("6..543").blur();
    cy.findAllByText(/is not a valid number/i).should("exist");

    cy.get(mortgageFields.interestRate).clear().type("&^#@!").blur();
    cy.findAllByText(/is not a valid number/i).should("exist");
  });

  const sizes = ["iphone-se2", "iphone-xr", "samsung-s10", "ipad-mini"];
  describe("Mobile Tests", () => {
    sizes.forEach((size) => {
      it(`Interest rate field is visible on a ${size} viewport`, () => {
        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1]);
        } else {
          cy.viewport(size);
        }

        cy.visit("/mortgage-calculator/");
        cy.get(mortgageFields.interestRate)
          .scrollIntoView()
          .should("be.visible");
        cy.findAllByLabelText(/interest rate/i).should("be.visible");
        cy.get(mortgageFields.interestRate).next().should("have.text", "%");
      });
    });
  });
});
