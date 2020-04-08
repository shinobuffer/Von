<template>
  <div>
    <div class="page-header-wrap">
      <div class="pattern-full-width page-header">
        <div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}"></div>
        <div class="page-info fc">
          <h2 class="intro">{{headerInfo.title}}</h2>
        </div>
      </div>
    </div>
    <div class="page-content-wrap">
      <div class="page-content fc" style="padding: .1rem">
        <div class="tag-cloud tl">
          <h2>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h2>
          <ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
            <li class="tag" v-for="item in tagCountList" :key="item.id"><nuxt-link :to="'/tags/'+item.tagName" :title="item.count+' 相关'">{{item.tagName}}</nuxt-link></li>
          </ul>
        </div>
        <div class="archive-list">
          <h2 class="archive-title">归档</h2>
          <span class="archive-title-en">Archives</span>
          <p style="color: #aaa;font-size: .14rem;font-weight: 600">{{this.articles.length-this.noteNum}} 文章 + {{this.noteNum}} 笔记</p>
          <div class="archives">
            <p class="tr" style="padding: 0 .2rem"><a @click="unfoldAll" href="javascript:void(0);">「展开／折叠」</a></p>
            <div class="years-list" v-for="year in year_ord" :key="year">
              <h3>{{year}} 年</h3>
              <ul class="mons-list">
                <li class="ml-item" v-for="mon in arch_data[year].mon_ord" :key="mon">
                  <span class="mon"  @click="unfoldMon(year,mon)" >{{mon}}月({{arch_data[year][mon].articles.length}}篇)</span>
                  <ul class="days-list" :id="year+'-'+mon" :style="{height:arch_data[year][mon].articles.length*26+'px'}" >
                    <li v-for="art in arch_data[year][mon].articles" :key="`${art.type}-${art.id}`">
                      <span class="type" v-if="art.type==='note'">Note</span>
                      <span class="day">{{art.day}}日</span>
                      <nuxt-link :to="art|toUrl">{{art.title}}</nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import Mixin_TagCloud from "../../reuse/mixins/Mixin-TagCloud";
import UCONF from '../../config/user.conf';
const {title} = UCONF.siteTitle;
export default {
  head(){
    return{
      title:`归档 | ${title}`
    }
  },
  mixins:[Mixin_TagCloud],
  filters:{
    toUrl(item){
      return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
    }
  },
  asyncData({app,store,req}){
    let isMobile = store.state.isMobile;
    return app.$fetch('/apis/apiv4.php',{},req).then(res=>{
      let {articles,headerInfo,tagCountList,noteNum} = res.data.data;
      let arch_data={},year_ord;
      articles.forEach(e=>{
        if(!arch_data[e.time.slice(0,4)])
          arch_data[e.time.slice(0,4)] = {};
        if(!arch_data[e.time.slice(0,4)][e.time.slice(5,7)])
          arch_data[e.time.slice(0,4)][e.time.slice(5,7)] = {unfolded:false,articles:[]};
        arch_data[e.time.slice(0,4)][e.time.slice(5,7)]['articles'].push({
          id:e.id,day:e.time.slice(8,10),
          title:e.title,type:e.type,
          readCount:e.readCount,
          commentCount:e.commentCount
        })
      });
      year_ord = Object.keys(arch_data).sort((a,b)=>b-a);
      year_ord.forEach(e=>{
        arch_data[e]["mon_ord"] = Object.keys(arch_data[e]).sort((a,b)=>b-a);
      });
      return{
        articles,
        headerInfo,
        tagCountList,
        noteNum,
        arch_data,
        year_ord,
        manyTags:(!isMobile && tagCountList.length>30)||(tagCountList.length>12 && isMobile)
      }
    })
  },
  data(){
    return{
      headerInfo:{imgSrc:'/static/images/loading.gif',title:'归档',description:''},
      noteNum:0,
      articles:[],
      year_ord:[],
      arch_data:{},
      expand_flag:true,
    }
  },
  computed:{
    ...mapState(['isMobile'])
  },
  methods:{
    unfoldMon(y,m){
      let ul = document.getElementById(y+'-'+m);
      if (ul.style.height === '0px')
        ul.style.height = this.arch_data[y][m].articles.length * 26 + 'px';
      else
        ul.style.height = '0px';

    },
    unfoldAll(){
      let es = document.getElementsByClassName('days-list');
      if(this.expand_flag)
        Array.from(es).forEach(e=>e.style.height='0px');
      else
        Array.from(es).forEach(e=>{
          let ym = e.getAttribute('id').split('-');
          let y = ym[0];
          let m = ym[1];
          e.style.height = this.arch_data[y][m].articles.length * 26 + 'px';
        });
      this.expand_flag = !this.expand_flag
    }
  }
}
</script>

<style>
</style>
