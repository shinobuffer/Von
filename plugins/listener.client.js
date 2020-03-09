import {debounce} from "../utils/lib";
export default ({store})=>{
  window.onscroll = debounce(()=>store.commit('scrollTopC',window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop),50);
  window.onresize = debounce(()=>store.commit('screenSizeC',{
    screenHeight:window.innerHeight || document.documentElement.clientHeight,
    screenWidth:window.innerWidth || document.body.clientWidth
  }),50);
}
