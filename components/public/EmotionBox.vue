<template>
  <div class="emotion" :class="emotionClass">
    <span class="emotion-toggle" @click="emoBoxShow=!emoBoxShow"><i class="iconfont icon-emoji ibold"></i>表情</span>
    <div class="emotion-box">
      <div class="emo-title"><span>{{emoData[emoIndex].emoSeries}}</span></div>
      <div class="emo-wrap" :class="{'emo-text':!emoData[emoIndex].pic}">
        <a v-for="item in emoData[emoIndex].emoList"
           :key="item.des"
           :title="item.des"
           @click="insertEmo(item,emoData[emoIndex].pic)"><img v-if="emoData[emoIndex].pic" :src="'/root'+item.imgSrc" :alt="item.des"><span v-else>{{item}}</span></a>
      </div>
      <div class="emo-tabs">
        <a v-for="(item,index) in emoData" :key="index" @click="emoIndex=index" :class="{cur:index===emoIndex}"><img :src="'/root'+item.thumbnail" :alt="item.emoSeries" height="22" width="22"></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmotionBox",
  props:{
    value: {
      type:String,
      default:''
    },
    float:{
      type:String,
      default:'left'
    },
    emoData:{
      type:Array,
      default(){
        return [{emoSeries:'',emoList:[]}]
      }
    },
    emoMap:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  data(){
    return{
      content:this.value,
      emoBoxShow:false,
      emoIndex:0,
    }
  },
  computed:{
    emotionClass(){
      return {
        pl:this.float==='left',
        pr:this.float==='right',
        'emo-open':this.emoBoxShow
      }
    }
  },
  watch:{
    value(cur){
      this.content = cur
    },
    content(cur){
      this.$emit('input',cur)
    }
  },
  methods:{
    insertEmo(item,isPic){
      this.content = isPic?this.content + item.insert:this.content + item.replace(/_/g,'\\_');
    },
  }
}
</script>

<style>
</style>
