const {TerminalReporter, TeamCityReporter} = require('jasmine-reporters');
const {inTeamCity} = require('../src/utils');

module.exports = [
  new TerminalReporter({color: true, verbosity: 2}),
  ...inTeamCity() ? [new TeamCityReporter()] : [],
];
