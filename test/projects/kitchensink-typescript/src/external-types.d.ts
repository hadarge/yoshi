declare module '*.scss';
declare module '*.css';
declare module '*.json';
declare module '*.graphql';
declare module '*.html';
declare module '*.svg';
declare module '*.gif';
declare module '*.less';
declare module '*.md';
declare module '*.sass';
declare module '*.jpg';

declare module 'externals';

interface Window {
  __STATICS_BASE_URL__: string;
  __LOCALE__: string;
  __BASEURL__: string;
  __CI_APP_VERSION__: string;
}
