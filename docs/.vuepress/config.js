const title = 'mitome.in'
const domain = 'https://' + title
const logoPath = '/mitomein.png'
const biggerLogoPath = '/mitomein-144x144.png'
const description = '認め印を使うくらい気軽に、電子署名や暗号でやりとりしたい'

module.exports = {
  title: 'mitome.in',
  lang: 'ja',
  description: description,
  head: [
    ['link', {rel: 'icon', href: logoPath }],
    ['meta', {name: 'keywords', content: 'OpenPGP, 暗号化, 電子署名, 認め印'}],
    ['meta', {name: 'og:title', content: title + ' - 電子署名と暗号を気軽に'}],
    ['meta', {name: 'og:description', content: description}],
    ['meta', {name: 'og:type', content: 'website'}],
    ['meta', {name: 'og:url', content: domain}],
    ['meta', {name: 'og:image', content: domain + biggerLogoPath}],
    ['meta', {name: 'twitter:card', content: 'summary'}],
    ['meta', {name: 'twitter:image', content: domain + biggerLogoPath}]
  ],
  themeConfig: {
    repo: 'zunda/mitome.in',
    logo: logoPath,
    sidebar: [
      '/',
      {
        title: 'OpenPGPを試す',
        children: [
          '/OpenPGP/',
          '/OpenPGP/keyPair',
          '/OpenPGP/encryption',
          '/OpenPGP/sign',
          '/OpenPGP/wot'
        ]
      },
      {
        title: '電子メール',
        children: [
          '/email/',
          '/email/keyManagement',
          '/email/mailvelope'
        ]
      },
      {
        title: 'ソーシャルネットワーク',
        children: [
          '/sns/',
          '/sns/keybase'
        ]
      },
      '/device/',
      '/laws/',
      '/conclusion',
      '/references/',
      '/changelog',
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
      solid: ['copy', 'eraser']
    }
  }
}
