const express = require('express')
const res = require('express/lib/response')
const multer = require('multer')
const path = require('path')
const upload_handler = require('../router_handler/upload_handler')
const expressJoi = require('@escook/express-joi')
const { article_schema, picture_schema, updateArticle_schema, updatePicture_schema } = require('../schema/user')
const router = express.Router()

const storage = multer.diskStorage({
    //保存路径
    destination: function (req, file, cb) {
        //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
        cb(null, path.join(__dirname, '../uploads'))
    },
    //保存在 destination 中的文件名
    filename: function (req, file, cb) {
        const ext = '.' + file.mimetype.split('/')[1]
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter(req, file, callBack) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) return res.cc('上传图片文件格式不正确')
        callBack(null, true)
    },
})

// 发布文章 
router.post('/user/addArticle', upload.array('cover', 6), expressJoi(article_schema), upload_handler.postArticle)

// 发布图片
router.post('/user/addPicture', upload.array('cover', 6), expressJoi(picture_schema), upload_handler.postArticle)

// 修改用户帖子
router.put('/user/updateArticle', upload.array('cover', 6), expressJoi(updateArticle_schema), upload_handler.updateArticle)

// 修改用户图片
router.put('/user/updatePicture', upload.array('cover', 6), expressJoi(updatePicture_schema), upload_handler.updateArticle)

// 发布内容图片
router.post('/article/picture', upload.single('imgUrl'), upload_handler.articleImg)

// 管理发布文章
router.post('/admin/addArticle', upload.array('cover', 6), expressJoi(article_schema), upload_handler.postAdminArticle)

module.exports = router