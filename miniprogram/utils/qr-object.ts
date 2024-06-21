/**
 * 定义枚举
 */
export enum QRTypeEnum {
  QRTypeCompany = 'company',
  QRTypePolice = 'police',
  QRTypePractitioner = 'practitioner',
  QRTypeProject = 'project'
};

/**
 * 定义对象
 */
export class QRObject {
  QRType: QRTypeEnum;
  code: string;
  remark?: string;

  /**
   * 构造函数
   * @param qrType 
   * @param code 
   * @param remark 
   */
  constructor(qrType: QRTypeEnum, code: string, remark?: string) {
    this.QRType = qrType;
    this.code = code;
    this.remark = remark;
  }

  /**
   * 扫描二维码后，解析二维码其中的JSON数据
   * @param jsonStr 
   * @param successCallback 
   * @param failCallback 
   */
  static handleQRCodeJSON(jsonStr: string, successCallback?: (object: QRObject) => void, failCallback?: (error: Error) => void): any {
    try {
      const object = JSON.parse(jsonStr);
      // QRType取值范围 police company practitioner project
      const { QRType, code, remark } = object;

      // QRType 不可为空
      if (QRType === null || QRType === undefined || QRType.length === 0) {
        if (failCallback) {
          const error = new Error("QRType null");
          failCallback(error);
        }
        return null;
      }

      // code 不可为空
      if (code === null || code === undefined || code.length === 0) {
        if (failCallback) {
          const error = new Error("code null");
          failCallback(error);
        }
        return null;
      }

      // 封装对象
      const resultObject = new QRObject(QRType, code, remark);
      // 返回正常数据
      if (successCallback) {
        successCallback(resultObject);
      }

      return resultObject;
    } catch (error) {
      if (failCallback) {
        failCallback(error);
      } else {
        console.error('Failed to parse JSON:', error.message);
      }

      return null;
    }
  }
}