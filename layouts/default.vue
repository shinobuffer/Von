<template>
  <div :id="isMobile?'mobile-app':'app'"
       :class="{DDF:darken,serif:fontFamily,'bg-no-rep':!(darken+themeType)}"
       :style="{backgroundImage:appBg_,minHeight:`${screenHeight}px`}"
       @click="setPanelShow=false">
    <the-site-navigator/>
    <nuxt class="site-wrapper"/>
    <the-site-footer/>
    <luminous-box/>
    <!--infoBox-->
    <popup-info-box/>
    <!--回到顶部-->
    <a class="back2top" target="_self"
       v-if="!isMobile"
       :class="{visible:scrollTop>500&&!/^(takenote|write)/.test($route.name)}"
       @click="back2top">
      <img :src="back2topImg" height="150" alt="back2top">
    </a>
    <button class="mobile-back2top"
            v-else
            :class="{visible:scrollTop>500&&!/^(takenote|write)/.test($route.name)}"
            @click="back2top"><i class="iconfont icon-chevron-up clearm"></i></button>
    <!--控制按钮-->
    <aside class="ctrl-panel" :class="{visible:setPanelShow||scrollTop>100}" @click.stop="setPanelShow=!setPanelShow">
      <span>SETTING | <i class="iconfont icon-gear clearm"></i></span>
    </aside>
    <!--设置面板-->
    <transition name="miniFadeUD">
      <aside class="setting-panel" v-show="setPanelShow" @click.stop>
        <section>
          <div class="toggle-mode" id="toggle-mode"><button @click="darkModeC"><i class="iconfont clearm" :class="darken?'icon-moono':'icon-suno'"></i></button></div>
          <div class="theme-switch">
            <ul class="theme-list">
              <li v-for="(item,key) in themeList" :key="key" :class="{'theme-on':key===themeType}" :title="item.des" @click="themeTypeC(key)"><i :class="item.class"></i></li>
            </ul>
            <div class="font-family-setting"><button @click="fontFamilyC(0)" :class="{selected:!fontFamily}">Sans</button><button @click="fontFamilyC(1)" :class="{selected:fontFamily}">Serif</button></div>
          </div>
        </section>
        <section class="links">
          <nuxt-link to="/login" title="Sign In" v-if="!loginStatus">ᛁ</nuxt-link>
          <a href="javascript:void(0);" @click="signOut" title="Sign Out" v-if="loginStatus">ᛟ</a>
          <a target="_blank" href="https://github.com/Bersder" title="Github"><i class="iconfont icon-github"></i></a>
          <a target="_blank" href="https://space.bilibili.com/13351138" title="Bilibili"><i class="iconfont icon-bilibili"></i></a>
          <a target="_blank" href="https://music.163.com/user/home?id=93044810" title="网易云"><i class="iconfont icon-neteaseMusic"></i></a>
          <a target="_blank" href="https://twitter.com/Bersder1" title="Twitter"><i class="iconfont icon-twitter"></i></a>
        </section>
      </aside>
    </transition>
    <!--ddf-popup-->
    <transition name="ddf-popup">
      <div class="ddf-suggest" v-if="ddfShow">
        <button @click="darkModeC">进入</button>
        <span>黑暗模式</span>
        <button @click="ddfShow=false">不了</button>
      </div>
    </transition>
    <!--Aplayer-->
    <div id="aplayer"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import TheSiteNavigator from '../components/TheSiteNavigator';
