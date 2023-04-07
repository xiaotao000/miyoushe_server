const express = require('express')
const auth_admin = require('../router_handler/auth_admin')
const expressJoi = require('@escook/express-joi')
const { login_schema, addRotation } = require('../schema/admin_user')
const router = express.Router()

// 登入
router.post('/admin/login', expressJoi(login_schema), auth_admin.adminLogin)

// 获取用户列表
router.get('/admin/getUser', auth_admin.getUserList)

// 新增用户
router.post('/admin/addUser', expressJoi(login_schema), auth_admin.adminAddUser)

// 删除用户
router.delete('/admin/removeUser/:id', auth_admin.removeUser)

// 新增轮播
router.post('/admin/rotation', auth_admin.addRotation)

// 修改轮播
router.post('/admin/update/rotation/:id', expressJoi(addRotation), auth_admin.updateRotation)

// 删除轮播
router.delete('/admin/remove/rotation/:id', auth_admin.removeRotation)

module.exports = router