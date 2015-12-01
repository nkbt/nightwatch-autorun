const WAIT = 1000;

module.exports = {
  'Smoketest': function (browser) {
    browser
      .url('http://localhost:8080/')
      .waitForElementVisible('body', WAIT)
      .assert.containsText('body', 'Hello, World!')
      .end();
  }
};
