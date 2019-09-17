import i18next from 'i18next';

export default function i18n(locale: string) {
  return i18next
    .use({
      type: 'backend',
      read: (
        language: string,
        namespace: string,
        callback: (
          err: any | null,
          translations?: Record<string, string>,
        ) => void,
      ) => {
        // We configure how i18next should fetch a translation resource when it
        // needs it: We use Webpack's dynamic imports to fetch resources without
        // increasing our bundle size.
        //
        // See https://webpack.js.org/guides/code-splitting/#dynamic-imports for
        // more information.
        return import(`./locales/messages_${language}.json`)
          .then((translation: Record<string, string>) =>
            callback(null, translation),
          )
          .catch(error => callback(error));
      },
    })
    .init({
      // Initial language
      lng: locale,

      // Fallback language
      fallbackLng: 'en',

      // Don't use a key separator (no support for nested translation objects)
      keySeparator: false,

      // Wait for translation data to be available before rendering a component
      react: {
        wait: true,
      },
    });
}
