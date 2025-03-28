<template>
  <div class="mitomeinui">
    <InputArea
      cssClass="key"
      name="署名に使う私有鍵"
      v-bind:input="state.privateKey"
      v-bind:disabled="state.processing"
      v-bind:onUpdate="updatePrivateKey"
    />
    <input
      v-model="passphrase"
      v-bind:disabled="state.processing"
      type="password"
      placeholder="私有鍵のパスフレーズ"
    />
    <p>上記にペーストした私有鍵で下記のメッセージに
      <button v-bind:disabled="state.processing" v-on:click="clearSign">
        署名する
      </button>
      <InputArea
        cssClass="cleartext"
        name="署名対象のメッセージ"
        v-bind:input="state.message"
        v-bind:disabled="state.processing"
        v-bind:onUpdate="updateMessage"
      />
    </p>
    <p>
      <OutputArea section="ClearSignSignedMessage"
        cssClass="cleartext"
        name="クリアテキスト署名"
        v-bind:output="state.signedMessage"
        v-bind:disabled="state.processing"
      />
    </p>
  </div>
</template>

<script>
import { createCleartextMessage, decryptKey, readKey, sign } from "openpgp"

import { createGlobalState, useSessionStorage } from "@vueuse/core"
const useState = createGlobalState(
  () => useSessionStorage("mitomein-clearsign", {})
)

export default {
  setup() {
    const state = useState()
    return { state }
  },
  created() {
    this.state.processing = false
  },
  data() {
    return {
      passphrase: "",
    }
  },
  methods: {
    clearSign: function () {
      const message = this.state.message || ""
      if (message === "") {
        this.$toast.open({message: "ここでは空文字列には署名できません", type: "warning"})
        return
      }
      if (! this.state.privateKey) {
        this.$toast.open({message: "署名に使う私有鍵をペーストしてください", type: "warning"})
        return
      }
      this.processing = true
      this.signedMessage = ""
      readKey({ armoredKey: this.state.privateKey })
      .then(key => {
        if (! key.isPrivate()) {
          throw {message: "私有鍵ではありません"}
        }
        if (! key.isDecrypted()) {
          return decryptKey(
            { privateKey: key, passphrase: this.passphrase }
          )
        } else {
          return key
        }
      })
      .then(key => {
        return Promise.all([
          createCleartextMessage({ text: message }),
          key
        ])
      })
      .then(([clearText, privateKeys]) =>
        sign({message: clearText, signingKeys: privateKeys})
      )
      .then(signed => {this.state.signedMessage = signed})
      .catch(e => {
        console.log(e.message)
        this.$toast.open({message: e.message, type: "error", duration: 60000})
      })
      .finally(() => {
        this.processing = false
      })
    },
    updatePrivateKey: function(input) {
      this.state.privateKey = input
      this.state.signedMessage = ""
      this.passphrase = ""
    },
    updateMessage: function(input) {
      this.state.message = input
      this.state.signedMessage = ""
    }
  }
}
</script>
