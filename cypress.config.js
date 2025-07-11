const { defineConfig } = require('cypress');

module.exports = defineConfig({
  "e2e": {
    "baseUrl": "http://localhost:3000",
    "supportFile": "cypress/support/e2e.js",
    "specPattern": "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    "viewportWidth": 1280,
    "viewportHeight": 720,
    "video": false,
    "screenshotOnRunFailure": true,
    "chromeWebSecurity": false,
    "env": {
      "apiUrl": "http://localhost:5001/api"
    }
  },
  "component": {
    "devServer": {
      "framework": "create-react-app",
      "bundler": "webpack"
    },
    "supportFile": "cypress/support/component.js",
    "specPattern": "cypress/component/**/*.cy.{js,jsx,ts,tsx}"
  }
});
