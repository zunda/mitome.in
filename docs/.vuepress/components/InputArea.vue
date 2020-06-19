<template>
  <div>
    {{ _uid }}
    <textarea v-model="inputText" v-bind:class="cssClass" v-bind:spellcheck="false" v-bind:placeholder="name" @blur="commitText" v-on:input="onInput" />
    <button v-bind::disabled="disabled" v-on:click="clearText" v-bind:title="buttonTitle" style="float:right;">
      <Fa-Eraser />
    </button>
  </div>
</template>

<script>
import Vue from 'vue'

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
Vue.use(VueToast)

export default {
  props: {
    text: String,
    name: String,
    cssClass: String,
    disabled: {default: false, type: Boolean},
    onInput: {default: undefined, type: Function}
  },
  data() {
    return {
      inputText: '',
      buttonTitle: this.name + "を消去する"
    }
  },
  methods: {
    clearText: function() {
      this.text = ''
      this.inputText = ''
    },
    commitText: function() {
      this.text = this.inputText
      // Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders
      console.log("commitText")
    }
  }
}
</script>
