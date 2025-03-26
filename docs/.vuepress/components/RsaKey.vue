<template>
  <div>
    <p>
      <input
        v-model="state[owner].name"
        placeholder="ユーザーID"
      >
      <input
        v-model="state[owner].email"
        class="email"
        placeholder="電子メールアドレス"
      >
      <input
        v-model="state[owner].passphrase"
        placeholder="パスフレーズ"
      >
      の鍵対を
      <button v-bind:disabled="state[owner].processing" v-on:click="generateKey">
        生成する
      </button>
    </p>
    <OutputArea
      cssClass="key"
      name="公開鍵"
      v-bind:output="state[owner].publicKey"
      v-bind:disabled="state[owner].processing"
    />
    <OutputArea
      cssClass="key"
      name="私有鍵"
      v-bind:output="state[owner].privateKey"
      v-bind:disabled="state[owner].processing"
    />
  </div>
</template>

<script>
import * as OpenPgp from "openpgp";

import { createGlobalState, useSessionStorage } from "@vueuse/core"
const useState = createGlobalState(
  () => useSessionStorage("mitomein-rsakeys", {})
)

export default {
  props: {
    owner: String,
    defaultName: String,
    defaultEmail: String
  },
  setup() {
    const state = useState()
    return { state }
  },
  created() {
    if (!this.state[this.owner]) {
      this.state[this.owner] = {
        name: this.defaultName,
        email: this.defaultEmail,
        passphrase: "",
        publicKey: "",
        privateKey: "",
      }
    }
    this.state[this.owner].processing = false
  },
  methods: {
    generateKey: function () {
      this.state[this.owner].processing = true
      OpenPgp.generateKey({
        userIDs: [{
          name: this.state[this.owner].name,
          email: this.state[this.owner].email
        }],
        rsaBits: 2048,
        passphrase: this.state[this.owner].passphrase
      }).then(key => {
        this.state[this.owner].publicKey = key.publicKey
        this.state[this.owner].privateKey = key.privateKey
      }).catch(e => {
        console.log(e)
        this.$toast.open({message: e.message, type: "error", duration: 60000})
      }).finally(() => {
        this.state[this.owner].processing = false
      })
    }
  }
}
</script>
