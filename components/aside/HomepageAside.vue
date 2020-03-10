<template>
  <div class="content-aside-h fc">
    <div class="cah hit tl">
      <div class="hit-head"><span><i class="iconfont icon-fire"></i> 最热</span></div>
      <div class="loading-content h-1" v-if="loading"></div>
      <ul class="hit-content" v-else>
        <li :data-text="index+1" v-for="(item,index) in hits" :key="item.aid">
          <div class="rc-item">
            <p class="ellipsis"><nuxt-link :title="item.title" :to="item|artUrl">{{item.title}}</nuxt-link></p>
            <span>{{item.type|typeEN2CN}} | {{item.readCount|readNum}} 阅读</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="cah update tl">
      <div class="update-head"><span><i class="iconfont icon-file"></i> 最近更新</span></div>
      <div class="loading-content h-p5" v-if="loading"></div>
      <ul class="update-content" v-else>
        <li v-for="item in latestUpdate" :key="item.aid">
          <nuxt-link :to="item|artUrl" :title="item|updateTitle">{{item.title}}</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="cah board">
      <div class="board-head">
        <span>雑談　</span><i class="iconfont icon-story clearm ibold"></i>
      </div>
      <div class="board-content"
           :class="{pointer:dynamic.id}"
           @click="openDyn(dynamic.id)"
           v-html="dynamic.content"></div>
      <div class="board-post-time">{{dynamic.time|dynTime}}</div>
    </div>
  </div>
</template>

<script>
import Mixin_PanelH from "../../reuse/mixins/Mixin-PanelH";
import Mixin_ContentAside from "../../reuse/mixins/Mixin-ContentAside";
export default {
  name: "HomepageAside",
  filters:{
    artUrl(art){
      return '/archive/'+art.type+'/'+art.aid
    },
    updateTitle({title,lut}){
      let gap = new Date().getTime() -  new Date(lut).getTime();
      if (gap<60000)return `刚刚 | ${title}`;
      else{
        let gap_m = Math.floor(gap/60000);
        if (gap_m<60)return `${gap_m}分钟前 | ${title}`;
        else{
          let gap_h = Math.floor(gap_m/60);
          if (gap_h<24)return `${gap_h}小时前 | ${title}`;
          else{
            let gap_d = Math.floor(gap_h/24);
            if (gap_d<30)return `${gap_d}日前 | ${title}`;
            else{
              let gap_mon = Math.floor(gap_d/30);
              if (gap_mon<12)return `${gap_mon}月前 | ${title}`;
              else return `很久以前 | ${title}`;
            }
          }
        }
      }
    }
  },
  mixins:[Mixin_PanelH,Mixin_ContentAside],
  data(){
    return{
      loading:true,
      hits:[],
      latestUpdate:[],
    }
  },
  beforeMount(){
    this.$fetch('/apis/apiv9p1.php').then(res=>{
      let data = res.data.data;
      this.loading = false;
      data.hits.forEach(e=>this.hits.push(e));
      data.latestUpdate.forEach(e=>this.latestUpdate.push(e));
      if (data.dynamic)
        this.dynamic = data.dynamic;
      this.dynamic.content = this.markIt(this.dynamic.content);
    })
  }
}
</script>

<style>
</style>
