<template>
  <div style="background-image: url(/root/site/bg/dynamicbg.png)">
    <div class="page-content-wrap">
      <div class="page-content dynamic fc">
        <div class="left-panel">
          <div class="scroll-content">
            <div class="author-sub-panel">
              <div class="loading-content h-1p5" v-if="loading"></div>
              <div class="content tl" v-else>
                <div class="author-pic"></div>
                <p class="fzz">
                  <nuxt-link to="/about" class="author-namae">{{authorInfo.author}}</nuxt-link>
                  <span class="author-status no-select" :style="{background:statusMap[status].color}"><i class="iconfont" :class="statusMap[status].icon"></i>{{statusMap[status].des}}</span>
                  <span class="author-sign">{{authorInfo.signature}}</span>
                </p>
                <div class="author-statistics tc">
                  <nuxt-link to="/archive" class="cell"><p>{{statistics['aCount']}}</p><span>文章</span></nuxt-link>
                  <nuxt-link to="/note" class="cell"><p>{{statistics['nCount']}}</p><span>笔记</span></nuxt-link>
                  <nuxt-link to="/dynamic" class="cell"><p>{{statistics['dCount']}}</p><span>动态</span></nuxt-link>
                </div>
                <span class="author-avatar"><img alt="author" :src="authorInfo.avatar"></span>
              </div>
            </div>
            <div class="recommend-sub-panel tl">
              <p class="title">推荐所</p>
              <div class="loading-content h-p5" v-if="loading"></div>
              <div class="recommend-list" v-else>
                <a v-for="item in recommendations"
                   target="_blank" :title="item.title"
                   :key="item.id" :href="item.url">{{item.title}}</a>
              </div>
            </div>
          </div>
        </div>

        <div class="right-panel">
          <div class="publish-sub-panel">
            <span>目前没卵用的 input</span>
            <div class="editor">
              <input v-model="danmaku" type="text" class="danmaku-input" placeholder="弹幕测试！" >
              <div class="danmaku-send no-select">biu~</div>
            </div>
            <div class="toolbar">
            </div>
          </div>
          <div class="main-panel">
            <div class="d-card-list">
              <dynamic-card
                v-for="item in dynamics"
                :key="item.id"
                :ddata="item"
                :emoData_="emoData"
                :emoMap_="emoMap"/>
            </div>
            <div class="no-more" v-show="noMore">
              <p>你已经到达了世界的尽头</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import UCONF from "~/config/user.conf";
import DynamicCard from '~/components/DynamicCard';
const {siteTitle:{title},statusMap} = UCONF;
export default {
  validate({params}){
    return !params.did || /^[1-9]\d*$/.test(params.did)
  },
  head(){
    return{
      title:`动态 | ${title}`
    }
  },
  components:{
    DynamicCard
  },
  async asyncData({app,params,req,error}){
    let [{data:emoData},res] = await Promise.all([
      app.$fetch('/static/emo/emo.json',{},req),
      app.$fetch('/apis/apiv16.php',params,req)
    ]);
    if (res.data.data.dynamics.length === 0){
      error({statusCode:404,message:'动态404'});
      return;
    }

    let emoMap={};
    emoData.forEach(e=>{
      e.thumbnail = e.path + e.thumbnail;
      if (e.pic){
        let f = e.path.split('/');
        let g = f[f.length-2]+'_';//类别前缀
        e.emoList.forEach(f=>{
          f.des = g + f.des;
          f.imgSrc=e.path+f.imgSrc;
          f.insert = '∫f(' + f.des + ')';
          emoMap[f.des] = f.imgSrc;
        });
      }
    });

    let{author,avatar,info:{sign,status},statistics,recommendations,dynamics} = res.data.data;
    return{
      emoData,
      emoMap,

      waiting:false,
      noMore:!!params.did,
      loading:false,
      authorInfo:{author,avatar,signature:sign},
      status,
      statistics,
      recommendations,
      dynamics
    }
  },
  data(){
    return{
      loading:true,//标识初始化加载状态
      status:0,
      statusMap:statusMap,
      authorInfo:{},
      statistics:{},
      recommendations:[],
      danmaku:'',

      emoData:[{emoSeries:'',emoList:[]}],
      emoMap:{},

      dynamics:[],
      waiting:false,//标识更多动态加载状态
      noMore:false//标识是否穷尽动态
    }
  },
  computed:{
    ...mapGetters(['xAboveBottom'])
  },
  watch:{
    xAboveBottom(cur){
      if (cur<500)this.loadMore();
    }
  },
  methods:{
    loadMore(){
      if (!this.noMore&&!this.waiting) {
        this.waiting = true;
        this.$fetch('/apis/apiv16.php',{offset:this.dynamics.length}).then(response=>{
          let tmp = response.data.data.dynamics;
          this.waiting = false;
          if (tmp.length) tmp.forEach(e=>this.dynamics.push(e));
          else this.noMore = true;
        })
      }
    }
  }
}
</script>

<style>
</style>
