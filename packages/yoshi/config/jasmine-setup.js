/* eslint-env jasmine */

const { TerminalReporter, TeamCityReporter } = require('jasmine-reporters');
const { inTeamCity } = require('../src/utils');

jasmine.getEnv().clearReporters();

jasmine
  .getEnv()
  .addReporter(new TerminalReporter({ color: true, verbosity: 2 }));

if (inTeamCity()) {
  jasmine.getEnv().addReporter(new TeamCityReporter());
}
