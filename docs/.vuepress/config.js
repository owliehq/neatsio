module.exports = {
    title: 'Owlie - Neatsio documentation',
    description: 'Neatsio documentation',
    plugins: [
      [
        'vuepress-plugin-clean-urls',
        {
          normalSuffix: '/',
          indexSuffix: '/',
          notFoundPath: '/404.html',
        },
      ],
      '@vuepress/last-updated',
      '@vuepress/back-to-top',
      '@vuepress/plugin-nprogress',
      'vuepress-plugin-smooth-scroll'
    ],
    themeConfig: {
      sidebar: [
        {
          title: 'Getting started',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '/1.x.x/getting-started/introduction',
            '/1.x.x/getting-started/first-steps'
          ]
        },
        {
          title: 'Concepts',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '/1.x.x/concepts/endpoints',
            '/1.x.x/concepts/queries',
            '/1.x.x/concepts/models',
            '/1.x.x/concepts/routes',
            '/1.x.x/concepts/errors'
          ]
        },
        {
          title: 'Tutorials',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '/1.x.x/tutorials/first-data'
          ]
        }
      ],
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Github', link: 'https://github.com/owliehq/neatsio' },
        { text: 'Owlie HQ', link: 'https://owlie.xyz'}
      ]
    }
  }
