<template>
  <div class="mitomeinui">
    <InputArea
      cssClass="key"
      name="受取人の私有鍵"
      v-bind:input="state.privateKey"
      v-bind:disabled="state.processing"
      v-bind:onUpdate="updatePrivateKey"
    />
    <input v-model="passphrase"
      v-bind:disabled="state.processing"
      type="password" placeholder="私有鍵のパスフレーズ"
    />
    <p>上記にペーストした私有鍵で下記にペーストした暗号文を
      <button v-bind:disabled="state.processing" v-on:click="decrypt">
        復号する
      </button>
      <InputArea
        cssClass="key"
        name="暗号文"
        v-bind:input="state.encryptedMessage"
        v-bind:disabled="state.processing"
        v-bind:onUpdate="updateEncryptedMessage"
      />
    </p>
    <p>
      <OutputArea
        cssClass="cleartext"
        name="メッセージ"
        v-bind:output="state.decryptedMessage"
        v-bind:disabled="state.processing"
      />
    </p>
  </div>
</template>

<script>
import { decrypt, decryptKey, readKey, readMessage } from "openpgp"

import { createGlobalState, useSessionStorage } from "@vueuse/core"
const useState = createGlobalState(
  () => useSessionStorage("mitomein-decrypt", {})
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
      passphrase: ""
    }
  },
  methods: {
    decrypt: function () {
      const input = this.state.inputText
      if (! this.state.privateKey) {
        this.$toast.open({message: "私有鍵をペーストしてください", type: "warning"})
        return
      }
      if (! this.state.encryptedMessage) {
        this.$toast.open({message: "暗号文をペーストしてください", type: "warning"})
        return
      }
      this.state.processing = true
      this.state.decryptedMessage = ""
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
          readMessage({ armoredMessage: this.state.encryptedMessage }),
          key
        ])
      })
      .then(([encryptedMessage, key]) => {
        return decrypt({
          message: encryptedMessage, decryptionKeys: key
        })
      })
      .then(decrypted =>
        this.state.decryptedMessage = decrypted.data
      )
      .catch(e => {
        console.log(e.message)
        this.$toast.open({message: e.message, type: "error", duration: 60000})
      })
      .finally(() => {
        this.state.processing = false
      })
    },
    updatePrivateKey: function(input) {
      this.state.privateKey = input
      this.state.decryptedMessage = ""
      this.passphrase = ""
    },
    updateEncryptedMessage: function(input) {
      this.state.encryptedMessage = input
      this.state.decryptedMessage = ""
    },
  }
}
</script>
