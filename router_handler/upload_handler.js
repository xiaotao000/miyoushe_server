const db = require('../config/db')

// 发布帖子
exports.postArticle = async(req, res, next) => { 
    const user = 'select * from user where id = ?'
    const [ info ] = await db.query(user, req.user.id)
    const { nickname, avatar, autograph } = info[0]
    const sql = 'insert into article set ?'
    const articleInfo = {
        uid: req.user.id,
        author: nickname,
        avatar,
        autograph,
        ...req.body,
        cover: JSON.stringify(req.body.cover),
        time: new Date(),
    }
    try {
        const [ rows ] = await db.query(sql, articleInfo)
        if(rows.affectedRows !== 1) return res.cc('新增失败')
        res.cc('新增成功', 0)
    } catch (error) {
        res.cc('图片不符合规则')
    }
}
// 修改帖子或图片
exports.updateArticle  = async(req, res) => {
    const { id } = req.body
    const articleInfo = {
        ...req.body,
        cover: JSON.stringify(req.body.cover),
    }
    try {
        const slq = 'update article set ? where id = ? and is_delete = 0'
        const [ rows ]  = await db.query(slq, [articleInfo, id])
        if (rows.affectedRows !== 1) return res.cc('修改用户帖子失败')
        res.cc('修改成功', 0)
    } catch (error) {
        res.cc('修改失败')
    }
}

// 发布内容图片
exports.articleImg = async(req, res) => {
    if(!req.file) return res.cc('请上传图片')
    const avatarList = '/upload/' + req.file.filename
    res.cc('图片上传成功', 0, avatarList)
}

// 管理发布文章
exports.postAdminArticle = async(req, res, next) => { 
    const user = 'select * from user_admin where id = ?'
    const [ info ] = await db.query(user, req.user.id)
    const { nickname, avatar, autograph } = info[0]
    const sql = 'insert into article set ?'
    const articleInfo = {
        uid: req.user.id,
        author: nickname,
        avatar,
        autograph,
        ...req.body,
        cover: JSON.stringify(req.body.cover),
        time: new Date(),
    }
    try {
        const [ rows ] = await db.query(sql, articleInfo)
        if(rows.affectedRows !== 1) return res.cc('新增失败')
        res.cc('新增成功', 0)
    } catch (error) {
        res.cc('图片不符合规则')
    }
}