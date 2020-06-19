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
      <li v-for="publicKey in publicKeys" :key="publicKey.keyId">
        <button v-on:click="removePublicKey(publicKey.keyId)" title="鍵をリストから取り除く"><Fa-Eraser /></button>
        <span class="key-id">{{ publicKey.keyId }}</span>:
        {{ publicKey.name }}
        <span class="email">&lt;{{ publicKey.emali }}&gt;</span>
      </li>
    </ul>
    <p>
      上記のリストの公開鍵に宛てて下記のメッセージを
      <button v-bind:disabled="processing" v-on:click="encrypt">
        暗号化する
      </button>
    </p>
    <InputArea section="EncryptionMessage"
      cssClass="cleartext"
      name="暗号化するメッセージ"
      v-bind:disabled="processing"
    />
    <p>暗号文
      <button @click="copyEncryptedMessage" title="暗号文をクリップボードにコピーする">
        <Fa-Copy />
      </button>
      <br>
      <textarea v-model="encryptedMessage" class="encryptedtext" spellcheck="false" readonly />
    </p>
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
      encryptedMessage: "",
      processing: false
    }
  },
  computed: {
    publicKeys: function() {
      return this.$store.state.publicKeys || []
    }
  },
  methods: {
    addPublicKey: function () {
      this.processing = true
      OpenPgp.key.readArmored(this.newPublicKey)
      .then(data => {
        if (data.keys.length < 1) {
          if (data.err.length > 0) {
            throw data.err[0]
          } else {
            throw {message: '有効な鍵が見つかりませんでした'}
          }
        }
        if (data.keys.length > 1) {
          Vue.$toast.open({message: '複数の鍵が見つかりました。最初の鍵だけ追加します', type: 'warning'})
        }
        const newKey = data.keys[0]
        if (newKey.keyPacket.tag != 6 && newKey.keyPacket.tag != 14) {
          throw {message: '公開鍵ではありません'}
        }
        const newKeyId = newKey.keyPacket.keyid.toHex()
        if (this.publicKeys.find(key => key.keyId === newKeyId)) {
          throw {message: '既に同じIDの公開鍵があります'}
        }
        this.publicKeys.unshift({
          keyId: newKeyId,
          name: newKey.users[0].userId.name,
          emali: newKey.users[0].userId.email,
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
    removePublicKey: function (keyId) {
      this.publicKeys = this.publicKeys.filter(key => key.keyId !== keyId)
      this.commitPublicKeys()
    },
    commitPublicKeys: function() {
      this.$store.commit('setPublicKeys', this.publicKeys)
    },
    encrypt: function() {
      this.processing = true
      OpenPgp.encrypt({
        message: OpenPgp.message.fromText(this.$store.state.inputText.EncryptionMessage || ''),
        publicKeys: this.publicKeys.map(x => x.key)
      }).then(result => {
        this.encryptedMessage = result.data
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      }).finally(() => {
        this.processing = false
      })
    },
    copyEncryptedMessage: function() {
      this.$copyText(this.encryptedMessage).then(() => {
        Vue.$toast.open({message: '暗号文をコピーしました', type: 'info'})
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e, type: 'error', duration: 60000})
      })
    }
  }
}
</script>
