const joi = require('joi')

// 登入规则
exports.login_schema = {
    body:{
        username: joi.string().min(2).max(16).error(new Error('用户名不符合规则')),
        password: joi.string().pattern(/^\S{6,12}$/).required().error(new Error('密码不符合规则'))
    }
}

exports.ArticleSchema = {
    body: {
        pagenum: joi.number().min(1).error(new Error('页码数不能小于1')),
        limit: joi.number().min(1).error(new Error('每页条数不能小于1')),
        category: joi.string().required().valid('酒馆', '攻略', '硬核', '同人图', 'COS',  '官方', '观测枢').error(new Error( '查询分类只为以下内容：官方、酒馆、攻略、硬核、同人图、COS、官方'))
    }
}

// 新增轮播
exports.addRotation = {
    body: {
        imgUrl: joi.string().required().error(new Error('图片不能为空')),
        addPlo: joi.string().required().error(new Error('标题不能为空')),
        addKlm: joi.string().required().valid('活动', '咨询', '公告', '资讯').error(new Error('分类只能为活动、咨询、公告')),
        serial: joi.string()
    }
}