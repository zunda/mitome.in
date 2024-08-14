<template>
  <div>
    <textarea
      v-model="inputText"
      v-bind:class="cssClass"
      v-bind:spellcheck="false"
      v-bind:placeholder="name"
      v-on:blur="commitText"
      v-on:input="onInput"
    />
    <button
      v-bind::disabled="disabled"
      v-on:click="clearText"
      v-bind:title="buttonTitle"
      style="float:right;">
      <Fa-Eraser />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    section: String,
    name: String,
    cssClass: String,
    disabled: {default: false, type: Boolean},
    onInput: {default: function(){}, type: Function}
  },
  data() {
    return {
      inputText: this.$store.state.inputText[this.section] || '',
      buttonTitle: this.name + 'を消去する'
    }
  },
  methods: {
    clearText: function() {
      this.inputText = ''
      this.onInput()
      this.commitText()
    },
    commitText: function() {
      this.$store.commit('setInputText', {
        section: this.section, text: this.inputText
      })
    }
  }
}
</script>
