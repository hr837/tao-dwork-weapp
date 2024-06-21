import config from "../config/base";

export function formatTime(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

export function formatNumber(n: number | string) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

export function base64_encode(str: string) {
  let c1;
  let c2;
  let c3;
  const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let i = 0;
  const len = str.length;
  let result: string = '';

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i === len) {
      result += base64EncodeChars.charAt(c1 >> 2);
      result += base64EncodeChars.charAt((c1 & 0x3) << 4);
      result += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i === len) {
      result += base64EncodeChars.charAt(c1 >> 2);
      result += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      result += base64EncodeChars.charAt((c2 & 0xF) << 2);
      result += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    result += base64EncodeChars.charAt(c1 >> 2);
    result += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    result += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    result += base64EncodeChars.charAt(c3 & 0x3F);
  }

  return result;
}

export async function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export function trim(s: string) {
  return s.replace(/(^\s*)|(\s*$)/g, '');
}

export function ltrim(s: string) {
  return s.replace(/(^\s*)/g, '');
}

export function rtrim(s: string) {
  return s.replace(/(\s*$)/g, '');
}

/**
 * 日期格式化
 * @param date 日期
 * @param fmt 格式化
 */
export function dateFormat(date: Date, fmt: string) {
  var o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt;
}

/**
 * 毫秒值转年月日
 * @param ts 
 */
export function timestampToDate(ts: number): string {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
  const str = `${year}-${month}-${day}`;
  return str;
}

/**
 * 组装Address组件location对象
 * @param location 坐标
 * @param detailedAddress 详细地址
 */
export function locationToObject(location: any, detailedAddress: any): any {

  if (location) {
    return { latitude: location.lat, longitude: location.lng, address: detailedAddress }
  }
}

/**
 * 修改Location属性
 * @param location 坐标
 */
export function modifyLocation(location: any): any {

  if (location) {
    return { lng: location.longitude, lat: location.latitude }
  }
}

/**
 * 行政区数组转对象
 * @param address 行政区数组
 */
export function addressArrayToObject(address: any[]): any {
  if (!address) {
    return null;
  }
  try {
    let province = '';
    let provinceCode = '';
    if (address.length >= 1) {
      province = address[0].name;
      provinceCode = address[0].id;
    }
    let city = '';
    let cityCode = '';
    if (address.length >= 2) {
      city = address[1].name;
      cityCode = address[1].id;
    }
    let county = '';
    let countyCode = '';

    if (address.length >= 3) {
      county = address[2].name ? address[2].name : address[2].fullname;
      countyCode = address[2].id;
    }

    return { province, provinceCode, city: city, cityCode, county, countyCode };
  } catch (error) {
    return null;
  }
}

/**
 * 行政区对象转数组
 * @param address 行政区
 */
export function addressObjectToArray(address: any): any {
  if (!address) {
    return null;
  }
  const arrayResult = [];
  try {
    // 省份
    if (address.provinceCode) {
      arrayResult.push({ id: address.provinceCode, name: address.province })
    }
    // 城市
    if (address.cityCode) {
      arrayResult.push({ id: address.cityCode, name: address.city })
    }
    // 县区
    if (address.countyCode) {
      arrayResult.push({ id: address.countyCode, name: address.county })
    }

    return arrayResult;
  } catch (error) {
    return arrayResult;
  }
}

/**
 * 行政区字典对象转数组
 * @param address 行政区
 */
export function keyValueObjectToArray(address: any): any {
  if (!address) {
    return null;
  }
  const arrayResult = [];

  try {
    for (let [key, value] of Object.entries(address)) {
      if (key && value) {
        arrayResult.push({ id: value, name: key })
      }
    }

    return arrayResult;
  } catch (error) {
    return arrayResult;
  }
}

/**
 * 处理图片地址，自动拼接
 * @param imagesArrayStr 数组字符串，用逗号隔开
 */
export function handleFullPathImages(imagesArrayStr: string) {
  let result = [];
  // 分割图片数组
  let original = imagesArrayStr ? imagesArrayStr.split(",") : []
  if (original && original.length) {
    for (var index = 0; index < original.length; index++) {
      let resultStr = config.apiUrl + "/" + original[index];
      result.push(resultStr);
    }
  }
  return result;
}

/**
 * 处理图片地址，自动拼接
 * @param originalArr 数组字符串
 */
export function handleFullPathImagesFromArray(originalArr: Array<string>) {
  let result = [];
  if (originalArr && originalArr.length) {
    for (var index = 0; index < originalArr.length; index++) {
      let resultStr = config.apiUrl + "/" + originalArr[index];
      result.push(resultStr);
    }
  }
  return result;
}

/**
 * 导出工具类
 */
export default {
  handleFullPathImages,
  handleFullPathImagesFromArray,
  formatTime,
  formatNumber,
  base64_encode
};