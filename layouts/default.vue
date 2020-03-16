<template>
  <div :id="isMobile?'mobile-app':'app'">
    <the-site-navigator/>
    <nuxt class="site-wrapper"/>
    <the-site-footer/>
    <luminous-box/>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import TheSiteNavigator from '../components/TheSiteNavigator';
import TheSiteFooter from '../components/TheSiteFooter';
import LuminousBox from '../components/LuminousBox';
export default {
  components: {
    TheSiteFooter,
    TheSiteNavigator,
    LuminousBox
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
  @font-face {
    font-family: 'Fira Code VF';
    src: url('/static/fonts/FiraCode-VF.woff') format('woff-variations'), url("/static/fonts/FiraCode-VF.ttf") format("truetype");
    font-weight: 500;
    font-style: normal;
  }
</style>

