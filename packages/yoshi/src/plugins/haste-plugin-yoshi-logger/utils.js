const WIX_PREFIX_REGEX = /^wix-/;

module.exports.format = time => time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');

module.exports.delta = start => {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
};

module.exports.generateRunTitle = ({ run, task }) => {
  const title = (run.runnerOptions && run.runnerOptions.title) || task.name;
  return title.replace(WIX_PREFIX_REGEX, '');
};
