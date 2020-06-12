<template>
  <div>
    <p>
      {{ name }} &lt;<tt>{{ email }}</tt>&gt; の鍵対を
      <button v-on:click="generateKey">生成する</button>
      <button v-on:click="clearKey">消す</button>
    </p>
    <p>公開鍵<pre>{{ privateKey }}</pre></p>
    <p>私有鍵<pre>{{ publicKey }}</pre></p>
  </div>
</template>

<script>
import OpenPgp from 'openpgp'

export default {
  props: {
    name: String,
    email: String
  },
  data() {
    return {
      privateKey: "",
      publicKey: ""
    }
  },
  methods: {
    generateKey: function () {
      OpenPgp.generateKey({
        userIds: [{name: this.name, email: this.email}],
        rsaBits: 2048
      }).then((key) => {
        this.privateKey = key.privateKeyArmored
        this.publicKey = key.publicKeyArmored
      })
    },
    clearKey: function () {
      this.privateKey = ""
      this.publicKey = ""
    }
  }
}
</script>

<style>
pre {
  background-color: #282c34;
  color: #a0f0a0;
}
</style>
