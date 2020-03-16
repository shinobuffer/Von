<template>
  <transition name="LB">
    <div class="luminous-box-container"  v-if="LBshow" :class="{'sidebar-show':LBsidebarShow}" >
      <div class="luminous-box-bg"></div>
      <div class="luminous-box-inner">
        <div class="luminous-box-topbar">
          <div class="process pl">
            {{LBIndex+1}} / {{LBImgs.length}}&nbsp;&nbsp;&nbsp;
            <span>{{LBTimes[LBIndex].substr(0,16)}}</span>
          </div>
          <div class="toolbar pr">
            <button @click="LBsidebarShow=!LBsidebarShow"><i class="iconfont icon-liebiao"></i></button>
            <button @click="autoplay"><i :class="interval?'iconfont icon-stop':'iconfont icon-Play'"></i></button>
            <button @click="closeLB"><i class="iconfont icon-cancel"></i></button>
          </div>
        </div>
        <div class="luminous-box-nav">
          <button @click.stop="LBprevious" class="lprev"><i class="iconfont icon-zuojiantouleftarrow"></i></button>
          <button @click.stop="LBnext" class="rnext"><i class="iconfont icon-youjiantourightarrowddfiles"></i></button>
        </div>
        <div class="luminous-box-stage">
          <transition name="LBimg">
            <div class="luminous-box-img-wrap" v-if="LBimgShow">
              <img :src="'/root'+LBImgs[LBIndex]" :alt="LBDescriptions[LBIndex]">
            </div>
          </transition>

        </div>
        <div class="luminous-box-caption">
          <transition name="LBimg">
            <p v-if="LBimgShow">{{LBDescriptions[LBIndex]}}</p>
          </transition>

        </div>
      </div>
      <div class="luminous-box-sidebar" v-show="LBsidebarShow" >
        <a v-for="(each,index) in LBImgs" :key="index" @click="jumpto(index)" :class="{active:index===LBIndex}" :style="{backgroundImage:'url(/root'+each+')'}" :title="LBDescriptions[index]"></a>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "LuminousBox",
  data(){
    return {
      LBimgShow:true,
      LBsidebarShow:false,
      interval:null
    }
  },
  computed:{
    ...mapState('lumiBox',{
      LBImgs: state => state.imgs,
      LBDescriptions: state => state.descriptions,
      LBTimes: state => state.times,
      LBIndex: state => state.index,
      LBshow: state => state.show,
    })
  },
  mounted(){
    document.onkeyup = (e)=>{
      if (this.LBshow && e.keyCode === 27)
        this.$store.commit('lumiBox/showC',false);
    }
  },
  watch:{
    LBshow(cur){
      this.$store.commit('isMaskedC',cur)
    },
  },
  methods:{
    LBnext(){
      if (this.LBIndex<this.LBImgs.length-1){
        this.LBimgShow = false;
        this.$store.commit('lumiBox/indexC',this.LBIndex+1);
        setTimeout(()=>this.LBimgShow = true,200)
      }
    },
    LBprevious(){
      if (this.LBIndex>0){
        this.LBimgShow = false;
        this.$store.commit('lumiBox/indexC',this.LBIndex-1);
        setTimeout(()=>this.LBimgShow = true,200)
      }
    },
    jumpto(index){
      if (this.LBIndex!==index){
        this.LBimgShow = false;
        this.$store.commit('lumiBox/indexC',index);
        setTimeout(()=>this.LBimgShow = true,200);
      }
    },
    closeLB(){
      this.$store.commit('lumiBox/showC',false);
      this.LBsidebarShow = false;
      if (this.interval)
        clearInterval(this.interval);
      this.interval = null;
    },
    autoplay(){
      if (!this.interval)
        this.interval = setInterval(()=>this.jumpto((this.LBIndex+1)%this.LBImgs.length),4000);
      else{
        clearInterval(this.interval);
        this.interval = null
      }
    }
  }
}
</script>

<style>
</style>
