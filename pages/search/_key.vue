<template>
  <div>
    <div class="page-content-wrap">
      <div class="page-content">
        <div class="content-primary-s">
          <div class="search-box">
            <i class="iconfont icon-search" @click="postSearch"></i>
            <input type="search" v-model.trim="searchKey" class="fc" @keyup.enter="postSearch" name="s" placeholder="搜些其他东西?">
          </div>
          <header class="search-header fc">
            <h1>{{searchWaiting?'搜索中…':`「${$route.params.key}」搜索结果`}}</h1>
          </header>
          <div class="waiting" v-if="searchWaiting">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
          <div class="search-results" v-else-if="searchFound">
            <div class="panel-h" v-for="each in curResults" :key="each.id+each.type">
              <div class="panel-h-img">
                <nuxt-link :to="each|artUrl">
                  <img v-lazyload="[`/root${each.imgSrc}`,`/root${each.imgSrc}.thumb`]">
                  <div class="float-preview fc tl">{{each.preview}}</div>
                </nuxt-link>
              </div>
              <div class="panel-h-info">
                <div class="post-time">
                  <p class="pt-ym">{{each.time|ym}}</p>
                  <p class="pt-d">{{each.time.substr(8,2)}}</p>
                </div>
                <div class="post-meta tl">
                  <span><i class="iconfont icon-hash"></i><nuxt-link :to="each|typeUrl"> {{each.type|typeEN2CN}}</nuxt-link></span>
                  <span><i class="iconfont icon-comment"></i><nuxt-link :to="each|commentUrl"> {{each.commentCount|commentNum}}</nuxt-link></span>
                </div>
                <div class="post-title">
                  <p><nuxt-link :to="each|artUrl">{{each.title}}</nuxt-link></p>
                </div>
              </div>
            </div>
            <div class="pager" v-if="curResults.length<resultNum" @click="loadMore" >
              <div class="dec"></div>
              <div class="previous-more">
                <span>More</span>
              </div>
            </div>
            <div class="pager-no-more fc" v-else>没有更多啦( *・ω・)✄╰ひ╯</div>
          </div>
          <div class="search-404 fc" v-else>
            <h3>没有找到任何东西！看看其他文章吧</h3>
            <ul>
              <li v-for="each in randomResult" :key="each.id+each.type">
                <nuxt-link :to="each|artUrl">{{each.title}}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mixin_PanelH from	"~/reuse/mixins/Mixin-PanelH";
import UCONF from "~/config/user.conf";
const {title} = UCONF.siteTitle;
export default {
  validate({params}){
    return !!params.key
  },
  head(){
    return{
      title:`${this.headTitle} | ${title}`
    }
  },
  mixins:[Mixin_PanelH],
  filters:{
    artUrl(art){
      return art.type==='note'?'/note/'+art.id:'/archive/'+art.type+'/'+art.id
    },
    typeUrl(art){
      return art.type==='note'?'/note':'/archive/'+art.type
    },
    commentUrl(art){
      let url = art.type==='note'?'/note/'+art.id:'/archive/'+art.type+'/'+art.id;
      return url + '#comments';
    }
  },
  asyncData({app,params,req}){
    //分成searchResult 和 randomResult，防止 panel 抢用 randomResult（因为asyncData中无法控制searchFound的更新顺序
    if (process.client){
      return app.$fetch('/apis/apiv10.php',{s:params.key}).then(res=>{
        let {found,result} = res.data.data;
        return{
          headTitle:`搜索：${params.key}`,
          searchWaiting:false,
          searchFound:!!found,
          searchResults:result,
          resultNum:result.length,
          curResults:!!found?result.slice(0,result.length<8?result.length:8):[],
          randomResult:!!found?[]:result
        }
      })
    }
    else
      return app.$relayFetch('/apis/apiv10.php',{s:params.key},req.headers).then(res=>{
        let {found,result} = res.data.data;
        return{
          headTitle:`搜索：${params.key}`,
          searchWaiting:false,
          searchFound:!!found,
          searchResults:result,
          resultNum:result.length,
          curResults:!!found?result.slice(0,result.length<8?result.length:8):[],
          randomResult:!!found?[]:result
        }
      })
  },
  data(){
    return {
      headTitle:'搜索中',
      searchKey:'',
      searchWaiting:true,
      searchFound:true,
      searchResults:[],
      resultNum:0,
      curResults:[],
      randomResult:[],
    }
  },
  methods:{
    postSearch(){
      if (this.searchKey!==this.$route.params.key){
        if (!this.searchWaiting){
          this.resultNum = 0;
          this.searchWaiting = this.searchFound = true;
          this.$router.push({name:'search-key',params:{key:this.searchKey}});
          this.searchKey = '';
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
      }
    },
    loadMore(){
      if (this.curResults.length === this.resultNum){}
      else if (this.curResults.length + 8 < this.resultNum)
        for(let i=0;i<8;i++)this.curResults.push(this.searchResults[this.curResults.length]);
      else
        for(let i=this.curResults.length;i<this.resultNum;i++)this.curResults.push(this.searchResults[i]);
    }
  },
}
</script>

<style>
</style>
