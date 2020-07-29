# Currency Calculation proof of Concept

## Prerequisites
* `Node v12+` - although might work with older.

## Instructions
* `npm install` - install dependencies.
* `npm test` - run all tests.
* `npm run dev` - start dev server. Then visit http://localhost:8080/quote?base_amount=100&base_currency=EUR&quote_currency=USD
* `npm run build` - build code under `./dist`.

## Tools used
* `TypeScript`
* `eslint`
* `express.js`
* `config` - to manage configuration constants.
* `lodash` - few utility functions.
* `node-fetch` - to make HTTP requests.
* `bignumber.js` - to make calculations.
* `Jest` - testing lib.
* `supertest` - for testing, express app.
* `lolex` - for testing, mock timer.
* `nock` - for testing, mock HTTP requests.
