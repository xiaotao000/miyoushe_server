// 数据库连接文件
// 1. 导入mysql2模块
const mysql = require('mysql2/promise')

// 2. 建立连接
const db = mysql.createPool({
    host: 'localhost', // 主机地址
    port: 3306, // 端口号
    user: 'root', // 用户名
    password: 'admin123', // 密码
    database: 'admin_miyoushe', // 数据库名
})

// 3. 导出连接
module.exports = db