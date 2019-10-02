import i18next from 'i18next';

// We initialize i18next once with configuration for component tests.
export default i18next.init({
  // This configuration causes i18n to always return the key from calling `t('...')`
  fallbackLng: 'cimode',

  // Change to `true` to see more information
  debug: false,

  // Configure our translate HOC to not wait for data to be available
  react: {
    wait: false,
  },
});
