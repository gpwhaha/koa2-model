const userInfoService = require('./../services/user-info')
const userCode = require('./../codes/user')
const upload = require('../utils/upload')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {

  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
  async signIn(ctx) {
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null,
      code: ''
    }

    let userResult = await userInfoService.signIn(formData)

    if (userResult) {
      if (formData.username === userResult.name) {
        result.success = true
        //密码校验
        let isVaild = await bcrypt.compare(`${formData.password}`, `${userResult.password}`)
        if(!isVaild){
          result.message = userCode.FAIL_USER_PASSWORD_ERROR;
          result.success = false;
          result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR'
        }else{
          result.message = '登录成功';
        }
      } else {
        result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR
        result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR'
      }
    } else {
      result.code = 'FAIL_USER_NO_EXIST',
        result.message = userCode.FAIL_USER_NO_EXIST
    }

    if (result.success === true) {
      let session = ctx.session
      // 帐号密码正确  创建token   
      //payload中写入一些值  time:创建日期  timeout：多长时间后过期
      let payload = {
        userNumber: userResult.name,
        time: new Date().getTime(),
        timeout: 1000 * 60 * 60 * 2
      }
      let token = jwt.sign(payload, 'my_token');
      session.TokenKey = token
      let userInfo = await userInfoService.updateUserToken(token,userResult.name)  
      // console.log('userInfo',userInfo)
      // result.data = userInfo;
      result.data = {
        token
      };
      result.code = 200;
      ctx.body = result
    } else {
      ctx.body = result
    }
  },

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async signUp(ctx) {
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null
    }

    let validateResult = userInfoService.validatorSignUp(formData)

    if (validateResult.success === false) {
      result = validateResult
      ctx.body = result
      return
    }

    let existOne = await userInfoService.getExistOne(formData)
    console.log(existOne)

    if (existOne) {
      if (existOne.name === formData.userName) {
        result.message = userCode.FAIL_USER_NAME_IS_EXIST
        ctx.body = result
        return
      }
      if (existOne.email === formData.email) {
        result.message = userCode.FAIL_EMAIL_IS_EXIST
        ctx.body = result
        return
      }
    }


    let userResult = await userInfoService.create({
      email: formData.email,
      password: formData.password,
      name: formData.userName,
      create_time: new Date().getTime(),
      level: 1,
    })

    console.log(userResult)

    if (userResult && userResult.insertId * 1 > 0) {
      result.success = true
    } else {
      result.message = userCode.ERROR_SYS
    }

    ctx.body = result
  },

  /**
   * 获取用户信息
   * @param    {obejct} ctx 上下文对象
   */
  async getLoginUserInfo(ctx) {
    let session = ctx.session
    let userName = session.userName
    let token = ctx.request.headers["token"];
    // console.log('token=', token)
    // 判断用户是否登录，获取cookie里的SESSIONID
    let result = {
      success: false,
      message: '',
      data: null,
      code: 200
    }

    let userInfo = await userInfoService.getUserInfoByToken(token)
    if (userInfo) {
      result.data = userInfo
      result.success = true
      result.message = '登录成功'
      result.code = 200
    } else {
      result.message = userCode.FAIL_USER_NO_LOGIN
      result.code = 500
    }

    ctx.body = result
  },

  /**
   * 校验用户是否登录
   * @param  {obejct} ctx 上下文对象
   */
  validateLogin(ctx) {
    let result = {
      success: false,
      message: userCode.FAIL_USER_NO_LOGIN,
      data: null,
      code: 'FAIL_USER_NO_LOGIN',
    }
    let session = ctx.session
    if (session && session.isLogin === true) {
      result.success = true
      result.message = ''
      result.code = ''
    }
    return result
  },

  /**Get ctx.query
   * 查找图片列表
   * @param {*} ctx 上下文对象
   */
  async getImages(ctx) {
    let {
      id
    } = ctx.query

    let result = {
      success: false,
      message: '',
      data: null,
    }
    // console.log('ids:', id)
    if (id) {
      let userInfo = await userInfoService.handleGetUserImages(id)
      if (userInfo) {
        result.data = userInfo
        result.success = true
      } else {
        result.message = userCode.FAIL_USER_NO_LOGIN
      }
    } else {
      // TODO
    }

    ctx.body = result
  },

  /**
   * Post ctx.request.body
   * @param {*} ctx 上下文
   */
  async getAllImages(ctx) {
    let {
      start,
      end
    } = ctx.request.body
    // console.log(ctx.request.body)
    let result = {
      success: false,
      message: '',
      data: null,
    }

    let images = await userInfoService.handleGetAllImages(start, end)
    if (images) {
      result.data = images
      result.success = true
      result.message = "成功"
    } else {
      result.message = userCode.FAIL_USER_NO_LOGIN
    }
    ctx.body = result
  },

  async upload(ctx, options) {
    let result = {
      success: false,
      message: '',
      data: null,
    }
    let results = await upload.uploadPicture(ctx, options);
    // console.log('上传：',results)
    if (results) {
      result.data = results;
    } else {
      result.message = '失败'
    }
    ctx.body = results;
  },

}