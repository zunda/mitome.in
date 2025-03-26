<template>
  <div>
    <p>下記の鍵を
      <button v-bind:disabled="state.processing" @click="readKey" >確認する</button>
    </p>
    <InputArea
      cssClass="key"
      name="確認する鍵"
      v-bind:input="state.inputText"
      v-bind:disabled="state.processing"
      v-bind:onInput="onUpdate"
    />
    <ul>
      <li>種類: {{ state.details.type }}</li>
      <li>名前: {{ state.details.name }}</li>
      <li>電子メールアドレス: <span class="email">{{ state.details.email }}</span></li>
      <li>生成時刻: {{ state.details.created }}</li>
      <li>ID: <span class="key-id">{{ state.details.keyID }}</span></li>
      <li>指紋: <span class="key-id">{{ state.details.fingerprint }}</span></li>
    </ul>
  </div>
</template>

<script>
import * as OpenPgp from "openpgp";
import moment from "moment"

import { createGlobalState, useSessionStorage } from "@vueuse/core"
const useState = createGlobalState(
  () => useSessionStorage("mitomein-readkeys", {})
)

export default {
  setup() {
    const state = useState()
    return { state }
  },
  created() {
    if (!this.state.details) {
      this.state.details = {}
    }
    this.state.processing = false
  },
  methods: {
    readKey: function () {
      if (! this.state.inputText) {
        this.$toast.open({message: "確認する鍵をペーストしてください", type: "warning"})
        return
      }
      this.state.processing = true
      OpenPgp.readKey({armoredKey: this.state.inputText})
      .then(key => {
        console.log(key)
        this.state.details = {
          name: key.users[0].userID.name,
          email:  key.users[0].userID.email,
          type: key.isPrivate()
            ? (key.isDecrypted() ? "私有鍵" : "私有鍵 (パスフレーズ付き)")
            : "公開鍵",
          created:
            moment(key.keyPacket.created).format("YYYY年MM月DD日 HH:mm:ss Z"),
          keyID: key.keyPacket.keyID.toHex(),
          fingerprint:
            Array.from(key.keyPacket.fingerprint)
            .map(x => ("0" + x.toString(16).toUpperCase()).slice(-2)).join(" ")
        }
      }).catch(e => {
        console.log(e)
        this.$toast.open({message: e.message, type: "error", duration: 60000})
      }).finally(() => {
        this.state.processing = false
      })
    },
    onUpdate: function(input) {
      this.state.inputText = input
      this.state.details = {}
    }
  }
}
</script>
