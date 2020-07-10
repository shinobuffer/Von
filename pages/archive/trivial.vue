<template>
  <div>
    <div class="page-header-wrap">
      <div class="pattern-full-width page-header">
        <div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
        <div class="page-info fc">
          <h2 class="intro">{{headerInfo.title}}</h2>
          <p class="tsukkomi">{{headerInfo.description}}</p>
        </div>
      </div>
    </div>

    <div class="page-content-wrap">
      <div class="page-content acg fc">
        <div class="content-primary">
          <div class="article-order no-select">
            <span>排序</span>
            <ul class="order-list">
              <li :class="{'o-selected':orderFlag===0}" @click="orderFlag=0">按时间</li>
              <li :class="{'o-selected':orderFlag===1}" @click="orderFlag=1">按热度</li>
            </ul>
          </div>
          <div class="article-list" data-empty-text="如果你看到了这个，说明我在搬砖" :class="{empty:noContent}">
            <waiting v-show="artWaiting"/>
            <div class="panel-t tl" v-for="art in curArts" :key="art.aid">
              <p class="pt-time"><i class="iconfont icon-time"></i> {{art.time.substr(0,10)}}</p>
              <div class="panel-t-img">
                <nuxt-link :to="art.aid" append>
                  <img v-lazyload="[`/root${art.imgSrc}`,`/root${art.imgSrc}.thumb`]" :alt="art.title">
                </nuxt-link>
              </div>
              <div class="panel-t-info ">
                <h2 class="title"><nuxt-link :to="art.aid" append>{{art.title}}</nuxt-link></h2>
                <p class="preview">{{art.preview}}</p>
                <p class="cut-line-d" style="margin: .1rem 0"></p>
                <span><i class="iconfont icon-geren"></i>{{art.author}}</span>
                <span><i class="iconfont icon-fire"></i>{{art.readCount}}</span>
                <span><nuxt-link :to="art.aid+'#comments'" append class="comments"><i class="iconfont icon-comment"></i>{{art.commentCount}}</nuxt-link></span>
              </div>
            </div>
          </div>
          <div class="pager-no-more" v-show="pageNum===curPage&&!artWaiting">没有更多啦</div>
          <div class="paging-box" v-if="pageNum>1">
            <ol class="pb-original">
              <li class="prev" @click="curPage--" v-if="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
              <li v-show="curPage>=4" @click="curPage=1">1</li>
              <li v-show="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
              <li v-for="each in pageList" :key="each" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
              <li v-show="curPage<=pageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
              <li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
              <li class="next" @click="curPage++" v-if="curPage!==pageNum"><i class="iconfont icon-caretright"></i></li>
            </ol>
            <div class="pb-jump">
              <span>共{{pageNum}}页，跳至</span>
              <input type="text" @keyup.enter="pageJump">
              页
            </div>
          </div>
        </div>
        <trivial-aside v-if="!isMobile"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import TrivialAside from '~/components/aside/TrivialAside';
import UCONF from '~/config/user.conf';
const {title} = UCONF.siteTitle;
export default {
  name: "Trivial",
  head(){
    return{
      title:`随写 | ${title}`
    }
  },
  components:{
    TrivialAside
  },
  asyncData({app,req}){
    return app.$fetch('/apis/apiv1.php',{_:'trivial'},req).then(res=>{
      let {headerInfo,artsNew,artsHot,artNum} = res.data.data;
      return{
        headerInfo,
        arts:{
          0:{1:artsNew},
          1:{1:artsHot}
        },
        curArts:artsNew.concat(),
        artWaiting:false,
        noContent:!parseInt(artNum),
        pageNum:Math.ceil(parseInt(artNum)/8)
      }
    })
  },
  data(){
    return{
      headerInfo:{imgSrc:'/static/images/loading.gif',title:'随写',description:''},
      artWaiting:true,
      noContent:false,
      pageNum:1,
      curPage:1,
      orderFlag:0,
      arts:{
        0:{},
        1:{}
      },
      curArts:[]
    }
  },
  computed:{
    pageList(){
      if(this.pageNum===1)return [1];
      else if(this.pageNum===2)return[1,2];
      else if(this.pageNum===3)return[1,2,3];
      else if(this.curPage===1)return[1,2,3];
      else if(this.curPage===2)return[1,2,3,4];
      else if(this.curPage>=3&&this.curPage<=this.pageNum-2)return[this.curPage-2,this.curPage-1,this.curPage,this.curPage+1,this.curPage+2];
      else if(this.curPage===this.pageNum-1)return[this.curPage-2,this.curPage-1,this.curPage,this.pageNum];
      else return[this.curPage-2,this.curPage-1,this.curPage];
    },
    ...mapState(['isMobile'])
  },
  watch:{
    orderFlag(cur){
      if(this.curPage===1){
        this.curArts.length = 0;
        this.arts[cur][1].forEach(e=>this.curArts.push(e));
      }
      else this.curPage = 1;
    },
    curPage(cur){
      if(this.arts[this.orderFlag][cur]){
        this.curArts.length = 0;
        this.arts[this.orderFlag][cur].forEach(e=>this.curArts.push(e));
      }
      else{
        while (this.curArts.pop()){}
        this.artWaiting = true;
        this.$fetch('/apis/apiv2.php',{_:'trivial',pn:cur,order:this.orderFlag}).then(response=>{
          this.$set(this.arts[this.orderFlag],cur,response.data.data.arts);
          this.artWaiting = false;
          this.arts[this.orderFlag][cur].forEach(e=>this.curArts.push(e));
        })
      }
    }
  },
  methods:{
    pageJump(e){
      let page = parseInt(e.target.value);
      if(!isNaN(page))
        this.curPage = page<1?1:(e.target.value>this.pageNum?this.pageNum:page);
      e.target.value='';
    }
  }
}
</script>

<style>
</style>
