# mitome.in
Explore OpenPGP as an alternative for seals (mitome-in). このファイルの内容の一部は[日本語](README.ja.md)でご覧になれます。

This project makes use of [VitePress](https://vitepress.dev/) to format the pages as well as provide in-page functions. Pushes to the `master` branch on [main repository](https://github.com/zunda/mitome.in) are deployed to [mitome.ink](https://mitome.ink) by [Cloudflare Workers](https://www.cloudflare.com/products/workers/). Until 2026, [Netlify](https://www.netlify.com/) was configured to deploy to mitome.in.

## Project setup
Install yarn following their [installation instruction](https://classic.yarnpkg.com/en/docs/install/).

Install dependent packages with

```sh
yarn install
```

## Authoring
Create and edit the `.md` files under `docs/`. Add them to the side bar to the `themeConfig.sidebar` array in `docs/.vuepress/config.js`. Please add your name and contact (optional) to the contributor list in `docs/README.md` if you would like to.

Place images under `docs/.vuepress/public/`. They are available at the base path.

### The mitomein logo and icon
Edit `assets/mitomein.svg` with Inkscape and export it as png images into `docs/.vuepress/public/`.

## Serve the pages
Previews of your edit will be available at http://localhost:8080/ with the command below running locally:

```sh
yarn docs:dev
```

The command below generates static files to be served under `./docs/.vuepress/dist/`.

```sh
yarn docs:build
```

### ERR_OSSL_EVP_UNSUPPORTED
It seems that Webpack version 4 doesn't support OpenSSL version 3 and commands like `yarn docs:dev` fail with the `ERR_OSSL_EVP_UNSUPPORTED` error. In that case, please supply the `--openssl-legacy-provider` option as `NODE_OPTIONS` environment variable, i.e.:

```sh
NODE_OPTIONS=--openssl-legacy-provider yarn docs:dev
```

## License
### The app code
Copyright 2020 by zunda &lt;zundan at gmail.com&gt; and the contributors, under [MIT License](LICENSE).

### Site content
Copyright 2020 by zunda &lt;zundan at gmail.com&gt; and the contributors, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### Dependent packages
See [LICENSES](LICENSES) file.

