<template>
  <div>
    <div class="login-wrap" :style="{height:screenHeight+'px'}">
      <div class="login">
        <h1><nuxt-link to="/">Oshino·Nya</nuxt-link></h1>
        <p>
          <label>
            Username or Email Address
            <input type="text" v-model="account" ref="account">
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" v-model="password" @keyup.enter="loginSubmit">
          </label>
        </p>
        <p class="remember" style="line-height: .2rem">
          Remember Me
          <span :class="{active:remember}" @click="remember=!remember"></span>
        </p>
        <p class="login-submit">
          <button @click="loginSubmit">Sign in</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {aesEncrypt} from '~/utils/crypto';
import Validator from '~/utils/Validator';
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name:"login",
  middleware:'notauth',
  head(){
    return{
      title:`Sign In | ${title}`
    }
  },
  data(){
    return{
      account:'',
      password:'',
      remember:false
    }
  },
  computed:{
    ...mapState(['screenHeight']),
  },
  mounted(){
    this.$refs.account.focus();
  },
  methods:{
    loginSubmit(){
      let validator = new Validator();
      validator.check(this.account,{strategy:'notEmpty',errMsg:'请填写帐号'});
      validator.check(this.password,{strategy:'notEmpty',errMsg:'请填写密码'});
      let err = validator.checkResult();
      if (err){
        window.alert(err);
        return;
      }
      let data = {
        account:this.account,
        psw:this.password,
        remember: this.remember?1:0
      };
      this.$post('/apis/auth/login.php',aesEncrypt(JSON.stringify(data))).then(response=>{
        switch (response.data.code) {
          case 0:
            let data = response.data.data;
            this.$store.commit('account/login',data);
            this.$store.dispatch('infoBox/callInfoBox',{
              info:'登录成功，返回',
              ok:true,
              during:3000
            });
            this.account = this.password = '';
            this.$router.push('/');
            break;
          case 1:
            this.$store.dispatch('infoBox/callInfoBox',{
              info:'登录失败，请检查帐号密码是否正确',
              ok:false,
              during:3000
            });
            break;
          case 2:
            this.$store.dispatch('infoBox/callInfoBox',{
              info:'失败过多，请明天再试',
              ok:false,
              during:3000
            });
            break;
          default:
            this.$store.dispatch('infoBox/callInfoBox',{
              info:'出现未知错误',
              ok:false,
              during:3000
            });
        }
      })
    },
  }
}
</script>

<style>
</style>
