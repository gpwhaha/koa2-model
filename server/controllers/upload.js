const userCode = require('./../codes/user')
const upload = require('../utils/upload')
const uploadInfoService = require('./../services/upload')

module.exports = {
  /**
   * 上传图片至腾讯云并保存到数据库
   * @param {*} ctx 
   * @param {*} options 
   */
   async uploadOS(ctx,options){
    let result = {
      success: false,
      code:'',
      message: '',
      data: null,
    }
    let results = await upload.uploadOs(ctx,options);
    let uploads = await uploadInfoService.upload(results.Location);
    console.log('上传：',uploads)
    if(results){
      result.data = results.Location;
      result.code = results.statusCode;
      result.message = '上传成功';
      result.success = true;
    } else{
      result.message = '失败'
    }
    // console.log('OS123:',result)
    ctx.body = result;
  }

}