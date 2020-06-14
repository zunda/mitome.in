# mitome.in
[![Netlify Status](https://api.netlify.com/api/v1/badges/5b8126d8-1773-4ab4-8a4b-76c0f5839aa3/deploy-status)](https://app.netlify.com/sites/mitomein/deploys)

Explore OpenPGP as an alternative for seals (mitome-in). View the site alive at https://mitome.in/

## Project setup
```sh
yarn install
```

## Authoring
Create and edit the `.md` files under `doc/`. Add them to the side bar to the `themeConfig.sidebar` array in `docs/.vuepress/config.js`.

Place images under `docs/.vuepress/public/`. They are evailable at the base path.

### The mitomein icon
Edit `assets/mitomein.svg` with Inkscape and export it as a 48x48 png image.

## Serve the pages
Locally:

```sh
yarn docs:dev
```

Through static files:

```sh
yarn docs:build
```

Static files are available under `./docs/.vuepress/dist/`.

## License
### The app code
Copyright 2020 by zunda &lt;zundan at gmail.com&gt;, under [MIT License](LICENSE).

### Site content
Copyright 2020 by zunda &lt;zundan at gmail.com&gt;, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### Dependent packages
See [LICENSES](LICENSES) file.

