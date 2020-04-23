<template>
  <div>
    <div class="page-header-wrap">
      <div class="pattern-full-width page-header">
        <div class="page-img" style="background-image: url('/root/site/header/tag.jpg')"></div>
        <div class="page-info fc">
          <h2 class="intro tag">{{tag404|queryTitle($route.params.tag)}}</h2>
          <p class="tsukkomi tag">{{tag404|queryResult($route.params.tag,resultLen)}}</p>
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
        <nuxt-child :tag404.sync="tag404" :tagWaiting.sync="tagWaiting" :resultLen.sync="resultLen"/>
      </div>
    </div>
  </div>
</template>

<script>
//<nuxt-child :tag404.sync="tag404" :tagWaiting.sync="tagWaiting" :resultLen.sync="resultLen"/>
import Mixin_TagCloud from "../reuse/mixins/Mixin-TagCloud";
export default {
  name: "tags",
  mixins:[Mixin_TagCloud],
  filters:{
    toUrl(type,id){
      return type==='note'?`/note/${id}`:`/archive/${type}/${id}`;
    },
    queryTitle(flag,tag){
      if(tag) return flag?'标签不存在':`包含标签「${tag}」的条目`;
      else return '标签集'
    },
    queryResult(flag,tag,num){
      if (tag) return flag?'啥都没找到':`找到 ${num} 项`;
      else return '';
    }
  },
  asyncData({app,store,req}){
    let isMobile = store.state.isMobile;
    return app.$fetch('/apis/apiv5.php',{},req).then(res=>{
      let {tagCountList} = res.data.data;
      return{
        tagCountList,
        manyTags:(!isMobile && tagCountList.length>30)||(tagCountList.length>12 && isMobile)
      }
    })
  },
  data(){
    return {
      tag404:false,
      tagWaiting:true,
      resultLen:0
    }
  },
  methods:{
    tagClick(tag){
      if(!this.tagWaiting && tag!==this.$route.params.tag){
        this.tagWaiting = true;
        this.$router.push('/tags/'+tag)
      }
    }
  }
}
</script>

<style>
</style>
