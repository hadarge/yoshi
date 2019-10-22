const templateRegex = /{%\w+%}/g;

export default (
  content: string,
  map: Record<string, string>,
  { graceful }: { graceful?: boolean } = {},
) =>
  content.replace(templateRegex, match => {
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
  });
