const express = require('express')
const article_handler = require('../router_handler/article_handler')
const expressJoi =  require('@escook/express-joi')
const { articleDetails_schema } =  require('../schema/user')
const multer = require('multer')
const path = require('path')
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

// 获取轮播图
router.get('/home/rotation', article_handler.getRotation)

// 获取类型
router.get('/home/category', article_handler.getCategory)

// 获取文章分类列表
router.get('/home/article', article_handler.getArticleList)

// 获取文章详情
router.get('/home/articledDetails', expressJoi(articleDetails_schema), article_handler.getArticleDetails)

// 获取推荐用户
router.get('/home/author', article_handler.getAuthor)

// 推荐话题
router.get('/home/subject', article_handler.getSubject)

// 搜索关键词
router.get('/home/search', article_handler.getSearch)

// 上传封面图片
router.post('/cover', upload.array('cover', 6), article_handler.cover)

module.exports = router