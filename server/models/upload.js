const dbUtils = require('./../utils/db-util')

const upload = {
  async  saveUploadOs(url) {
    let trueUrl = 'https://' + url 
    let text = '此间少年';
    let price = 233;
    let nums= 2;
    let type = 1
    let _sql = `INSERT INTO mall_index (pic,text,price,nums,type) VALUES ('${trueUrl}','${text}','${price}','${nums}','${type}')`
    let result =  dbUtils.query(_sql)
    return result;
  }
    
}

module.exports = upload