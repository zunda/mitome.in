<template>
  <div>
    {{ name }}
    <button
      v-bind::disabled="disabled"
      v-on:click="copyText"
      v-bind:title="buttonTitle">
      <Fa-Copy />
    </button>
    <br>
    <textarea
      v-model="outputText"
      v-bind:class="cssClass"
      v-bind:spellcheck="false"
      readonly
    />
  </div>
</template>

<script>
import Vue from 'vue'

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
Vue.use(VueToast)

export default {
  props: {
    section: String,
    name: String,
    output: String,
    cssClass: String,
    disabled: {default: false, type: Boolean}
  },
  data() {
    return {
      buttonTitle: this.name + 'をクリップボードにコピーする'
    }
  },
  computed: {
    outputText: function() {
      if (this.output !== undefined) {
        this.commitText()
        return this.output
      } else {
        return this.$store.state.outputText[this.section]
      }
    } 
  },
  methods: {
    copyText: function() {
      if (this.outputText != undefined) {
        this.$copyText(this.outputText).then(() => {
          Vue.$toast.open({message: this.name + 'をコピーしました', type: 'info'})
        }).catch(e => {
          console.log(e)
          Vue.$toast.open({message: e, type: 'error', duration: 60000})
        })
      } else {
        Vue.$toast.open({message: 'コピーする内容がありません', type: 'warning'})
      }
    },
    commitText: function() {
      this.$store.commit('setOutputText', {
        section: this.section, text: this.output
      })
    }
  }
}
</script>
