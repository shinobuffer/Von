export const state = ()=>({
  platform:'',
  isMobile:false,
  scrollTop:process.browser?(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop):0,
  screenHeight:process.browser?(window.innerHeight || document.documentElement.clientHeight):902,
  screenWidth:process.browser?(window.innerWidth || document.body.clientWidth):1920,
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

export const getters = {
  xAboveBottom(state){
    return document.documentElement.scrollHeight - state.scrollTop - state.screenHeight
  }
};
