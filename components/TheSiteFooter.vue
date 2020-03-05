<template>
  <footer class="site-footer">
    <div class="site-info">
      <section>
        <p>• 单身为狗 {{age}} 年</p>
        <p>• 朝循以始 夜继以终</p>
        <p>• Alive: {{day}} 天 {{hour}} 小时 {{min}} 分 {{sec}} 秒</p>
      </section>
      <section>
        <p>• <a href="https://github.com/Bersder/nameless-blog" target="_blank">Nameless {{ver}}</a></p>
        <p>• Powered By <a href="https://github.com/Bersder" target="_blank">Bersder</a></p>
        <p><a href="mailto:oshinoNya@outlook.com">• oshinoNya@outlook.com</a></p>
      </section>
      <section>
        <p>Support:</p>
        <a href="https://vuejs.org" title="Vue" target="_blank" rel="nofollow" ><img src="/static/logo/vue.png" height="20" alt="frame"></a>
        <a href="https://www.vultr.com/?ref=7572602" title="Vultr" target="_blank" rel="nofollow" ><img src="/static/logo/vultr.webp" height="20" alt="server"></a>
        <a href="https://www.cloudflare.com" title="cloudflare" target="_blank" rel="nofollow" ><img src="/static/logo/cloudflare.webp" height="20" alt="DNS"></a>
        <a href="https://github.com/MoePlayer/APlayer" title="APlayer" target="_blank" rel="nofollow" ><img src="/static/logo/aplayer.png" height="20" alt="music player"></a>
      </section>
    </div>
    <p class="site-banner">© {{`${fromY}-${toY}`}} <nuxt-link to="/login">ᛟᛊᚺᛁᚾᛟ</nuxt-link></p>
  </footer>
</template>

<script>
import UCONF from "../config/user.conf";
import PCONF from "../config/project.conf";
const {version} = PCONF;
const {sinceTime,birthday} = UCONF;
export default {
  name: "TheSiteFooter",
  data(){
    return{
      since:sinceTime,
      ver:version,
      fromY:new Date(sinceTime).getFullYear(),
      toY:new Date().getFullYear(),
      day:0,
      hour:0,
      min:0,
      sec:0,
      age:Math.floor((new Date().getTime() - new Date(birthday).getTime())/31536000000)
    }
  },
  mounted(){
    setInterval(()=>this.tick(),1000)
  },
  methods:{
    tick(){
      let dayLast = 86400000;
      let hourLast = 3600000;
      let minuteLast = 60000;
      let diff1 = new Date().getTime() - this.since;
      this.day = Math.floor(diff1/dayLast);
      let diff2 = diff1%dayLast;
      this.hour = Math.floor(diff2/hourLast);
      let diff3 = diff2%hourLast;
      this.min = Math.floor(diff3/minuteLast);
      let diff4 = diff3%minuteLast;
      this.sec = Math.floor(diff4/1000);
    }
  }
}
</script>

<style>
</style>
