# mitome.in
[![Netlify Status](https://api.netlify.com/api/v1/badges/5b8126d8-1773-4ab4-8a4b-76c0f5839aa3/deploy-status)](https://app.netlify.com/sites/mitomein/deploys)

Explore OpenPGP as an alternative for seals (mitome-in). このファイルの内容の一部は[日本語](README.ja.md)でご覧になれます。

This project makes use of [VuePress](https://vuepress.vuejs.org/) to format the pages as well as provide in-page functions. The [main repository](https://github.com/zunda/mitome.in) is configured to interact with [Netlify](https://www.netlify.com/) so that

- the master branch is automatically deployed to https://mitome.in/
- a pull request is automatically deployed as a deploy preview. Look for the link in the pull request conversation.

## Project setup
Install yarn following their [installation instruction](https://classic.yarnpkg.com/en/docs/install/).

Install dependent packages with

```sh
yarn install
```

## Authoring
Create and edit the `.md` files under `doc/`. Add them to the side bar to the `themeConfig.sidebar` array in `docs/.vuepress/config.js`. Please add your name and contact (optional) to the contributor list in `doc/README.md` if you would like to.

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

## License
### The app code
Copyright 2020 by zunda &lt;zundan at gmail.com&gt; and the contributors, under [MIT License](LICENSE).

### Site content
Copyright 2020 by zunda &lt;zundan at gmail.com&gt; and the contributors, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### Dependent packages
See [LICENSES](LICENSES) file.

