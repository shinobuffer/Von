export function setCookie(key,value,expDays=0,domain=null) {
  let expires = '';
  if(expDays){
    let date = new Date();
    date.setTime(date.getTime() + expDays*86400000);
    expires = `expires=${date.toUTCString()};`
  }
  domain = domain?`domain=${domain};`:'';
  document.cookie = `${key}=${escape(value)};${domain}${expires}path=/`;
}

export function getCookie(key) {
  if (document.cookie.length > 0){
    let start = document.cookie.indexOf(key+'=');
    if (start !== -1) {
      start = start + key.length + 1;
      let end = document.cookie.indexOf(';',start);
      if (end===-1){
        end = document.cookie.length;
        return unescape(document.cookie.substring(start,end))
      }
      else
        return unescape(document.cookie.substring(start,end))
    }
  }
  return ''
}

export function getCookieFromStr(key,str){
  if (str.length > 0) {
    let start = str.indexOf(key+'=');
    if (start !== -1) {
      start = start + key.length + 1;
      let end = str.indexOf(';',start);
      if (end===-1){
        end = str.length;
        return unescape(str.substring(start,end))
      }
      else
        return unescape(str.substring(start,end))
    }
  }
  return ''
}

export function delCookie(key,domain=null) {
  setCookie(key,'',-1,domain)
}

export function getLocalStorage(keys) {
  keys = typeof keys === "string"?[keys]:keys;
  return keys.map(key=>localStorage.getItem(key)||'')
}

export function setLocalStorage(data){
  for (let [key,val] of Object.entries(data))
    (typeof val!=='undefined') && val!=='' && localStorage.setItem(key,val.toString())
}

export function delLocalStorage(keys) {
  keys = typeof keys === "string"?[keys]:keys;
  for (let key of keys)
    localStorage.removeItem(key)
}