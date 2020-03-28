<template>
  <div class="space-home">
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
</template>

<script>
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "space-index",
  head(){
    return{
      title:`${title} 的空间`
    }
  },
  props:{
    memo_:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      memo:this.memo_
    }
  },
  methods:{
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
