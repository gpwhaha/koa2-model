const dbUtils = require('./../utils/db-util')
const bcrypt = require('bcryptjs')

const user = {

  /**
   * 数据库创建用户
   * @param  {object} model 用户数据模型
   * @return {object}       mysql执行结果
   */
  async create(model) {
    // 生成随机字符串 gen => generate 生成 salt 盐
    const salt = await bcrypt.genSalt(10);
    // 使用随机字符串对密码进行加密
    const hashPassword = await bcrypt.hash(`${options.password}`, salt);
    //输出随机字符串
    console.log('密文1：', salt);
    //输出加密密码
    console.log('密文3：', hashPassword)
    let _sql2 = `UPDATE  user_info SET password = "${hashPassword}" WHERE name = "${options.name}"`
    let result2 = await dbUtils.query(_sql2)
    let result = await dbUtils.insertData('user_info', model)
    return result
  },

  /**
   * 查找一个存在用户的数据
   * @param  {obejct} options 查找条件参数
   * @return {object|null}        查找结果
   */
  async getExistOne(options) {
    let _sql = `
    SELECT * from user_info
      where  name="${options.name}"
      limit 1`;

    let result = await dbUtils.query(_sql)
    
    if (Array.isArray(result) && result.length > 0) {
      result = result[0]
    } else {
      result = null
    }
    return result
  },
  
/**
 * 根据用户名更新token
 * @param {object} options 用户名和token
 * @returns 
 */
  async updateUserToken(options){
    let _sql = `UPDATE  user_info SET token = "${options.token}" WHERE name = "${options.name}"`
    let result = await dbUtils.query(_sql)
    return result
  },

  async getUserInfoByToken(token){
    let _sql = `
    SELECT * from user_info
      where  token="${token}"
      limit 1`;

    let result = await dbUtils.query(_sql)
    if (Array.isArray(result) && result.length > 0) {
      result = result[0]
    } else {
      result = null
    }
    return result
  },
  /**
   * 根据用户名和密码查找用户
   * @param  {object} options 用户名密码对象
   * @return {object|null}         查找结果
   */
  async getOneByUserNameAndPassword(options) {
    let _sql = `
    SELECT * from user_info
      where password="${options.password}" and name="${options.name}"
      limit 1`;

    let result = await dbUtils.query(_sql)

    if (Array.isArray(result) && result.length > 0) {
      result = result[0]
    } else {
      result = null
    }
    // console.log('用户：',result)
    return result
  },

  /**
   * 根据用户名查找用户信息
   * @param  {string} userName 用户账号名称
   * @return {object|null}     查找结果
   */
  async getUserInfoByUserName(userName) {

    let result = await dbUtils.select(
      'user_info',
      ['id', 'name', 'c_time'])
    if (Array.isArray(result) && result.length > 0) {
      result = result[0]
    } else {
      result = null
    }
    return result
  },

  /**
   * 
   * @param {*} id 用户id
   * @returns 查找图片结果
   */
  async getUserImages(id) {
    let result = await dbUtils.findDataById('detail', id)
    if (Array.isArray(result) && result.length > 0) {
      result = result[0]
    } else {
      result = null
    }
    return result
  },

  /**
   * 分页查询商品图片
   * @param {number} start 开始查询数据
   * @param {number} end 结束查询数据
   * @returns 
   */
  async getAllImages(start = 1, end = 10) {
    let result = await dbUtils.findDataByPage('mall_index', ['id', 'pic', 'text', 'price', 'nums', 'type'], Number(start), Number(end))
    if (Array.isArray(result) && result.length > 0) {
      result = result
    } else {
      result = null
    }
    return result
  },





}


module.exports = user