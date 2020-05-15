<template>
  <div class="space-home">
    <div class="col-1">
      <div class="section site-statistics">
        <h3 class="section-title">站点数据</h3>
        <div class="section-content">
          <div class="ss-table tl">
            <div class="ss-table-row">
              <div class="ss-table-cell-wrap">
                <div class="ss-table-cell">
                  <div class="name">文章阅读</div>
                  <div class="text-content">100,100</div>
                  <div class="diff">
                    <span>昨日</span>
                    <span class="num">▲10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section site-notice">
        <h3 class="section-title">站点公告</h3>
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
  filters:{
    diffNum(count){
      let ret = count.toString();
      return ret>0?ret.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,'):'--'
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
