import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "mitome.in",
  lang: "ja",
  description: "認め印を使うくらい気軽に、暗号でやりとりしたり電子署名したい",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/mitomein.png",
    socialLinks: [
      { icon: "github", link: "https://github.com/zunda/mitome.in" }
    ],
    nav: [
      { text: "Home", link: "/" },
    ],

    sidebar: [
      {
        text: "OpenPGPを試す",
        collapsed: true,
        items: [
          { text: "OpenPGPとは", link: "/OpenPGP/" },
          { text: "鍵対の生成", link: "/OpenPGP/keyPair" },
          { text: "暗号化と復号", link: "/OpenPGP/encryption" },
          { text: "デジタル署名", link: "/OpenPGP/sign" },
          { text: "公開鍵の正当性の確認", link: "/OpenPGP/wot" },
        ]
      },
      {
        text: "電子メール",
        collapsed: true,
        items: [
          { text:"電子メールの暗号化と署名", link: "/email/" },
          { text:"GnuPGによる鍵対の生成と管理", link: "/email/keyManagement" },
          { text:"FlowCrypt", link: "/email/flowCrypt" },
          { text:"Mailvelope", link: "/email/mailvelope" },
          { text:"Mutt", link: "/email/mutt" },
          { text:"ProtonMail", link: "/email/protonmail" },
          { text:"Thunderbird", link: "/email/thunderbird" }
        ]
      },
      {
        text: "ソーシャルネットワーク",
        collapsed: true,
        items: [
          { text:"SNSと暗号技術", link: "/sns/" },
          { text:"Keybase", link: "/sns/keybase" },
          { text:"Keoxide", link: "/sns/keyoxide" },
          { text:"Mastodon", link: "/sns/mastodon" }
        ]
      },
      {
        text: "その他のツール",
        collapsed: true,
        items: [
          { text: "日常生活でのデジタル署名", link: "/misc/" },
          { text: "Sequoia-PGP", link: "/misc/sequoia" },
          { text: "Git", link: "/misc/git" },
          { text: "LibreOffice", link: "/misc/libreOffice" },
          { text: "OpenKeychain", link: "/misc/openKeychain" },
          { text: "名刺", link: "/misc/vCard" }
        ]
      },
      {
        text: "暗号デバイス",
        collapsed: true,
        items: [
          { text: "暗号デバイスでの鍵対の管理", link: "/device/" },
          { text: "YubiKey", link: "/device/yubiKey" }
        ]
      },
      { text: "電子署名サービス", link: "/services/" },
      { text: "電子署名と実社会", link: "/laws/" },
      { text: "おわりに", link: "/conclusion" },
      { text: "参考文献", link: "/references/" },
      { text: "改定履歴", link: "/changelog" },
    ]
  }
})
