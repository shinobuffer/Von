<template>
  <div id="app">
    <the-site-navigator/>
    <nuxt class="site-wrapper"/>
    <the-site-footer/>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import TheSiteNavigator from '../components/TheSiteNavigator';
import TheSiteFooter from '../components/TheSiteFooter';
export default {
  components: {
    TheSiteFooter,
    TheSiteNavigator
  },
  data(){
    return{

    }
  },
  computed:{
    ...mapState(['isMobile','isMasked','screenWidth','scrollTop','screenHeight','appBg']),
  },
  watch:{
    isMasked(cur){
      //弹窗屏蔽底层滑动
      if (cur){
        this.st = document.scrollingElement.scrollTop;
        document.body.classList.add('masked');
        document.body.style.top = -this.st+'px';
      }
      else{
        document.body.classList.remove('masked');
        document.scrollingElement.scrollTop = this.st;
      }
    },
  }
}
</script>

<style>
</style>

