import CryptoJS from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("AQtShlYw3DiPDdaw");
const IV = CryptoJS.enc.Utf8.parse("xwsdECjnaroVdZAq");

/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word, keyStr, ivStr) {
  let key = KEY
  let iv = IV

  let srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  // console.log("-=-=-=-", encrypted.ciphertext)
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export function Decrypt(word, keyStr, ivStr) {
  let key = KEY
  let iv = IV

  let base64 = CryptoJS.enc.Base64.parse(word);
  let src = CryptoJS.enc.Base64.stringify(base64);

  var decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
// encrypt(word, keyStr, ivStr) {
//   const key = CryptoJS.enc.Latin1.parse(keyStr);
//   const iv = CryptoJS.enc.Latin1.parse(ivStr);
//   const encoded = CryptoJS.AES.encrypt(word, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       adding: CryptoJS.pad.ZeroPadding
//   }).toString()
//   return encoded;
// },
// decrypt2(word, keyStr, ivStr) {
//   keyStr = keyStr;
//   ivStr = ivStr;
//   var key = CryptoJS.enc.Utf8.parse(keyStr);
//   let iv = CryptoJS.enc.Utf8.parse(ivStr);

//   var decrypt = CryptoJS.AES.decrypt(word, key, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.ZeroPadding
//   });
//   return decrypt.toString(CryptoJS.enc.Utf8);
// }
