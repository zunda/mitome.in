<template>
  <div>
    <p>
      {{ name }} &lt;<tt>{{ email }}</tt>&gt; の鍵対を
      <button v-bind:disabled="processing" v-on:click="generateKey">
        生成する
      </button>
      <button v-bind:disabled="processing" v-on:click="clearKey">
        消す
      </button>
    </p>
    <p>公開鍵 <button @click="copyPublicKey">コピー</button><br>
      <textarea v-model="publicKey" class="key" spellcheck="false" readonly />
    </p>
    <p>私有鍵 <button @click="copyPrivateKey">コピー</button><br>
      <textarea v-model="privateKey" class="key" spellcheck="false" readonly />
    </p>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
import OpenPgp from 'openpgp'

export default {
  props: {
    name: String,
    email: String
  },
  data() {
    return {
      privateKey: "",
      publicKey: "",
      processing: false
    }
  },
  methods: {
    generateKey: function () {
      this.processing = true
      OpenPgp.generateKey({
        userIds: [{name: this.name, email: this.email}],
        rsaBits: 2048
      }).then((key) => {
        this.privateKey = key.privateKeyArmored
        this.publicKey = key.publicKeyArmored
        this.processing = false
      })
    },
    clearKey: function () {
      this.privateKey = ""
      this.publicKey = ""
    },
    copyPublicKey: function() {
      this.$copyText(this.publicKey)
    },
    copyPrivateKey: function() {
      this.$copyText(this.privateKey)
    }
  }
}
</script>
