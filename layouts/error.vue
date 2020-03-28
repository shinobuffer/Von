<template>
  <div class="not-find-404" :style="{height:screenHeight+'px'}">
    <div class="container-404">
      <h2>... {{statusCode}} NOT FIND ...</h2>
      <section>
        <p>{{message}}</p>
      </section>
      <a href="javascript:" @click="goBack">返回上一页</a>
      <span> · </span>
      <nuxt-link to="/">返回主页</nuxt-link>
    </div>
  </div>
</template>

<script>
import UCONF from '../config/user.conf';
const {title} = UCONF.siteTitle;
export default {
  name: "error404",
  layout:'error_',
  head(){
    return{
      title:`${this.message} | ${title}`
    }
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed:{
    statusCode(){
      return (this.error && this.error.statusCode) || 500
    },
    message(){
      return (this.error && this.error.message) || 'Unknown Error'
    },
    screenHeight(){
      return this.$store.state.screenHeight;
    }
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>
