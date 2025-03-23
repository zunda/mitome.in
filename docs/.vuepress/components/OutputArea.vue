<template>
  <div>
    {{ name }}
    <button
      v-bind::disabled="disabled"
      v-on:click="copyText"
      v-bind:title="buttonTitle">
      <font-awesome-icon icon="copy" />
    </button>
    <br>
    <textarea
      v-bind:value="output"
      v-bind:class="cssClass"
      v-bind:spellcheck="false"
      readonly
    />
  </div>
</template>

<script>
import { useClipboard } from '@vueuse/core'
const copyClipboard  = useClipboard().copy

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
  methods: {
    copyText: function() {
      if (this.output != undefined) {
        copyClipboard(this.output).then(() => {
          this.$toast.open({message: this.name + 'をコピーしました', type: 'info'})
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
