<template>
  <div>
    <p>下記の公開鍵を受取人に
      <button v-bind:disabled="processing" v-on:click="addPublicKey">
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
        v-bind::disabled="processing"
        v-on:click="clearNewPublicKey"
        title="追加する受取人の公開鍵を消去する"
        style="float:right;">
        <Fa-Eraser />
      </button>
    </p>
    <ul id="public-keys">
      <li v-for="publicKey in publicKeys" :key="publicKey.keyID">
        <button v-on:click="removePublicKey(publicKey.keyID)" title="鍵をリストから取り除く"><Fa-Eraser /></button>
        <span class="key-id">{{ publicKey.keyID }}</span>:
        {{ publicKey.name }}
        <span class="email">&lt;{{ publicKey.emali }}&gt;</span>
      </li>
    </ul>
    <p>
      上記のリストの公開鍵に宛てて下記のメッセージを
      <button v-bind:disabled="processing" v-on:click="encrypt">
        暗号化する
      </button>
      <InputArea section="EncryptionMessage"
        cssClass="cleartext"
        name="暗号化するメッセージ"
        v-bind:disabled="processing"
        v-bind:onInput="clearEncryptedMessage"
      />
    </p>
    <OutputArea section="Encryption"
      cssClass="key"
      name="暗号文"
      v-bind:output="encryptedMessage"
      v-bind:disabled="processing"
    />
  </div>
</template>

<script>
import Vue from 'vue'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
Vue.use(VueToast)

const OpenPgp = require('openpgp')

export default {
  data() {
    return {
      newPublicKey: "",
      publicKeys: this.$store.state.publicKeys || [],
      encryptedMessage: undefined,
      processing: false
    }
  },
  methods: {
    addPublicKey: function () {
      this.processing = true
      OpenPgp.readKey({armoredKey: this.newPublicKey})
      .then(newKey => {
        if (newKey.isPrivate()) {
          throw {message: '公開鍵ではありません'}
        }
        const newKeyId = newKey.keyPacket.keyID.toHex()
        if (this.publicKeys.find(key => key.keyID === newKeyId)) {
          throw {message: '既に同じIDの公開鍵があります'}
        }
        this.publicKeys.unshift({
          keyID: newKeyId,
          name: newKey.users[0].userID.name,
          emali: newKey.users[0].userID.email,
          key: newKey
        })
        this.commitPublicKeys()
        this.newPublicKey = ''
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      }).finally(() => {
        this.processing = false
      })
    },
    clearNewPublicKey: function() {
      this.newPublicKey = ''
    },
    removePublicKey: function (keyID) {
      this.publicKeys = this.publicKeys.filter(key => key.keyID !== keyID)
      this.commitPublicKeys()
    },
    commitPublicKeys: function() {
      this.$store.commit('setPublicKeys', this.publicKeys)
    },
    encrypt: function() {
      this.processing = true
      OpenPgp.createMessage({
        text: this.$store.state.inputText.EncryptionMessage || ''
      }).then(message =>
        OpenPgp.encrypt({
          message: message,
          encryptionKeys: this.publicKeys.map(x => x.key)
        })
      ).then(result => {
        this.encryptedMessage = result
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      }).finally(() => {
        this.processing = false
      })
    },
    clearEncryptedMessage: function() {
      this.encryptedMessage = ""
    }
  }
}
</script>
