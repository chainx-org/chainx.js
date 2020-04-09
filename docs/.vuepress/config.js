module.exports = {
  title: 'chainx.js',
  description: 'SDK which support interaction with ChainX.',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    search: false,
    displayAllHeaders: true,
    sidebar: [
      {
        title: 'Getting started',
        path: '/start/',
        collapsable: false,
        sidebarDepth: 0,
        children: [['start/install.md', 'Installation'], ['start/quick.md', 'Quick start']],
      },
      {
        title: 'Modules',
        path: '/module',
        collapsable: false,
        sidebarDepth: 0,
        children: [['module/account.md', 'Account']],
      },
    ],
  },
};
