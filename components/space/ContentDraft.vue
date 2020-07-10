<template>
  <div>
    <h2 class="draft-head">{{this.type==='note'?'笔记':'文章'}}草稿<a href="javascript:" class="draft-add-btn" @click="newDraft">+</a></h2>
    <div class="draft-content" :class="{empty:!draftExist}" data-empty-text="什么草稿都没有，好干净！">
      <waiting v-if="draftWaiting"/>
      <transition-group tag="div" name="flip" class="draft-list" v-else>
        <div class="draft-list-item" v-for="each in drafts" :key="each.id">
          <p class="row1">
            <span class="draft-type">{{each.type|typeEN2CN}}</span><nuxt-link :to="each|draftUrl">{{each.title||'标题未定'}}</nuxt-link>
            <span class="draft-id pr no-select">id-{{each.id}}</span>
          </p>
          <p class="row2">
            <span class="draft-update">上次更新:{{each.lut|updateTime}}</span> ·
            <nuxt-link class="draft-edit" :to="each|draftUrl">编辑</nuxt-link>
            <a href="javascript:" @click="dropDraft(each)" class="draft-trash pr">!!舍弃!!</a>
          </p>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentDraft",
  props:{
    type:{
      type:String,
      required:true
    }
  },
  filters:{
    typeEN2CN(type){
      switch (type) {
        case 'anime':return 'Anime';
        case 'code':return '极客';
        case 'game':return '游民';
        case 'trivial':return '随写';
        case 'note':return '笔记';
        default:return '未知'
      }
    },
    draftUrl(draft){
      if (draft.type==='note')return '/takenote?nid='+draft.id;
      else return '/write?aid='+draft.id;
    },
    updateTime(datetime){
      let gap = new Date().getTime() -  new Date(datetime).getTime();
      if (gap<60000)return '刚刚';
      else{
        let gap_m = Math.floor(gap/60000);
        if (gap_m<60)return gap_m + '分钟前';
        else{
          let gap_h = Math.floor(gap_m/60);
          if (gap_h<24)return gap_h + '小时前';
          else{
            let gap_d = Math.floor(gap_h/24);
            if (gap_d<30)return gap_d + '日前';
            else return datetime.substr(0,10);
          }
        }
      }
    }
  },
  beforeMount(){
    this.$post('/apis/auth/v1api.php',{type:this.type}).then(response=>{
      if (response.data.code < 1){
        let data = response.data.data;
        this.draftWaiting = false;
        data.drafts.forEach(e=>this.drafts.push(e));
        this.draftExist = !!this.drafts.length;
      }
    }).catch(err=>console.warn(err))
  },
  data(){
    return {
      drafts:[],
      draftWaiting:true,
      draftExist:true
    }
  },
  watch:{
    type(cur){
      this.draftExist = this.draftWaiting = true;
      while(this.drafts.pop()){}
      this.$post('/apis/auth/v1api.php',{type:cur}).then(response=>{
        if (response.data.code<1){
          let data = response.data.data;
          this.draftWaiting = false;
          data.drafts.forEach(e=>{this.drafts.push(e)});
          this.draftExist = Boolean(this.drafts.length);
        }
      }).catch(err=>console.warn(err))
    }
  },
  methods:{
    newDraft(){
      let t = this.type==='note'?'/takenote':'/write';
      this.$router.push(t)
    },
    dropDraft(draft){
      if(window.confirm('确认舍弃该草稿？'))
        this.$post('/apis/auth/v2api.php',{type:this.type,id:draft.id}).then(response=>{
          if (response.data.code < 1){
            this.drafts.splice(this.drafts.indexOf(draft),1);
            this.draftExist = Boolean(this.drafts.length);
          }
        }).catch(err=>console.warn(err))
    }
  }
}
</script>

<style>
</style>
