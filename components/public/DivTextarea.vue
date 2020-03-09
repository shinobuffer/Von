<template>
  <div
    v-html="innerText"
    @focus="isLocked = true"
    @blur="isLocked = false"
    @input="changeText"
    @compositionstart="typing=true"
    @compositionend="typing=false"
    contenteditable="true"
  >
  </div>
</template>

<script>
export default {
  name: "DivTextarea",
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      innerText: this.value,
      isLocked: false,
      typing:false
    }
  },
  watch: {
    value(){
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value;
      }
    },
  },
  methods: {
    changeText(){
      setTimeout(()=>{//因为input优先级高于composition，需要延迟降低优先级
        if (!this.typing)
          this.$emit('input', this.$el.innerText)
      },0)
    }
  }
}
</script>

<style>
</style>
