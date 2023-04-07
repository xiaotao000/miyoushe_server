const express = require('express')
const auth_handler = require('../router_handler/auth_handler')
const expressJoi = require('@escook/express-joi')
const { login_schema, reg_schema, code_schema } = require('../schema/user')
const router = express.Router()


// 登入
router.post('/login', expressJoi(login_schema), auth_handler.login)

// 注册
router.post('/reguser', expressJoi(reg_schema), auth_handler.reg)

// 验证码
router.post('/sendCode', expressJoi(code_schema), auth_handler.code)

module.exports = router