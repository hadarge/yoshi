// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Yoshi',
  tagline: 'A Toolkit that supports building all kinds of applications in wix',

  url: 'https://wix.github.io',
  baseUrl: '/yoshi/',

  editUrl: 'https://github.com/wix/yoshi/edit/master/docs/',
  repoUrl: 'https://github.com/wix/yoshi',
  // Used for publishing and more
  projectName: 'yoshi',
  organizationName: 'wix',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'getting-started/create-app', label: 'Getting Started' },
    { doc: 'api/configuration', label: 'API' },
    { blog: true, label: 'Blog' },
    { search: true },
  ],

  /* path to images for header/footer */
  headerIcon: 'img/yoshi.webp',
  footerIcon: 'img/yoshi.webp',
  favicon: 'img/favicon.ico',

  // Docs will show the last update time
  enableUpdateTime: true,

  /* Colors for website */
  colors: {
    primaryColor: '#2E94B3',
    secondaryColor: '#2B6CC4',
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Wix.com`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  algolia: {
    apiKey: '5807169f7e8a322a659ac4145a3e5d8a',
    indexName: 'wix_yoshi',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',

  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/yoshi.webp',
  twitterImage: 'img/yoshi.webp',
};

module.exports = siteConfig;
