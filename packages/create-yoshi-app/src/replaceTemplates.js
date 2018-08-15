const templateRegex = /{%\w+%}/g;

module.exports = (content, map, { graceful } = {}) => {
  function replacer(match) {
    const key = match.slice(2, -2);

    if (!map.hasOwnProperty(key)) {
      if (graceful) {
        return match;
      }

      throw new Error(
        `the key ${key} suppose to be one of the following: ${Object.keys(
          map,
        )}`,
      );
    }

    return map[key];
  }

  return content.replace(templateRegex, replacer);
};
