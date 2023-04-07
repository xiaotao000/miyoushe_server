const joi = require('joi')

// 登入规则
exports.login_schema = {
    body: {
        phone: joi.string().pattern(/^[1][3,4,5,6,7,8,9][0-9]{9}$/).required().error(new Error('请输入正确手机号')),
        password: joi.string().pattern(/[a-zA-Z0-9\+\.]{6,16}/).required().error(new Error('密码不符合规则')),
    }
}

// 注册规则
exports.reg_schema = {
    body: {
        phone: joi.string().pattern(/^[1][3,4,5,6,7,8,9][0-9]{9}$/).required().error(new Error('请输入正确手机号')),
        password: joi.string().pattern(/[a-zA-Z0-9\+\.]{6,16}/).required().error(new Error('密码不符合规则')),
        code: joi.string().pattern(/[0-9]{6}/).required().error(new Error('验证码不符合规则'))
    }
}

// 验证码规则
exports.code_schema = {
    body: {
        phone: joi.string().pattern(/^[1][3,4,5,6,7,8,9][0-9]{9}$/).required().error(new Error('请输入正确手机号'))
    }
}

// 昵称
exports.nickname_schema = {
    body: {
        nickname: joi.string().pattern(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).required().error(new Error('昵称不能为空或不能为空格')), // 昵称
    }
}
// 更新用户信息
exports.userinfo_schema = {
    body: {
        nickname: joi.string().pattern(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).error(new Error('昵称不能为空或不能为空格')), // 昵称
        autograph: joi.string().empty('').default('系统原装签名，送给每一位小可爱~').max(48).error(new Error('昵称长度不能大于48')),  // 个性签名
        gender: joi.string().required().valid('男', '女', '保密'), // 性别
    }
}

// 发布文章列表
exports.article_schema = {
    body: {
        title: joi.string().max(30).required().error(new Error('标题不能为空或者不能字数不能大于30')), // 文章标题
        introduce: joi.required().error(new Error('内容不能为空')), // 文章内容
        category: joi.string().required().valid('酒馆', '攻略', '硬核', '官方', '同人图', 'COS',).error(new Error('版块只能为以下内容酒馆、攻略、硬核、官方')), //版块
        section: joi.string().error(new Error('话题不能为空')), //话题
        cover: joi.array().items(joi.object())
    }
}

// 发布图片
exports.picture_schema = {
    body: {
        title: joi.string().max(30).required().error(new Error('标题不能为空或者不能字数不能大于30')), // 文章标题
        introduce: joi.required().error(new Error('内容不能为空')), // 文章内容
        category: joi.string().required().valid('同人图', 'COS', '官方', '酒馆', '攻略', '硬核').error(new Error('版块只能为以下内容同人图、COS、官方')), //版块
        section: joi.string().error(new Error('话题不能为空')), //话题
        cover: joi.array().items(joi.object())
    }
}

// 获取文章详情
exports.articleDetails_schema = {
    query: {
        id: joi.number().integer().required().error(new Error('用户ID不符合规则'))
    }
}

// 修改发布文章
exports.updateArticle_schema =  {
    body: {
        id: joi.number().integer().required().error(new Error('用户ID不符合规则')),
        title: joi.string().max(30).required().error(new Error('标题不能为空或者不能字数不能大于30')), // 文章标题
        introduce: joi.required().error(new Error('内容不能为空')), // 文章内容
        category: joi.string().required().valid('酒馆', '攻略', '硬核', '官方', '同人图', 'COS').error(new Error('版块只能为以下内容酒馆、攻略、硬核、官方')), //版块
        section: joi.string().error(new Error('请输入话题')), //话题
        cover: joi.array().items(joi.object())
    }
}

// 修改发布图片
exports.updatePicture_schema = {
    body: {
        id: joi.number().integer().required().error(new Error('用户ID不符合规则')),
        title: joi.string().max(30).required().error(new Error('标题不能为空或者不能字数不能大于30')), // 文章标题
        introduce: joi.required().error(new Error('内容不能为空')), // 文章内容
        category: joi.string().required().valid('同人图', 'COS', '官方').error(new Error('版块只能为以下内容同人图、COS、官方')), //版块
        section: joi.string().error(new Error('请输入话题')), //话题
        cover: joi.array().items(joi.object())
    }
}