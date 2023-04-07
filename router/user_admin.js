const express = require('express')
const user_admin_handler = require('../router_handler/user_admin_handler')
const multer = require('multer')
const path = require('path')
const expressJoi = require('@escook/express-joi')
const { ArticleSchema } = require('../schema/admin_user')

const upload = multer({
    dest: path.join(__dirname, '../avatar'),
    fileFilter(req, file, callBack) {
        if(!['image/jpeg', 'image/png'].includes(file.mimetype)) return res.cc('上传图片文件格式不正确')
        callBack(null, true)
    },
})

const router = express.Router()

// 获取用户信息
router.get('/admin/userinfo', user_admin_handler.getUserInfo)

// 获取文章列表
router.post('/admin/article', user_admin_handler.getArticleCates) 

// 根据类别查询文章
router.post('/admin/article/cates', expressJoi(ArticleSchema), user_admin_handler.findCate)

// 修改头像
router.post('/admin/update/avatar', upload.single('avatar'), user_admin_handler.updateAvatar)

// 搜索
router.get('/admin/search', user_admin_handler.getSearch)

// 搜索用户
router.get('/admin/user/search', user_admin_handler.getUserSearch)

// 修改用户信息
router.post('/admin/update/user', user_admin_handler.UpdateUser)

module.exports = router