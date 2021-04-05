/**
 * restful api 子路由
 */

const router = require('koa-router')()
const userInfoController = require('./../controllers/user-info')

const routers = router
  .get('/user/getUserInfo.json', userInfoController.getLoginUserInfo)
  .post('/user/signIn.json', userInfoController.signIn)
  .post('/user/signUp.json', userInfoController.signUp)
  .get('/user/images', userInfoController.getImages) //获取用户照片
  .post('/user/allimages', userInfoController.getAllImages) //获取所有商品照片


module.exports = routers