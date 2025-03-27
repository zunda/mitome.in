<template>
  <div>
    <InputArea
      cssClass="key"
      name="検証に使う公開鍵"
      v-bind:input="state.publicKey"
      v-bind:disabled="state.processing"
      v-bind:onUpdate="updatePublicKey"
    />
    <p>上記にペーストした公開鍵で下記にペーストしたクリアテキスト署名を
      <button v-bind:disabled="state.processing" v-on:click="verify">
        検証する
      </button>
    </p>
    <InputArea
      cssClass="cleartext"
      name="検証されるクリアテキスト署名"
      v-bind:input="state.signedMessage"
      v-bind:onUpdate="updateSignedMessage"
      v-bind:disabled="state.processing"
    />
    <p>検証結果: <span v-html="state.result" /></p>
  </div>
</template>

<script>
import * as OpenPgp from "openpgp";
import moment from "moment"

import { createGlobalState, useSessionStorage } from "@vueuse/core"
const useState = createGlobalState(
  () => useSessionStorage("mitomein-verifyclearsign", {})
)

export default {
  setup() {
    const state = useState()
    return { state }
  },
  created() {
    this.state.processing = false
  },
  methods: {
    verify: function () {
      if (!this.state.publicKey) {
        this.$toast.open({message: "検証に利用する公開鍵をペーストしてください", type: "warning"})
        return
      }
      if (!this.state.signedMessage) {
        this.$toast.open({message: "検証するクリアテキスト署名をペーストしてください", type: "warning"})
        return
      }
      this.result = ""
      this.processing = true
      Promise.all([
        OpenPgp.readCleartextMessage({
          cleartextMessage: this.state.signedMessage
        }),
        OpenPgp.readKey({
          armoredKey: this.state.publicKey
        })
      ])
      .then(([clearText, publicKeys]) =>
        OpenPgp.verify({message: clearText, verificationKeys: publicKeys})
      )
      .then(result => Promise.all([
        result.signatures[0].verified,
        result.signatures[0].keyID,
        result.signatures[0].signature
      ]))
      .then(([_verified, keyID, signature]) => {
        console.log(signature)
        this.state.result = '成功: 鍵ID: <span class="key-id">' +
          keyID.toHex() + "</span> 時刻: " +
          moment(signature.packets[0].created).format("YYYY年MM月DD日 HH:mm:ss Z")
      })
      .catch(e => {
        this.state.result = "失敗: " + e.message
      })
      .finally(() => {
        this.processing = false
      })
    },
    updatePublicKey: function(input) {
      this.state.publicKey = input
      this.state.result = ""
    },
    updateSignedMessage: function(input) {
      this.state.signedMessage = input
      this.state.result = ""
    }
  }
}
</script>
