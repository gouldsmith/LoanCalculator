## Mortgage Loan Interest Rate Exercise

This is a UI testing exercise automating a portion of a loan calculator using Cypress. The scope of this is intentially limited to the interest rate field of the Zillow mortgage calculator

## Tech used

The project features cypress and [the testing library plug-in](https://testing-library.com/docs/cypress-testing-library/intro)

## Installation

To install the project dependencies, run the following command in the root directory:

    npm install

## Usage

To run the test suite with the cypress test runner, run one of the following commands

    npm test

# Guthub Actions

Tests are set to run automatically when pushing code to the repo

## Automation Notes

The tests are currently running succesfully, but could face a number of potential issues:

- CSS selectors are brittle and could easily break wih small code changes
- Assertions assume advanced options for property taxes and insurance stay consistent
- /getCurrentRates endpoint is mocked for reliability, as this is static if future changes occur tests could fail

If this test suite were to be expanded, here are my recommendations:

- Expand the number of acceptance tests to increase feature coverage
- Add some e2e tests covering more of the mortgage calculator
- Automate the negitive tests to include non-happy path test coverage
- Add navigation and calculator cypress custom commands

MIT © [David Gouldsmith]()
