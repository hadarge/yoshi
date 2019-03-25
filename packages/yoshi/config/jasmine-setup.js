/* eslint-env jasmine */

const { TeamCityReporter } = require('jasmine-reporters');
const { inTeamCity } = require('yoshi-helpers/queries');

if (inTeamCity()) {
  jasmine.getEnv().clearReporters();
  jasmine.getEnv().addReporter(new TeamCityReporter());
}