import TheSiteFooter from '../components/TheSiteFooter';
import LuminousBox from '../components/LuminousBox';
import PopupInfoBox from '../components/PopupInfoBox';
import {randInt} from "../utils/lib";
import {getCookie, delCookie} from '../utils/storageManager';
export default {
  components: {
    TheSiteFooter,
    TheSiteNavigator,
    LuminousBox,
    PopupInfoBox
  },
  data(){
    return{
      st:0,
      ap:null,
      setPanelShow:false,
      fontFamily:0,
      darken:0,
      blocking:0,//用于防止频繁转换

      themeList:[
        {class:'iconfont icon-Pixiv',des:'Follow'},
        {class:'iconfont icon-screen',des:'Pure'},
        {class:'iconfont icon-texture',des:'Paper'},
        {class:'iconfont icon-star',des:'kira'}
      ],
      themeType:1,
      back2topImg:`/static/images/b2t/back2top${randInt(1,7)}.png`,
      ddfShow:false
    }
  },
  computed:{
    ...mapState(['isMobile','isMasked','scrollTop','screenHeight','appBg']),
    ...mapState('account',['loginStatus','expire']),
    appBg_(){
      if (!this.darken){
        switch (this.themeType) {
          case 0:
            return 'url('+'/root'+this.appBg+')';
          case 1:
            return '';
          case 2:
            return 'url(/root/site/bg/themebg2.png)';
          case 3:
            return 'url(/root/site/bg/themebg3.png)';
          default:
            return '';
        }
      }
      else
        return '';
    }
  },
  watch:{
    $route(){
      this.setPanelShow = false;//页面发生变化强制关闭控制面板
    },
    isMasked(cur){
      //弹窗屏蔽底层滑动
      if (cur){
        this.st = this.scrollTop;
        document.body.classList.add('masked');
        document.body.style.top = -this.st+'px';
      }
      else{
        document.body.classList.remove('masked');
        document.body.style.top = ''
        document.scrollingElement.scrollTop = this.st;
      }
    },
    loginStatus(cur){
      if (!cur&&/^space/.test(this.$route.name)){//当在个人空间进行注销时，退出个人空间返回主页
        this.$router.push('/');
      }
    },
    scrollTop(cur){
      if (cur<=150&&this.$route.name==='index')//首页靠近顶部时强制关闭控制面板
        this.setPanelShow = false;
    }
  },
  beforeMount(){
    if (this.expire){
      delCookie('utk');
      this.$store.commit('account/expire',false);
      this.$store.dispatch('infoBox/callInfoBox',{info:'登录过期，请重登', ok:false, during:3000});
    }
    //获取ddf设置
    let DDF = getCookie('darken');
    this.darken = DDF?parseInt(DDF):0;

    //尝试获取历史设置记录
    let FF = window.localStorage.getItem('CUR_FONT');
    this.fontFamily = FF?parseInt(FF):0;
    let TT = window.localStorage.getItem('CUR_THEME');
    this.themeType = TT?parseInt(TT):1;
  },
  mounted(){
    !this.isMobile && this.musicInit();
    let h = new Date().getHours();
    if (!this.darken&&(h < 6 || h > 20)){
      this.ddfShow = true;
      setTimeout(()=>this.ddfShow=false,10000)
    }
    this.darken && document.body.classList.add('deep');
  },
  methods:{
    async musicInit(){
      let musicRes= await this.$fetch('/music/music.json');
      this.ap = new (require('aplayer'))({
        container:document.getElementById('aplayer'),
        fixed:true,
        order:'random',
        preload:'none',
        volume:.2,
        lrcType:3,
        audio:musicRes.data,
        listMaxHeight:'3rem',
        storageName:'ap-setting'
      });
      this.ap.on('play',()=>this.ap.lrc.show());
      this.ap.lrc.hide();
    },
    back2top(){
      window.scrollTo(0,0)
    },
    fontFamilyC(type){
      if (type !== this.fontFamily) {
        this.fontFamily = type;
        window.localStorage.setItem('CUR_FONT',type.toString())
      }
    },
    darkModeC(){
      if (!this.blocking){//用于防止频繁转换
        this.ddfShow = false;
        this.blocking ^= 1;
        document.getElementById('toggle-mode').classList.add('switching');
        setTimeout(()=>{
          this.darken ^= 1;
          document.cookie = "darken="+this.darken+";path=/";
          this.darken?document.body.classList.add('deep'):document.body.classList.remove('deep');
        },600);
        setTimeout(()=>{
          document.getElementById('toggle-mode').classList.remove('switching');
          this.blocking ^= 1;
        },1200);
      }
    },
    themeTypeC(type){
      if (type !== this.themeType) {
        this.themeType = type;
        window.localStorage.setItem('CUR_THEME',type.toString());
      }
    },
    signOut(){
      this.setPanelShow = false;
      this.$store.commit('account/logout');
      this.$store.dispatch('infoBox/callInfoBox',{info:'注销成功', ok:true, during:3000});
    }
  }
}
</script>

<style>
</style>
