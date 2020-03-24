<template>
  <div>
    <div class="space-wrap">
      <div class="space-h-wrap">
        <div class="h-inner">
          <div class="h-user">
            <div class="h-info">
              <div class="h-avatar"><img :src="avatar"></div>
              <div class="h-basic">
                <p>
                  <span class="h-name">{{name}}</span>
                  <span class="h-status" title="点击改变状态" @click="statusChange" :style="{background:statusMap[status].color}"><i class="iconfont" :class="statusMap[status].icon"></i>{{statusMap[status].des}}</span>
                </p>
                <div class="h-sign">
                  <input type="text" @change="signChange" placeholder="这个人很懒，什么都没写" v-model="signature">
                </div>
              </div>
            </div>
          </div>
          <div class="h-change">

          </div>
        </div>
      </div>
      <div class="space-n-wrap">
        <div class="n-inner">
          <div class="n-tab-link">
            <nuxt-link to="/space" class="n-btn"><span class="iconfont icon-home"></span><span class="n-title">首页</span></nuxt-link>
            <nuxt-link to="/space/dynamic" class="n-btn"><span class="iconfont icon-dongtai"></span><span class="n-title">动态</span></nuxt-link>
            <nuxt-link to="/space/content" class="n-btn"><span class="iconfont icon-launch"></span><span class="n-title">内容</span></nuxt-link>
            <nuxt-link to="/space/album" class="n-btn"><span class="iconfont icon-album"></span><span class="n-title">相册</span></nuxt-link>
            <nuxt-link to="/space/setting" class="n-btn"><span class="iconfont icon-gear"></span><span class="n-title">设置</span></nuxt-link>
          </div>
          <div class="n-statistics">

          </div>
        </div>
      </div>
      <div class="space-c-wrap">
        <nuxt-child/>
        <div class="space-home" v-if="$route.name==='space'">
          <div class="col-1">
            <div class="section">
              <h3 class="section-title">网站公告</h3>
              <div class="section-content">

              </div>
            </div>
            <div class="section">
              <h3 class="section-title">站点访问</h3>
              <div class="section-content">
              </div>
            </div>
          </div>
          <div class="col-2">
            <div class="section memo">
              <h4 class="section-title">便签</h4>
              <textarea v-model="memo" @change="memoChange" placeholder="编辑我的备忘录"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import UCONF from '../config/user.conf';
const {siteTitle:{title},statusMap} = UCONF;
export default {
  name: "space",
  middleware:'preauth',
  head(){
    return{
      title:`${title} 的空间`
    }
  },
  asyncData({app,req}){
    return app.$fetch('/apis/auth/v0api.php',{},req).then(res=>{
      let {sign:signature,status,memo} = res.data.data.info;
      return{signature,status,memo}
    })
  },
  data(){
    return{
      signature:'编辑个性签名',
      status:0,
      statusMap:statusMap,
      memo:''
    }
  },
  computed:{
    ...mapState({
      avatar:state=>state.account.avatar,
      name:state=>state.account.name,
      isMobile:'isMobile'
    })
  },
  mounted(){
    this.isMobile && (window.confirm('个人空间移动端未适配，仍进入?') || this.$router.go(-1));
  },
  methods:{
    signChange(){
      this.$post('/apis/auth/v0api.php',{sign:this.signature}).then(response=>{
        if (response.data.code < 1)
          this.$store.dispatch('infoBox/callInfoBox',{
            info:'个人签名更新成功',
            ok:true,
            during:2000
          });
      }).catch(err=>console.warn(err))
    },
    statusChange(){
      let nextStatus = (this.status+1)%this.statusMap.length;
      this.$post('/apis/auth/v0api.php',{status:nextStatus}).then(response=>{
        if (response.data.code < 1)
          this.status=nextStatus;
      }).catch(err=>console.warn(err))
    },
    memoChange(){
      this.$post('/apis/auth/v0api.php',{memo:this.memo}).then(response=>{
        if (response.data.code<1)
          this.$store.dispatch('infoBox/callInfoBox',{
            info:'备忘录更新成功',
            ok:true,
            during:2000
          });
      }).catch(err=>console.warn(err))
    }
  }
}
</script>

<style>
</style>
