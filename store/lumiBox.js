export const state = ()=>({
  imgs:[],
  descriptions:[],
  times:[],
  index:0,
  show:false
});

export const mutations = {
  imgsC(state,IDTs){
    state.imgs.length = state.descriptions.length = state.times.length = 0;
    IDTs.forEach(e=>{
      state.imgs.push(e.imgSrc);
      state.descriptions.push(e.description);
      e.time?state.times.push(e.time):state.times.push('Unknown Time');
    });
    state.index = 0;
  },
  indexC(state,index){
    state.index = index;
  },
  showC(state,cur){
    if (state.imgs.length===0&&cur){}
    else
      state.show = cur;
  }
};
