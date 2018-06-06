/* eslint-env jasmine */

const { TeamCityReporter } = require('jasmine-reporters');
const { inTeamCity } = require('../src/utils');

if (inTeamCity()) {
  jasmine.getEnv().clearReporters();
  jasmine.getEnv().addReporter(new TeamCityReporter());
}
