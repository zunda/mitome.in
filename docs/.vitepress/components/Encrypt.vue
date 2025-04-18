<template>
  <div class="mitomeinui">
    <p>下記の公開鍵を受取人に
      <button v-bind:disabled="state.processing" v-on:click="addPublicKey">
        追加する
      </button>
      <br>
      <textarea
        v-model="newPublicKey"
        class="key"
        spellcheck="false"
        placeholder="追加する受取人の公開鍵"
      />
      <button
        v-bind:disabled="state.processing"
        v-on:click="clearNewPublicKey"
        title="追加する受取人の公開鍵を消去する"
        style="float:right;">
        <font-awesome-icon icon="eraser" />
      </button>
    </p>
    <ul id="public-keys">
      <li v-for="publicKey in state.publicKeys" :key="publicKey.keyID">
        <button v-on:click="removePublicKey(publicKey.keyID)" title="鍵をリストから取り除く"><font-awesome-icon icon="eraser" /></button>&nbsp;
        <span class="key-id">{{ publicKey.keyID }}</span>:
        {{ publicKey.name }}
        <span class="email">&lt;{{ publicKey.emali }}&gt;</span>
      </li>
    </ul>
    <p>
      上記のリストの公開鍵に宛てて下記のメッセージを
      <button v-bind:disabled="state.processing" v-on:click="encrypt">
        暗号化する
      </button>
      <InputArea
        cssClass="cleartext"
        name="暗号化するメッセージ"
        v-bind:input="state.inputText"
        v-bind:disabled="state.processing"
        v-bind:onUpdate="onUpdateCleartext"
      />
    </p>
    <OutputArea section="Encryption"
      cssClass="key"
      name="暗号文"
      v-bind:output="state.encryptedMessage"
      v-bind:disabled="state.processing"
    />
  </div>
</template>

<script>
import { createMessage, encrypt, readKey } from "openpgp"

import { createGlobalState, useSessionStorage } from "@vueuse/core"
const useState = createGlobalState(
  () => useSessionStorage("mitomein-encrypt", {})
)

export default {
  setup() {
    const state = useState()
    return { state }
  },
  created() {
    if (!this.state.publicKeys) {
      this.state.publicKeys = []
    }
    this.state.processing = false
  },
  data() {
    return {
      newPublicKey: "",
    }
  },
  methods: {
    addPublicKey: function () {
      if (! this.newPublicKey) {
        this.$toast.open({message: "公開鍵をペーストしてください", type: "warning"})
        return
      }
      this.state.processing = true
      readKey({armoredKey: this.newPublicKey})
      .then(newKey => {
        if (newKey.isPrivate()) {
          throw {message: "公開鍵ではありません"}
        }
        const newKeyId = newKey.keyPacket.keyID.toHex()
        if (this.state.publicKeys.find(key => key.keyID === newKeyId)) {
          throw {message: "既に同じIDの公開鍵があります"}
        }
        this.state.publicKeys.unshift({
          keyID: newKeyId,
          name: newKey.users[0].userID.name,
          emali: newKey.users[0].userID.email,
          key: this.newPublicKey
        })
        this.newPublicKey = ""
        this.clearEncryptedMessage()
      }).catch(e => {
        console.log(e)
        this.$toast.open({message: e.message, type: "error", duration: 60000})
      }).finally(() => {
        this.state.processing = false
      })
    },
    clearNewPublicKey: function() {
      this.newPublicKey = ""
    },
    removePublicKey: function (keyID) {
      this.state.publicKeys = this.state.publicKeys.filter(key => key.keyID !== keyID)
      this.clearEncryptedMessage()
    },
    encrypt: function() {
      if (this.state.publicKeys.length == 0) {
        this.$toast.open({message: "まず、受取人の公開鍵を追加してください", type: "warning"})
        return
      }
      this.state.processing = true
      Promise.all(
        this.state.publicKeys.map(x => readKey({ armoredKey: x.key }))
      )
      .then(publicKeys => {
        return Promise.all([
          createMessage({ text: this.state.inputText || "" }),
          publicKeys
        ])
      })
      .then(([clearText, publicKeys]) =>
        encrypt({ message: clearText, encryptionKeys: publicKeys })
      )
      .then(result => {
        this.state.encryptedMessage = result
      })
      .catch(e => {
        console.log(e)
        this.$toast.open({message: e.message, type: "error", duration: 60000})
      })
      .finally(() => {
        this.state.processing = false
      })
    },
    onUpdateCleartext: function(input) {
      this.state.inputText = input
      this.state.encryptedMessage = ""
    },
    clearEncryptedMessage: function() {
      this.state.encryptedMessage = ""
    }
  }
}
</script>
