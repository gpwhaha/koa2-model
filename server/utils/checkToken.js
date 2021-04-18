const jwt = require("jsonwebtoken");


async function check(ctx, next) {
  let url = ctx.request.url;
  // console.log('url:',url)
  // 登录 不用检查
  if (url == "/api/user/signIn") await next();
  else {
      // 规定token写在header 的 'autohrization' 
    let token = ctx.request.headers["token"];
    // 解码
    let payload = jwt.verify(token,'my_token');
    let { time, timeout } = payload;
    let data = new Date().getTime();
    if (data - time <= timeout) {
        // 未过期
      await next();
    } else{
        //过期
      ctx.body = {
        status: 50014,
        message:'token 已过期'
      };
    }
  }
}

module.exports = check