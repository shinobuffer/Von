<template>
  <transition name="info-box" type="transition">
    <div class="info-box fc" v-if="infoShow" :style="{background:infoOK?'#3dcaff':'#ff763b'}">
      <!--			  '#e5ffe880':'#ffe3e380'  #5abebc终物语出现的颜色-->
      <h4><i :class="infoOK?'iconfont icon-ok':'iconfont icon-warn'"></i>{{info}}</h4>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "PopupInfoBox",
  computed:{
    ...mapState('infoBox',['infoShow','infoOK','info'])
  }
}
</script>

<style>
</style>
