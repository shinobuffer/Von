import {getCookieFromStr,delCookie} from "../utils/storageManager";
export const state = ()=>({
  platform:'',
  isMobile:false,
  scrollTop:process.client?(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop):0,
  screenHeight:process.client?(window.innerHeight || document.documentElement.clientHeight):902,
  screenWidth:process.client?(window.innerWidth || document.body.clientWidth):1920,
  upping:false,
  isMasked:false,
  appBg:'',
  htInfo:null,
});

export const mutations = {
  platformInit(state,payload){
    state.platform = payload.platform;
    state.isMobile = payload.isMobile;
  },
  scrollTopC(state,cur){
    if (Math.abs(state.scrollTop - cur)>50)
      state.upping = (state.scrollTop > cur);
    state.scrollTop = cur
  },
  screenSizeC(state,payload){
    state.screenHeight = payload.screenHeight;
    state.screenWidth = payload.screenWidth;
  },
  isMaskedC(state,cur){
    state.isMasked = cur;
  },
  appBgC(state,bg){
    state.appBg = bg;
  },
  htInfoC(state,payload){
    state.htInfo = payload;
  }
};

export const actions = {
  nuxtServerInit({commit},{app,req}){
    // 接受到页面请求，首先尝试自动登录填充登录信息供鉴权
    let token = req.headers.cookie && getCookieFromStr('utk',req.headers.cookie);
    if (token)
      return app.$relayFetch('/apis/auth/aLogin.php',{},req.headers).then(res=>{
        switch (res.data.code) {
          case 0:
            commit('account/alogin',{
              token:token,
              ...res.data.data
            });
            break;
          case 1:
            if (process.client)
              delCookie('utk')
        }
      })
  }
};

export const getters = {
  xAboveBottom(state){
    return process.client?document.documentElement.scrollHeight - state.scrollTop - state.screenHeight:233
  }
};
