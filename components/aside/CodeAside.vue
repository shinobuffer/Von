<template>
  <div class="content-aside">
    <div class="ca language">
      <ul :style="{width:`${langNum}00%`,marginLeft:ulLeft*100+'%'}">
        <li class="language-img-wrap" v-for="each in languageList" :key="each.lang">
          <img :src="each.imgSrc" width="280" height="410" :alt="each.lang">
          <p>{{each.description}}</p>
        </li>
      </ul>
      <span class="lprev" style="left: 0"><i class="iconfont icon-chevronleft" @click="prevLang"></i></span>
      <span class="lnext" style="right: 0"><i class="iconfont icon-chevronright" @click="nextLang"></i></span>
    </div>
    <div class="ca series tl">
      <div class="series-head"><i class="iconfont icon-paperclip"></i>系列文章</div>
      <div class="loading-content h-p5" v-if="loading"></div>
      <ul class="series-content" v-else-if="seriesList.length">
        <li v-for="item in seriesList">
          <nuxt-link :to="item|seriesUrl" :title="item|seriesTitle">{{item.name}}</nuxt-link>
        </li>
      </ul>
      <p class="no-content fz-14 tc" v-else>一个字，懒<br/>三个字，咕咕咕</p>
    </div>
    <div class="ca board">
      <div class="board-head">
        <span>Error　</span><i class="iconfont icon-story clearm ibold"></i>
      </div>
      <div class="board-content"
           :class="{pointer:dynamic.id}"
           @click="openDyn(dynamic.id)"
           v-html="dynamic.content"></div>
      <div class="board-post-time">{{dynamic.time|dynTime}}</div>
    </div>
  </div>
</template>

<script>
import Mixin_ContentAside from "~/reuse/mixins/Mixin-ContentAside";
import UCONF from "~/config/user.conf";
export default {
  name: "CodeAside",
  filters:{
    seriesUrl(item){
      return `/series/${item.name}`;
    },
    seriesTitle({name,count}){
      return `${count}篇 | ${name}`;
    }
  },
  mixins:[Mixin_ContentAside],
  data(){
    return{
      loading:true,
      ulLeft:0,
      languageList:UCONF.languageList,
      langNum:UCONF.languageList.length,
      seriesList:[],
    }
  },
  beforeMount() {
    this.$fetch('/apis/apiv8p1.php',{_:'code'}).then(res=>{
      let data = res.data.data;
      this.loading = false;
      data.seriesList.forEach(e=>this.seriesList.push(e));
      if (data.dynamic)
        this.dynamic = data.dynamic;
      this.dynamic.content = this.markIt(this.dynamic.content);
    })
  },
  methods:{
    prevLang(){
      this.ulLeft = this.ulLeft===0?1-this.langNum:this.ulLeft+1
    },
    nextLang(){
      this.ulLeft = this.ulLeft===1-this.langNum?0:this.ulLeft-1
    }
  }
}
</script>

<style>
</style>
