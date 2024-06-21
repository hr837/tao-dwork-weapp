import ORG_API from '../services/org-service'

// wx.setStorage(wx.setStorageSync)
// wx.getStorage(wx.getStorageSync)
// wx.clearStorage(wx.clearStorageSync)

const storageKey = 'ORG_KEY';

const setOrgStorage: any = () => {
  // 获取自定义数据
  return ORG_API.getKeyValue();
}

/**
 * 获取机构缓存数据
 */
const getOrgStorage: Function = (): Promise<any> => {
  // 参数处理
  const orgStorage = wx.getStorageSync(storageKey);

  return new Promise((_resolve, _reject) => {
    if (orgStorage) {
      _resolve(orgStorage);
    } else {
      setOrgStorage().then((_response: any) => {
        if (_response && _response.data) {
          const dataSource = _response.data;
          const rootNodes: Array<any> = dataSource.filter((x: any) => !x.parent).map((x: any) => ({ label: x.key, value: x.value, parentValue: x.parent }));

          /**
           * 递归构造树结构
           * @param parent 上级节点
           */
          const func = (parent: any) => {
            const children = dataSource.filter((x: any) => x.parent == parent.value).map((x: any) => ({ label: x.key, value: x.value, parentValue: x.parent }));
            if (children && children.length) {
              parent.children = children;
              // 下级节点
              children.forEach((child: any) => {
                func(child);
              });
            }
          };

          // 递归构造树
          rootNodes.forEach((root: any) => {
            func(root);
          });

          wx.setStorage({ key: storageKey, data: rootNodes });

          // 响应
          _resolve(rootNodes);
        } else {
          _reject('error');
        }
      });
    }
  });
}

/**
 * 根据编码获取层级项
 * @param _code 编码
 */
const getCasecadeItemByCode: Function = (_code: string): Promise<any> => {
  return new Promise((_resolve, _reject) => {
    if (!_code) {
      _reject('error');
    }

    // 参数处理
    getOrgStorage().then((_res: any) => {
      if (_res) {
        const _casecadeItems: Array<any> = [];
        const _splitCodes: Array<string> = _code.split('$');

        // 数据源
        let _dicStorage = _res;
        // 处理数据
        _splitCodes.forEach((_item: any, _index: number) => {
          if (_dicStorage) {
            const formatCode = _splitCodes.slice(0, _index + 1).join('$');

            const _currentItem = _dicStorage.find((x: any) => x.value == formatCode);
            if (_currentItem) {
              _casecadeItems.push(_currentItem);
              _dicStorage = _currentItem.children;
            }
          }
        });

        _resolve(_casecadeItems);
      } else {
        _reject('error');
      }
    });
  });
}

export default {
  getOrgStorage,
  getCasecadeItemByCode,
}