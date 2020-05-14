<template>
  <div class="tag-result-wrap">
    <div class="tag-query-result tl" v-if="!tag404">
      <h2 v-show="!$route.params.tag">Random</h2>
      <ul>
        <li v-for="item in curList" :key="item.id+item.type">
          <span class="item-type">{{item.type_cn}}</span>
          <span class="item-name">
								<nuxt-link :to="item.type|toUrl(item.id)" class="item-link">{{item.title}}</nuxt-link>
                <span v-if="!isMobile">
                  <span class="item-tag" v-for="tag in item.tags" :key="tag">
                    <a href="javascript:void(0);" @click="tagClick(tag)">{{tag}}</a>
                  </span>
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
</template>

<script>
import {mapState} from 'vuex';
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "tags-_tag",
  head(){
    return{
      title:`${this.tagTitle} | ${title}`
    }
  },
  props:{
    tag404:{
      type:Boolean,
      default:false
    },
    tagWaiting:{
      type:Boolean,
      default:true
    },
    resultLen:{
      type:Number,
      default:0
    }
  },
  filters:{
    toUrl(type,id){
      return type==='note'?`/note/${id}`:`/archive/${type}/${id}`;
    }
  },
  asyncData({app,params,req}){
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
    return app.$fetch('/apis/apiv5p1.php',params,req).then(res=>{
      let {results=[],rand=[]} = res.data.data;
      EN2CN(results);EN2CN(rand);
      return{
        tagTitle:!!params.tag?`标签: ${params.tag}`:'标签集',
        tag404_:!!params.tag && res.data.exist<1,
        tagWaiting_:false,
        curList:results.concat(rand)
      }
    })
  },
  data(){
    return{
      tagTitle:'标签集',
      tag404_:false,
      tagWaiting_:true,
      curList:[]
    }
  },
  computed:{
    ...mapState(['isMobile'])
  },
  watch:{
    curList(cur){
      this.$emit('update:tag404',this.tag404_);
      this.$emit('update:tagWaiting',this.tagWaiting_);
      this.$emit('update:resultLen',cur.length);
    }
  },
  beforeMount(){
    this.$emit('update:tag404',this.tag404_);
    this.$emit('update:tagWaiting',this.tagWaiting_);
    this.$emit('update:resultLen',this.curList.length);
  },
  methods:{
    tagClick(tag){
      if(!this.tagWaiting && tag!==this.$route.params.tag){
        this.tagWaiting_ = true;
        this.$emit('update:tagWaiting',this.tagWaiting_);
        this.$router.push('/tags/'+tag)
      }
    }
  }
}
</script>

<style>
</style>
