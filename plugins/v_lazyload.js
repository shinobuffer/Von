import {throttle} from "../utils/lib";
export default (Vue,options={})=>{
  let init = {
    preloadClass:'lazyload-preload',
    loadErrorClass:'lazyload-status-fail',
    default:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
    error:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAA////////mJiYU1NT9/f3urq6////U1NTU1NTU1NTrFF76QAAAAt0Uk5TAJn//////2aZXGYhZNSUAAAAmklEQVR4nK2QwQ3CMAxFTaRIwIkyQeX6wLlhAtewAXswA6eMwajYSSFuj6hfihS/fDs/AdhQncnVuyGlNDoQriIynRwQUtJ7IH8ARpzBQxc6Q7wBnPWOn0FBGPT8W0PUs8XIKGyhhBqowjVoIUqD3J+rlOzeXizoP8MMbcQ+v0iIL7lo7uHgR0CmfgnMYTEOtTq+ATHUnLrfQB/OCCYp7ourYgAAAABJRU5ErkJggg==`,
    ...options
  };
  let listenList = [];
  let imgCacheList = [];

  const isAlreadyLoad = (imgSrc)=>{
    return imgCacheList.indexOf(imgSrc) > -1;
  };

  const tryLoad = (item)=>{
    let {el,src} = item;
    let top  = el.getBoundingClientRect().top;
    let screenHeight = window.innerHeight || document.documentElement.clientHeight;
    if (top < screenHeight + 50 && top > -50){
      let img = new Image();
      img.onload = ()=>{
        el.src = src;
        el.classList.remove(init.preloadClass);
        imgCacheList.pushIfNew(src);
        listenList.remove(item);
      };

      img.onerror = ()=>{
        if (item.errorHandle){
          el.src = init.error;
          el.style.objectFit = 'none';
        }
        el.classList.remove(init.preloadClass);
        el.classList.add(init.loadErrorClass);
        listenList.remove(item);
      };
      img.src = src;
      return true;
    }else{
      return false;
    }
  };

  let listenStatus = false;
  const listenScroll = ()=>{
    if (!listenStatus){
      // console.log('lazyload Start');
      window.addEventListener('scroll',throttle(()=>{
        let len = listenList.length;
        // console.log(len,listenList,imgCacheList);
        for (let i = 0; i < len; i++){
          tryLoad(listenList[i])
        }
      },200));
      listenStatus = true;
    }
  };

  Vue.directive('lazyload',{
    //还差不换皮的更新(不变el变bind)的状况
    inserted:(el,{value,modifiers})=>{
      let imgSrc,placeholder;
      if (typeof value==='string'){
        imgSrc = value;
        placeholder = init.default;
      }else{
        imgSrc = value[0];
        placeholder = value[1]||init.default;
      }
      if (isAlreadyLoad(imgSrc)){
        el.src = imgSrc;
        return false;
      }
      let item = {
        el:el,
        src:imgSrc,
        errorHandle:!!modifiers.rude
      };
      el.src = placeholder;
      el.classList.add(init.preloadClass);
      if (tryLoad(item)){
        return;
      }
      listenList.pushIfNew(item);
      !listenStatus && listenScroll();
    },
    unbind:(el)=>{
      for(let item of listenList)
        if (item.el===el){
          listenList.remove(item);
          //console.log('remove')
        }
    }
  })
}
