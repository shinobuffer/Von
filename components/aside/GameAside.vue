<template>
  <div class="content-aside">
    <div class="ca album">
      <div class="album-img-wrap">
        <img class="album-img" @click="openLB" :src="'/root'+firstImg" :alt="firstDes">
        <p>{{firstDes}}</p>
      </div>
    </div>
    <div class="ca fexchange tl">
      <div class="fexchange-head"><i class="iconfont icon-friends"></i>好友交换</div>
      <ul class="fexchange-content">
        <li v-for="item in friendExchange">
          <span class="platform"><i :class="item.icon"></i>{{item.description}}</span>:
          <span class="code">{{item.value}}</span>
        </li>
      </ul>
    </div>
    <div class="ca board">
      <div class="board-head">
        <span>游言　</span><i class="iconfont icon-story clearm ibold"></i>
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
import Mixin_ContentAside from "~/reuse/mixins/Mixin-ContentAside";
import UCONF from "~/config/user.conf";
export default {
  name: "GameAside",
  mixins:[Mixin_ContentAside],
  data(){
    return{
      loading:true,
      friendExchange:UCONF.friendExchange,
    }
  },
  beforeMount() {
    this.$fetch('/apis/apiv8p1.php',{_:'game'}).then(res=>{
      let data = res.data.data;
      this.loading = false;
      if (data.album.length){
        this.$store.commit('lumiBox/imgsC',data.album);
        this.firstImg = data.album[0].imgSrc;
        this.firstDes = data.album[0].description;
      }
      if (data.dynamic)
        this.dynamic = data.dynamic;
      this.dynamic.content = this.markIt(this.dynamic.content);
    })
  }
}
</script>

<style>
</style>
