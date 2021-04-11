/**
 * 上传业务操作
 */
const uploadModel = require('./../models/upload')

const upload = {
  /**
   * 保存图片
   * @param  {object} pictures 图片地址信息
   * @return {object}      保存结果
   */
   async upload( pictures ) {
    let result = await uploadModel.saveUploadOs(pictures)
    return result
  },
}
module.exports = upload