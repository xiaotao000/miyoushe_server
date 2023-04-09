const express = require('express')
const multer = require('multer')
const user_handler = require('../router_handler/user_handler')
const path = require('path')
const expressJoi = require('@escook/express-joi')
const { userinfo_schema, nickname_schema, articleDetails_schema } = require('../schema/user')
const router = express.Router()

const storage = multer.diskStorage({
    //保存路径
    destination: function (req, file, cb) {
        //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
        cb(null, path.join(__dirname, '../avatar'))
    },
    //保存在 destination 中的文件名
    filename: function (req, file, cb) {
        const ext = '.' + file.mimetype.split('/')[1]
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})


const upload = multer({
    storage: storage,
    dest: path.join(__dirname, '../avatar'),
    fileFilter(req, file, callBack) {
        if(!['image/jpeg', 'image/png'].includes(file.mimetype)) return res.cc('上传图片文件格式不正确')
        callBack(null, true)
    },
})
// 获取用户信息
router.get('/userinfo', user_handler.getUserInfo)

// 更新用户昵称
router.post('/user/nickname', expressJoi(nickname_schema), user_handler.setNickname)

// 更新性别
router.put('/user/gender',  user_handler.setGender)

// 上传头像
router.post('/update/avatar', upload.single('avatar'), user_handler.updateAvatar)

// 更新用户信息
router.post('/userinfo', expressJoi(userinfo_schema), user_handler.setUserInfo)

// 获取用户帖子
router.get('/user/article', user_handler.getUserArticleList)

// 删除用户发布帖子
router.delete('/user/removeArticle/:id', user_handler.removeArticle)


module.exports = router