import {delCookie} from "../utils/storageManager";
import UCONF from '../config/user.conf';
const {rootDomain} = UCONF;
export const state = ()=>({
  uid:0,
  name:'???',
  avatar:'/static/images/passerby.png',
  token:'',
  loginStatus:false,
  expire:false
});

export const mutations = {
  login(state,payload){
    state.token = payload.token;
    state.uid = payload.info.uid;
    state.name = payload.info.name;
    state.avatar = payload.info.avatar;
    state.loginStatus = true;
  },
  alogin(state,payload){
    state.token = payload.token;
    state.uid = payload.info.uid;
    state.name = payload.info.name;
    state.avatar = payload.info.avatar;
    state.loginStatus = true;
  },
  logout(state){
    delCookie('utk','.'+rootDomain);
    state.token = '';
    state.uid = 0;
    state.name = '???';
    state.avatar = '/static/images/passerby.png';
    state.loginStatus = false;
  },
  expire(state,s){
    state.expire = s;
  }
};
