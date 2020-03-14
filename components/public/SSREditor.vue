<template>
  <div class="markdown-body">
    <div style="overflow: hidden" v-html="content"></div>
  </div>
</template>

<script>
import marked from 'marked';
export default {
  name: "SSREditor",
  props:{
    rawContent:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      content:''
    }
  },
  created(){
    this.content = marked(this.rawContent,{
      renderer:new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true, //不开启时，单个换行只会p内\n换行（表现为空格）、多个换行会生成两个p;开启时单个换行会导致p内br换行，多个换行会导致两个p间br换行
      pedantic: false,
      sanitize: true,//开启时忽略rawString中的html标签
      smartLists: true,
      smartypants: false,
      silent:true
    })
  }
}
</script>

<style>
</style>
