export function setCookie(key,value,expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays*86400000);
  document.cookie = key + '=' + escape(value) + ';expires=' + date.toUTCString() + ';path=/'
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

export function delCookie(key) {
  setCookie(key,'',-1)
}

export function setLocalStorage(data){
  for (let {key,val} of data.entries())
    localStorage.setItem(key,val)
}

export function delLocalStorage(keys) {
  keys = typeof keys === "string"?[keys]:keys;
  for (let key of keys)
    localStorage.removeItem(key)
}