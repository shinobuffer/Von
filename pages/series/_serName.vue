<template>
  <div>
    <div class="page-content-wrap">
      <div class="page-content series fc">
        <div class="content-primary-ser">
          <div class="ser-list-m" v-show="isMobile">
            <h4>所有系列</h4>
            <nuxt-link v-for="item in serList" :key="item.serName"
                       :data-count="item.count"
                       :class="{cur:serInfo.serName===item.serName}"
                       :to="item.serName|seriesUrl"
                       @click.native="seriesJmp(item.serName)">{{item.serName}}</nuxt-link>
          </div>
          <div class="waiting" v-if="serWaiting">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <div class="ser-header" v-else>
            <div class="ser-h-left">
              <i class="iconfont icon-book clearm"></i>
              <span>系列</span>
            </div>
            <div class="ser-h-right">
              <h2 class="ser-title">{{serInfo.serName}}</h2>
              <p class="ser-des">{{serInfo.serDes}}</p>
            </div>
          </div>
          <div class="ser-art-list" v-show="!serWaiting">
            <section class="ser-art-list-item" v-show="item.show" v-for="item in serArts" :key="item.id">
              <div class="meta">
                <h3><nuxt-link :to="item|artUrl">{{item.title}}</nuxt-link></h3>
                <span>{{item.time|postTimeCN}}<nuxt-link :to="item|commentUrl">{{item.commentCount|commentNum}}</nuxt-link></span>
                <p>{{item.preview}}</p>
              </div>
            </section>
          </div>
        </div>
        <div class="content-aside-ser">
          <div class="ser-tag-list">
            <h4>标签集</h4>
            <div class="loading-content h-p5" v-if="serWaiting"></div>
            <ul v-else-if="serTags.length">
              <li title="取消筛选" @click="tagFilter(0)">CLEAR</li>
              <li v-for="item in serTags" :key="item"
                  :class="{cur:item===curTag}"
                  @click="tagFilter(item)">{{item}}</li>
            </ul>
            <p class="no-content fz-14" v-else>什么标签都没有</p>
          </div>
          <div class="ser-list">
            <h4>所有系列</h4>
            <ul>
              <li v-for="item in serList" :key="item.serName">
                <nuxt-link :class="{cur:serInfo.serName===item.serName}"
                           :to="item.serName|seriesUrl"
                           @click.native="seriesJmp(item.serName)">{{item.serName}}</nuxt-link>
                <span>({{item.count}}篇)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {unique} from "~/utils/lib";
import {mapState} from 'vuex';
import UCONF from "~/config/user.conf";
const {title} = UCONF.siteTitle;
export default {
  validate({params}){
    return !!params.serName
  },
  head(){
    return{
      title:`系列：${this.$route.params.serName} | ${title}`
    }
  },
  filters:{
    artUrl(item){
      return '/archive/'+item.type+'/'+item.id
    },
    postTimeCN(datetime){
      let ymd = datetime.substr(0,10).split('-');
      return ymd[0] + '年' + ymd[1] + '月' + ymd[2] + '日'
    },
    commentUrl(item){
      return '/archive/'+item.type+'/'+item.id + '#comments';
    },
    commentNum(count){
      return count>0?count+' 评论':'No Comment';
    },
    seriesUrl(serName){
      return '/series/'+serName;
    }
  },
  async asyncData({app,params,req}){
    let res = await app.$fetch('/apis/apiv14.php',{serName:params.serName},req);
    let {serInfo, serArts, serList} = res.data.data;
    serInfo = serInfo || {serName:'系列不存在',serDes:'×××××××××××肆〇肆×××××××××××'};
    let tags = [];
    serArts.forEach(e=>{
      tags = tags.concat(e.tags.split(',').filter(e=>e));
      e.show = true;
      e.tags = e.tags.split(',').filter(e=>e);
    });
    return{
      serWaiting:false,
      serInfo:serInfo,
      serArts:serArts,
      serTags:unique(tags),
      serList:serList
    }
  },
  data(){
    return{
      serWaiting:true,
      serInfo:{serName:'',serDes:''},
      serArts:[],
      serTags:[],
      serList:[],
      curTag:''
    }
  },
  computed:{
    ...mapState(['isMobile'])
  },
  methods:{
    tagFilter(tag){
      if (this.curTag!==tag){
        if (tag)
          this.serArts.forEach(e=>e.show = e.tags.indexOf(tag)>-1);
        else
          this.serArts.forEach(e=>e.show = true);
        this.curTag = tag;
      }
    },
    seriesJmp(serName){
      if (serName !== this.$route.params.serName){
        this.serWaiting = true;
      }
    }
  }
}
</script>

<style>
</style>
