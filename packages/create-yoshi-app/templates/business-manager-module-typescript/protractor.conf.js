module.exports.config = {
  framework: 'mocha',
  SELENIUM_PROMISE_MANAGER: false,
  onPrepare() {
    browser.ignoreSynchronization = true;
  },
};
