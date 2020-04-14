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
      <div class="page-content note fc">
        <div class="notice tl" v-if="notice"><i class="iconfont icon-notify"></i>{{notice}}</div>
        <div class="content-primary-n">
          <div class="note-sort-options">
            <span class="nso-l" :class="{'nso-selected':!rSelected}" @click="rSelected=false">日期降序</span>
            <span class="nso-r" :class="{'nso-selected':rSelected}" @click="rSelected=true">分类归类</span>
          </div>
          <!--waiting组件移除-->
          <div class="list-container tl" v-show="rSelected">
            <div class="category-list" v-for="(item,key) in catMap" :key="key">
              <div class="category-title">
                {{item.catName}}<span> · {{item.catName_en}}</span>
              </div>
              <div class="category-list-item" v-for="(item_,index_) in sortedNotes[key]" :key="item_.nid">
                <span class="item-num">{{index_|twoNum}}</span>
                <span class="item-name">
									<nuxt-link :to="item_.nid" class="item-link" append>{{item_.title}}</nuxt-link>
								</span>
                <span class="item-date">{{item_.time.substr(0,10)}}</span>
              </div>
            </div>
          </div>

          <div class="note-list tl" v-show="!rSelected">
            <div class="panel-n-wrap" v-for="each in curNotes" :key="each.nid"><!--需要：时间o，标题o，预览o，图片o，分类，nido-->
              <div class="panel-n" >
                <div class="panel-n-img">
                  <nuxt-link :to="each.nid" append>
                    <img v-lazyload="[`/root${each.imgSrc}`,`/root${each.imgSrc}.thumb`]">
                    <div class="float-preview tl">{{each.preview}}</div>
                  </nuxt-link>
                </div>
                <div class="slant-mask slant-beneath"></div>
                <div class="slant-mask">
                  <i class="iconfont icon-time"> {{each.time.substr(0,10)}}</i>
                </div>
                <div class="panel-n-info">
                  <div class="title">
                    <nuxt-link :to="each.nid" append>{{each.title}}</nuxt-link>
                  </div>
                  <div class="category no-select">
                    {{each.catName}}<span> · {{each.catName_en}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pager" v-if="curNotes.length<noteNum" @click="loadMore" >
              <div class="dec"></div>
              <div class="previous-more">
                <span>More</span>
              </div>
            </div>
            <div class="pager-no-more" v-else>没有更多啦( *・ω・)✄╰ひ╯</div>
          </div>
        </div>
        <div class="content-aside-n">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  head(){
    return{
      title:`笔记 | ${title}`
    }
  },
  filters:{
    twoNum(data){
      data++;
      return data<10?'0'+data:data
    }
  },
  asyncData({app,req}){
    return app.$fetch('/apis/apiv1.php',{_:'note'},req).then(res=>{
      let {headerInfo,catMap,notes,notice} = res.data.data;
      notes.forEach(e=>{
        e.tags = e.tags?e.tags.split(','):[];
      });
      let sortedNotes = {};
      for(let cat in catMap)
        sortedNotes[cat] = notes.filter(e=>e.catID===cat);
      return{
        noteWaiting:false,
        headerInfo:headerInfo,
        catMap:catMap,
        notes:notes,
        noteNum:notes.length,
        curNotes:notes.slice(0,notes.length<6?notes.length:6),
        notice:notice,
        sortedNotes:sortedNotes
      }
    })
  },
  data(){
    return{
      headerInfo:{imgSrc:'/static/images/loading.gif',title:'笔记',description:''},
      catMap:{},
      noteWaiting:true,
      noteNum:0,
      rSelected:true,

      notice:null,
      notes:[],
      sortedNotes:{},
      curNotes:[]
    }
  },
  computed:{
    ...mapGetters(['xAboveBottom']),
  },
  watch:{
    xAboveBottom(cur){
      if (cur<500)this.loadMore();
    }
  },
  methods:{
    loadMore(){
      if(this.rSelected||this.curNotes.length===this.noteNum)
        return;
      if(this.curNotes.length+6<this.noteNum)
        for(let i=0;i<6;i++)this.curNotes.push(this.notes[this.curNotes.length]);
      else
        for(let i=this.curNotes.length;i<this.noteNum;i++)this.curNotes.push(this.notes[i]);
    }
  },
}
</script>

<style>
</style>
