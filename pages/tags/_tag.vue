<template>
  <div>
    <div class="page-header-wrap">
      <div class="pattern-full-width page-header">
        <div class="page-img" style="background-image: url('/root/site/header/tag.jpg')"></div>
        <div class="page-info fc">
          <h2 class="intro tag">{{tag404|headerIntro($route.params.tag)}}</h2>
          <p class="tsukkomi tag">{{tag404|headerTsukkomi($route.params.tag,curList.length)}}</p>
        </div>
      </div>
    </div>
    <div class="page-content-wrap">
      <div class="page-content tag fc">
        <div class="tag-cloud tl">
          <h2>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{tagExpand|expandStatus}}</a></h2>
          <ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
            <li class="tag" v-for="item in tagCountList"
                :key="item.id" @click="tagClick(item.tagName)"
                :class="{cur:$route.params.tag===item.tagName}">
              <a href="javascript:void(0);" :title="item.count+' 相关'">{{item.tagName}}</a>
            </li>
          </ul>
        </div>
        <div class="tag-query-result tl" v-if="!tag404">
          <h2 v-if="!$route.params.tag">随机推荐</h2>
          <ul>
            <li v-for="item in curList" :key="item.id+item.type">
              <span class="item-type">{{item.type_cn}}</span>
              <span class="item-name">
								<nuxt-link :to="item.type|toUrl(item.id)" class="item-link">{{item.title}}</nuxt-link>
                <span class="item-tag" v-for="tag in item.tags" :key="tag">
                  <a href="javascript:void(0);" @click="tagClick(tag)">{{tag}}</a>
                </span>
							</span>
              <span class="item-date">{{item.time.substr(0,10)}}</span>
            </li>
          </ul>
        </div>
        <div class="not-find" v-else>
          <h2>糟糕！这里什么也没有</h2>
          <p><nuxt-link to="/">← 返回首页</nuxt-link> · <nuxt-link to="/archive">前往归档 →</nuxt-link></p>
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
      title:`标签 ${this.$route.params.tag||''} | ${title}`
    }
  },
  mixins:[Mixin_TagCloud],
  filters:{
    toUrl(type,id){
      return type==='note'?'/note/'+id:'/archive/'+type+'/'+id
    },
    headerIntro(flag,tag){
      if(tag) return flag?'标签不存在':'包含标签 “'+tag+'" 的条目';
      else return '标签'
    },
    headerTsukkomi(flag,tag,num){
      if (tag) return flag?'没有找到当然是NaN啦':'找到 '+num+' 个';
      else return '';
    }
  },
  asyncData({app,store,params,req}){
    let isMobile = store.state.isMobile;
    const EN2CN = list=>{
      list.forEach(e=>{
        switch (e.type) {
          case 'anime':e.type_cn = '二次元';break;
          case 'code':e.type_cn = '极客';break;
          case 'game':e.type_cn = '游民';break;
          case 'trivial':e.type_cn = '日常';break;
          case 'note':e.type_cn = '笔记';
        }
        e.tags = e.tags?e.tags.split(','):[];
      })
    };
    return app.$fetch('/apis/apiv5.php?init',params,req).then(res=>{
      let {artInfos,noteInfos,tagCountList,tagRelate={},rand=[]} = res.data.data;
      EN2CN(artInfos);
      EN2CN(noteInfos);
      let curList = [];
      if (params.tag){ //进入 tags/XX，进行文章筛选
        tagRelate.arts.split(',').forEach(e1=>{
          artInfos.forEach(e2=>{if(e1===e2.id)curList.push(e2)})
        });
        tagRelate.notes.split(',').forEach(e1=>{
          noteInfos.forEach(e2=>{if(e1===e2.id)curList.push(e2)})
        });
      }else{ //进入 tag，只用rand填充curList
        EN2CN(rand);
        curList = rand;
      }
      return{
        tag404:!!params.tag && res.data.exist<1,
        artList:artInfos,
        noteList:noteInfos,
        curList,
        tagCountList,
        manyTags:(!isMobile && tagCountList.length>30)||(tagCountList.length>12 && isMobile)
      }
    })
  },
  data(){
    return {
      tag404:false,
      artList:[],
      noteList:[],
      curList:[],
    }
  },
  computed:{
    ...mapState(['isMobile'])
  },
  methods:{
    tagClick(tag){
      if(tag!==this.$route.params.tag)
        this.$router.push('/tags/'+tag)
    }
  }
}
</script>

<style>
</style>
