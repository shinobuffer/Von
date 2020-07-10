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
            <acg-panel v-for="article in curArts" :key="article.aid" :article="article"/>
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
        <component :is="asideName"></component>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import AcgPanel from '~/components/public/AcgPanel';
import AnimeAside from '~/components/aside/AnimeAside';
import CodeAside from '~/components/aside/CodeAside';
import GameAside from '~/components/aside/GameAside';
import UCONF from '~/config/user.conf';
const {siteTitle} = UCONF;
export default {
  head(){
    return{
      title:`${this.title} | ${siteTitle.title}`
    }
  },
  validate({params}){
    return ['anime','code','game'].indexOf(params.type)!==-1
  },
  components:{
    AcgPanel,
    AnimeAside,
    CodeAside,
    GameAside
  },
  asyncData({app,params,req}){
    const asideMap = {anime:'AnimeAside',code:'CodeAside',game:'GameAside'};
    const titleMap = {anime:'二次螈',code:'极客',game:'游民'};
    return app.$fetch('/apis/apiv1.php',{_:params.type},req).then(res=>{
      let {headerInfo,artsNew,artsHot,artNum} = res.data.data;
      return{
        title:titleMap[params.type],
        asideName:asideMap[params.type],
        headerInfo,
        arts:{
          0:{1:artsNew},
          1:{1:artsHot}
        },
        curArts:artsNew.concat(),
        artWaiting:false,
        noContent:!parseInt(artNum),
        pageNum:Math.ceil(parseInt(artNum)/6)
      }
    })
  },
  data(){
    return{
      title:'',
      asideName:'',

      headerInfo:{imgSrc:'/static/images/loading.gif',title:'XX',description:''},
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
        this.$fetch('/apis/apiv2.php',{_:this.$route.params.type,pn:cur,order:this.orderFlag}).then(response=>{
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
