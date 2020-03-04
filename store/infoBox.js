export const state = ()=>({
  info:'',
  infoShow:false,
  infoOK:true
});

export const mutations = {
  infoShowCF(state){
    state.infoShow = false;
  },
  infoShowC(state,payload){
    state.info = payload.info;
    state.infoOK = payload.ok;
    state.infoShow = true;
  }
};

export const actions = {
  callInfoBox({commit},payload){
    commit('infoShowC',payload);
    setTimeout(()=>commit('infoShowCF'),payload.during)
  }
};
