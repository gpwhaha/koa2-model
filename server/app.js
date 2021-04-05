const path = require('path')
const Koa = require('koa')
const convert = require('koa-convert')
const views = require('koa-views')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')

const config = require('./../config')
const routers = require('./routers/index')
const logsUtil = require('./utils/logs.js');

const app = new Koa()

// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}


/**
 * 错误捕捉中间件
 */
app.use(async (ctx, next) => {
  const start = new Date(); // 响应开始时间
  let intervals;
  try {
    ctx.error = (code, message) => {
      if (typeof code === 'string') {
        message = code;
        code = 500;
      }
      ctx.throw(code || 500, message || '服务器错误');
    };
    await next();
    intervals = new Date() - start;
    logsUtil.logResponse(ctx, intervals); //记录响应日志
  } catch (e) {
    intervals = new Date() - start;
    logsUtil.logError(ctx, e, intervals); //记录异常日志
    let status = e.status || 500;
    let message = e.message || '服务器错误';
    ctx.response.body = {
      status,
      message
    };
  }
});
// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

// app.use(async (ctx, next) => {
//   const start = new Date();					          // 响应开始时间
//   let intervals;								              // 响应间隔时间
//   try {
//       await next();
//       intervals = new Date() - start;
//       logsUtil.logResponse(ctx, intervals);	  //记录响应日志
//   } catch (error) {
//       intervals = new Date() - start;
//       logsUtil.logError(ctx, error, intervals);//记录异常日志
//   }
// })


// 配置控制台日志中间件
app.use(koaLogger())

// 配置ctx.body解析中间件
app.use(bodyParser())

// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname, './../static')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())

// 监听启动端口
app.listen(config.port)
console.log(`the server is start at port ${config.port}`)