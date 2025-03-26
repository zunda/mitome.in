<template>
  <div>
    <textarea
      v-model="inputArea"
      v-bind:class="cssClass"
      v-bind:placeholder="name"
      spellcheck="false"
      v-on:change="commitInput"
    />
    <button
      v-bind::disabled="disabled"
      v-on:click="clearText"
      v-bind:title="buttonTitle"
      style="float:right;">
      <font-awesome-icon icon="eraser" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    input: String,
    cssClass: String,
    disabled: {default: false, type: Boolean},
    onUpdate: {default: function(){}, type: Function}
  },
  data() {
    return {
      inputArea: this.input,
      buttonTitle: this.name + "を消去する"
    }
  },
  methods: {
    commitInput: function() {
      this.onUpdate(this.inputArea)
    },
    clearText: function() {
      this.inputArea = ""
      this.onUpdate("")
    }
  }
}
</script>
