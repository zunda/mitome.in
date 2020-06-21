# mitome.in
[![Netlify Status](https://api.netlify.com/api/v1/badges/5b8126d8-1773-4ab4-8a4b-76c0f5839aa3/deploy-status)](https://app.netlify.com/sites/mitomein/deploys)

認め印の代わりとしてのOpenPGPの可能性を検討します。

このプロジェクトはページの整形とページ内でのプログラムの動作に[VuePress](https://vuepress.vuejs.org/)を利用して、[主レポジトリ](https://github.com/zunda/mitome.in)は[Netlify](https://www.netlify.com/)によって、

- masterブランチが自動的に https://mitome.in/ にデプロイされ、
- プルリクエストはdeploy previewとしてデプロイ(プレビューへのリンクはプルリクエストの会話内に表示されます)され

るように設定されています。

## プロジェクトのセットアップ
Yarnを[インストール手順](https://classic.yarnpkg.com/ja/docs/install/)に従ってインストールしてください。

依存パッケージを下記のコマンドでインストールしてください。

```sh
yarn install
```

## 原稿の執筆
`docs/`ディレクトリ以下に`.md`ファイルを作成してください。サイドバーの目次に追加するには、`docs/.vuepress/config.js`ファイルの配列`themeConfig.sidebar`に追加してください。もしよろしければ、お名前と、差し支えなければご連絡先を、`docs/README.md`のリストに追加してださい。

原稿から参照する画像は、`docs/.vuepress/public/`に置いてください。ルートディレクトリにあるように参照できます。

### 「認め印」ロゴとアイコン
`assets/mitomein.svg`ファイルをInkscapeで編集して、pngファイルとして`docs/.vuepress/public/`にエクスポートしてください。

## ページの閲覧
下記のコマンドを実行しておくことで編集中のページを http://localhost:8080/ 以下で確認できます。

```sh
yarn docs:dev
```

下記のコマンドで静的ファイルが`./docs/.vuepress/dist/`以下に生成されます。

```sh
yarn docs:build
```

## ライセンス
[英語版](README.md#lisence)で確認してください。
