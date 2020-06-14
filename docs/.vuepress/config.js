module.exports = {
  title: 'mitome.in',
  description: '認印の代わりとしてOpenPGPの利用方法を考えます。',
  themeConfig: {
    nav: [
      { text: 'ホーム', link: '/' }
    ],
    repo: 'zunda/mitome.in',
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
      '/references/'
    ]
  }
}
