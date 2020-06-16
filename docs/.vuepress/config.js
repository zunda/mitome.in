module.exports = {
  title: 'mitome.in',
  lang: 'ja',
  description: '認印の代わりとしてOpenPGPの利用方法を考えます。',
  head: [
    ['link', { rel: 'icon', href: '/mitomein.png' }]
  ],
  themeConfig: {
    repo: 'zunda/mitome.in',
    logo: '/mitomein.png',
    sidebar: [
      '/',
      {
        title: 'OpenPGPを試す',
        children: [
          '/OpenPGP/',
          '/OpenPGP/keyPair',
          '/OpenPGP/encryption',
          '/OpenPGP/sign',
          '/OpenPGP/wut'
        ]
      },
      '/email/',
      '/sns/',
      '/device/',
      '/references/'
    ]
  },
  plugins: [
    [
      'vuepress-plugin-container',
      {
        type: 'tip',
        defaultTitle: {
          '/': 'ヒント'
        }
      }
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'warning',
        defaultTitle: {
          '/': '注意'
        }
      }
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'danger',
        defaultTitle: {
          '/': '警告'
        }
      }
    ]
  ],
  thirdPartyComponents: {
    fontAwesomeIcons: {
      regular: [''],
      solid: ['copy', 'remove']
    }
  }
}
