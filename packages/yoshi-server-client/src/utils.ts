export function joinUrls(baseUrl: string, relativeUrl: string) {
  return baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '');
}
