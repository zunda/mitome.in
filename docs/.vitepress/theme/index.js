// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css'

import OutputArea from '../../.vuepress/components/OutputArea.vue'
import RsaKey from '../../.vuepress/components/RsaKey.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(ToastPlugin)
    app.component('OutputArea', OutputArea)
    app.component('RsaKey', RsaKey)
  }
}
