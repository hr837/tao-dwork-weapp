
import dicService from "../services/dic-service";

const dicKey = 'DIC_CACHE';

/**
 * 根据字典编码获取字典项缓存
 * @param n 
 */
export async function dicItemsByCatCode(code: string): Promise<any> {
  return new Promise((_resolve, _rejcet) => {
    // 获取缓存数据
    const dics: Array<any> = wx.getStorageSync(dicKey);
    if (dics) {
      const dic = dics.find(x => x.code == code);
      if (dic) {
        return _resolve(dic.children.map((x: any) => ({ code: +x.code, key: x.key, name: x.name, catCode: x.parent.code, catKey: x.parent.key, order: x.order })));
      } else {
        return _resolve([]);
      }
    } else {
      dicService.getAll().then((_response: any) => {
        if (_response.code == 0) {
          const dics: Array<any> = _response.data;
          wx.setStorage({ key: dicKey, data: dics });
          const dic = dics.find(x => x.code == code);
          if (dic) {
            return _resolve(dic.children.map((x: any) => ({ code: +x.code, key: x.key, name: x.name, catCode: x.parent.code, catKey: x.parent.key, order: x.order })));
          } else {
            return _resolve([]);
          }
        } else {
          _resolve([]);
        }
      }).catch((_err: any) => {
        _resolve([]);
      })
    }
  });
}
