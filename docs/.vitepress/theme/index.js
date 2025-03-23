// https://vitepress.dev/guide/custom-theme
import { h } from "vue"
import DefaultTheme from "vitepress/theme"
import "./style.css"

import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css"

// https://docs.fontawesome.com/web/use-with/vue/dig-deeper
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCopy, faEraser } from "@fortawesome/free-solid-svg-icons"
library.add(faCopy, faEraser)

import OutputArea from "../../.vuepress/components/OutputArea.vue"
import RsaKey from "../../.vuepress/components/RsaKey.vue"

/** @type {import("vitepress").Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(ToastPlugin)
    app.component("font-awesome-icon", FontAwesomeIcon)
    app.component("OutputArea", OutputArea)
    app.component("RsaKey", RsaKey)
  }
}
