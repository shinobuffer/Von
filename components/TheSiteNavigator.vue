<template>
  <div class="site-header" :class="navClass">
<!--    <div class="header-scrollbar" :style="{width:processed}"></div>-->
    <div class="header-nav-m" v-show="screenWidth<1000">
      <div class="nav-content">
        <div class="nav-icon" :class="{open:isOpened}" @click="isOpened=!isOpened">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nuxt-link class="nav-title" to="/">Oshino·Nya</nuxt-link>
        <!--				<div class="nav-login pr"><router-link to="/"><i class="far fa-user-circle"></i></router-link></div>-->
      </div>
      <div class="nav-m-mask" @click="isOpened=!isOpened" v-show="isOpened" :style="{height:screenHeight-50+'px'}"></div>
      <div class="nav-aside" :class="{open:isOpened}" :style="{height:screenHeight-50+'px'}">
        <div class="nav-avatar">
          <nuxt-link :to="loginStatus?'/space':'/about'"><img :src="meAvatar" alt="my avatar"></nuxt-link>
          <span class="me-status" :title="statusMap[meStatus].des" :style="{background:statusMap[meStatus].color}">
            <i class="iconfont" :class="statusMap[meStatus].icon"></i>
          </span>
        </div>
        <p class="me-name">{{meName}}</p>
        <p class="me-sign">{{meSign}}</p>
        <p class="cut-line"></p>

        <div class="search-box-m">
          <input v-model.trim="searchKey" type="search" class="text-input pl" @keyup.enter="post_Search" placeholder="要搜些什么">
          <button @click="post_Search"><i class="iconfont icon-search clearm"></i></button>
        </div>
        <div class="nav-menu">
          <p>站内导航</p>
          <ul>
            <li><nuxt-link to="/" class="animated"><i class="iconfont icon-home fade-bf"></i> 首页</nuxt-link></li>
            <li v-for="each in navData" :key="each.key">
              <nuxt-link :to="each.href" class="animated"><i :class="[each.icon,each.animate]"></i> {{each.des}}</nuxt-link>
              <span @click="each.isUnfolded=each.subs?!each.isUnfolded:each.isUnfolded">
                <i v-if="each.subs" class="iconfont icon-chevronright clearm" :class="{unfold:each.isUnfolded}" style="color: grey"></i>
              </span>
              <ul v-if="each.subs" :class="{'is-collapsible':each.subs,'is-collapsed':!each.isUnfolded}">
                <li v-for="sub in each.subs" :key="sub.key">
                  <nuxt-link :to="sub.href"><i :class="sub.icon"></i> {{sub.des}}</nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <p class="nav-footer">© 2020 忍野ニャニャ</p>
      </div>
    </div>

    <div class="header-nav no-select" v-show="screenWidth>=1000">
      <div class="site-brand pl">
        <nuxt-link :to="loginStatus?'/space':'/'">
          <span class="oshino"><ruby>忍野<rp>(</rp><rt>おしの</rt><rp>)</rp></ruby></span>
          <span class="nyanya">ニャ</span>
        </nuxt-link>
      </div>
      <div class="snh">
        <div class="site-nav">
          <ul class="menu">
            <li v-for="each in navData" :key="each.key">
              <nuxt-link :to="each.href" class="animated"><i :class="[each.icon,each.animate]"></i> {{each.des}}</nuxt-link>
              <ul v-show="each.subs" class="sub-menu">
                <li v-for="sub in each.subs" :key="sub.key">
                  <nuxt-link :to="sub.href"><i :class="sub.icon"></i>{{sub.des}}</nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="search-box-t pr">
        <input type="search" v-model.trim="searchKey" @keyup.enter="post_Search">
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import UCONF from "../config/user.conf";
import PCONF from "../config/project.conf";
export default {
  name: "TheSiteNavigator",
  data(){
    return{
      navData:PCONF.navList,

      isOpened:false,
      searchKey:'',
      meName:'???',
      meAvatar:'/static/images/passerby.png',
      meSign:'这个人懒成了鸽子',
      meStatus:0,
      statusMap:UCONF.statusMap
    }
  },
  computed:{
    need2hide(){
      if (/(about|archive-type-id|note-id)/.test(this.$route.name))
        return this.screenWidth <= 900;
      else
        return !/^(space|search|bangumi|dynamic|series)/.test(this.$route.name)
    },
    navClass(){
      return{
        home:this.$route.name==='index' && this.scrollTop<200 && !this.isOpened && this.screenWidth>=1000,
        reachTop:this.scrollTop<200 && this.need2hide && !this.isMasked,
        pinned:this.upping||this.scrollTop<200
      }
    },
    // processed(){
    //   return process.client?this.scrollTop/(document.body.offsetHeight-document.documentElement.clientHeight)*100 + '%':'0';
    // },
    ...mapState(['scrollTop','screenWidth','screenHeight','upping','isMasked']),
    ...mapState({
      loginStatus:state=>state.account.loginStatus,
    })
  },
  created(){
    this.$fetch('/apis/apiv0.php').then(res=>{
      let {name,avatar,sign,status} = res.data.data.info;
      this.meName = name;
      this.meAvatar = avatar;
      this.meSign = sign;
      this.meStatus = status
    })
  },
  watch:{
    isOpened(cur){
      this.$store.commit('isMaskedC',cur)
    },
    screenWidth(cur){
      if (cur > 1000 && this.isOpened) this.isOpened = false;
    },
    $route(){
      this.isOpened = false;
    }
  },
  methods:{
    post_Search(){
      if (this.searchKey){
        this.$router.push({name:'search-key',params:{key:this.searchKey}});
        this.searchKey = '';
        this.isOpened = false;
      }
    }
  }
}
</script>

<style>
</style>
