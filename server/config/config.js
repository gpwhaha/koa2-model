var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

/*报错输出日志*/
//错误日志目录、文件名、输出完整路径
var errorPath = "/error";
var errorFileName = "error";
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

/*请求数据得到响应时输出响应日志*/
//响应日志目录、文件名、输出完整路径
var responsePath = "/response";
var responseFileName = "response";
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

/*操作数据库进行增删改等敏感操作记录日志*/
//操作日志目录、文件名、输出完整路径
var handlePath = "/handle";
var handleFileName = "handle";
var handleLogPath = baseLogPath + handlePath + "/" + handleFileName;


module.exports = {
    //日志格式等设置
    appenders:
        {
            "rule-console": {"type": "console"},
            "errorLogger": {
                "type": "dateFile",//日志类型为dateFile
                "filename": errorLogPath,
                "pattern": "-yyyy-MM-dd.log",//后缀，每天产生一个日志
                "alwaysIncludePattern": true,//是否总是有后缀名
                "encoding": "utf-8",
                "maxLogSize": 10485760,//文件最大值为 10M
                "numBackups": 10,//之前的日志最多保留 10 个。
                "path": errorPath
            },
            "resLogger": {
                "type": "dateFile",
                "filename": responseLogPath,
                "pattern": "-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "encoding": "utf-8",
                "maxLogSize": 10485760,
                "numBackups": 10,
                "path": responsePath
            },
            "handleLogger": {
                "type": "dateFile",
                "filename": handleLogPath,
                "pattern": "-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "encoding": "utf-8",
                "maxLogSize": 10485760,
                "numBackups": 10,
                "path": responsePath
            },
        },
    //供外部调用的名称和对应设置定义
    categories: {
        "default": {"appenders": ["rule-console"], "level": "all"},
        "resLogger": {"appenders": ["resLogger"], "level": "info"},
        "errorLogger": {"appenders": ["errorLogger"], "level": "error"},
        "handleLogger": {"appenders": ["handleLogger"], "level": "all"},
        "http": {"appenders": ["resLogger"], "level": "info"}
    },
    "baseLogPath": baseLogPath
}