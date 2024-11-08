const responseCode = {
  "10001": "用户不存在",
  "10002": "密码错误",
  "10003": "两次密码不一致",

  // 关于权限
  "20001": "", // token 解析: valid invalid 过期 error

  // errorDatabaseConnFailed: 50001

  //服务器异常
  "50001": "数据库连接错误",
  // CURD try - catch
  "50002": "数据库执行错误",
}

// data => method + class => error

/**
 *  1. 读取配置文件： port db-url log-file => 读取错误 => 
 *  2. 连接数据库
 *  3. 初始化日志文件
 *  4. 系统： 注册路由 - ....
 */

// http status -> 200
const successRes = {
  code: 200,
  message: "success",
  data: {}
}

// http status -> 200 ：请求正确返回
const failedRes = { // 业务错误
  code: 5001,
  message: '数据库连接错误',
  data: null
};