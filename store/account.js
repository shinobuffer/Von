import {delCookie} from "../utils/storageManager";
export const state = ()=>({
  uid:0,
  name:'???',
  avatar:'/static/images/passerby.png',
  token:'',
  loginStatus:false
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
    delCookie('utk');
    state.token = '';
    state.uid = 0;
    state.name = '???';
    state.avatar = '/static/images/passerby.png';
    state.loginStatus = false;
  }
};
