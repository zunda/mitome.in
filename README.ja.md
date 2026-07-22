# mitome.in
認め印の代わりとしてのOpenPGPの可能性を検討します。

このプロジェクトはページの整形とページ内でのプログラムの動作に[VitePress](https://vitepress.dev/)を利用しています。[zunda/mitome.in](https://github.com/zunda/mitome.in)の`master`ブランチへのpushは[Cloudflare Workers](https://www.cloudflare.com/products/workers/)によって、[mitome.ink](https://mitome.ink)にデプロイされます。2026年までは[Netlify](https://www.netlify.com/)によって、mitome.inにデプロイされていました。

## プロジェクトのセットアップ
Yarnを[インストール手順](https://classic.yarnpkg.com/ja/docs/install/)に従ってインストールしてください。

依存パッケージを下記のコマンドでインストールしてください。

```sh
yarn install
```

## 原稿の執筆
`docs/`ディレクトリ以下に`.md`ファイルを作成してください。サイドバーの目次に追加するには、`docs/.vuepress/config.js`ファイルの配列`themeConfig.sidebar`に追加してください。もしよろしければ、お名前と、差し支えなければご連絡先を、`docs/README.md`のリストに追加してください。

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

### ERR_OSSL_EVP_UNSUPPORTED
Webpack バージョン4はOpenSSL バージョン3をサポートせず、`yarn docs:dev`などのコマンドが`ERR_OSSL_EVP_UNSUPPORTED`エラーで失敗するようです。この場合は、下記のように`--openssl-legacy-provider`オプションを`NODE_OPTIONS`環境変数として設定してください:

```sh
NODE_OPTIONS=--openssl-legacy-provider yarn docs:dev
```

## ライセンス
[英語版](README.md#Licence)で確認してください。
