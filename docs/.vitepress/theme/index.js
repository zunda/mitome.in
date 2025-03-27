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

import InputArea from "../../.vuepress/components/InputArea.vue"
import OutputArea from "../../.vuepress/components/OutputArea.vue"
import RsaKey from "../../.vuepress/components/RsaKey.vue"
import ReadKey from "../../.vuepress/components/ReadKey.vue"
import Encryption from "../../.vuepress/components/Encryption.vue"
import Decryption from "../../.vuepress/components/Decryption.vue"
import ClearSign from "../../.vuepress/components/ClearSign.vue"
import VerifyClearSign from "../../.vuepress/components/VerifyClearSign.vue"

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
    app.component("InputArea", InputArea)
    app.component("OutputArea", OutputArea)
    app.component("RsaKey", RsaKey)
    app.component("ReadKey", ReadKey)
    app.component("Encrypt", Encryption)
    app.component("Decrypt", Decryption)
    app.component("ClearSign", ClearSign)
    app.component("VerifyClearSign", VerifyClearSign)
  }
}
