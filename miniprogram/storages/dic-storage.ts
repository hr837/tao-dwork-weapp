import DICAPI from '../services/dic-service'

const setDicStorage: any = () => {
  return DICAPI.getAll();
}

/**
 * 根据分类编码获取缓存列表
 * @param catKey 分类标识
 */
const getDicByCategoryCode: Function = (catKey: string): Promise<any> => {
  // 参数处理
  const dicStorage = wx.getStorageSync(catKey);

  return new Promise((_resolve, _reject) => {
    if (dicStorage) {
      _resolve(dicStorage);
    } else {
      setDicStorage().then((_response: any) => {
        if (_response && _response.code == 200 && _response.data) {
          const dics: any = _response.data;
          const keys = Object.keys(dics);
          keys?.forEach((key: any) => {
            const children = dics[key];

            // const _numberFunc = (sources: Array<any>): void => {
            //   sources?.forEach(x => {
            //     // 值类型变更
            //     x.value = +x.value;
            //     // 下级遍历
            //     if (x.children) {
            //       _numberFunc(x.children);
            //     }
            //   });
            // }
            // _numberFunc(children);

            wx.setStorage({ key: key, data: children });
          });

          const currentCatKey = keys.find((x: any) => x === catKey);
          if (currentCatKey) {
            // 数据类型 字符串-'string' 值类型-'number' 布尔类型-'boolean'
            // 下级节点
            const children = dics[currentCatKey];

            // const _numberFunc = (sources: Array<any>): void => {
            //   sources?.forEach(x => {
            //     // 值类型变更
            //     x.value = +x.value;
            //     // 下级遍历
            //     if (x.children) {
            //       _numberFunc(x.children);
            //     }
            //   });
            // }
            // _numberFunc(children);

            _resolve(children);
          }
        }
      });
    }
  });

}

export default {
  getDicByCategoryCode,
}