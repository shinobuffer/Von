<template>
  <div class="panel">
    <div class="panel-img">
      <nuxt-link :to="article.aid" append>
        <img class="img" v-lazyload="[`/root${article.imgSrc}`,`/root${article.imgSrc}.thumb`]" :alt="article.title">
      </nuxt-link>
    </div>
    <div class="panel-info">
      <h2 class="title"><nuxt-link class="title" :to="article.aid" append>{{article.title}}</nuxt-link></h2>
      <p class="preview">{{article.preview}}</p>
      <p class="cut-line" style="margin: .1rem 0"></p>
      <div class="meta">
        <span class="author"><i class="iconfont icon-geren"></i>{{article.author}}</span>
        <span class="time"><i class="iconfont icon-time"></i>{{article.time|ymd2Mdy}}</span>
        <span class="hit"><i class="iconfont icon-fire"></i>{{article.readCount}}</span>
        <nuxt-link :to="article.aid+'#comments'" append class="comments"><i class="iconfont icon-comment"></i>{{article.commentCount}}</nuxt-link>
      </div>
      <nuxt-link class="to-article" :to="article.aid" append></nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AcgPanel",
  props:{
    article:{
      type:Object,
      required:true
    }
  },
  filters:{
    ymd2Mdy(datetime){
      let ymd = datetime.substr(0,10).split('-');
      return `${['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(ymd[1])]} ${ymd[2]}, ${ymd[0]}`;
    }
  }
}
</script>

<style>
</style>

