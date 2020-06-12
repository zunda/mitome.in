<template>
  <div>
    <h3>公開鍵</h3><pre>{{ privateKey }}</pre>
    <h3>私有鍵</h3><pre>{{ publicKey }}</pre>
    <button v-on:click="generateKey">鍵対を生成する</button>
    <button v-on:click="clearKey">鍵対を消す</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      privateKey: "",
      publicKey: ""
    }
  },
  methods: {
    generateKey: function () {
      this.privateKey = "Private Key"
      this.publicKey = "Public Key"
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
