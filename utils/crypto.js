import CryptoJS from 'crypto-js';
export function aesEncrypt(data) {
  let key = CryptoJS.enc.Utf8.parse("DEEPDARKFANTASY1");
  //let iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');
  let ts = new Date().getTime().toString();
  let tsmd5 = CryptoJS.MD5(ts).toString().substr(0,16);
  let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    iv: CryptoJS.enc.Utf8.parse(tsmd5),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {encData:encrypted.toString(),param:btoa(tsmd5)};
}


