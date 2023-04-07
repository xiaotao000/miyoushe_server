const db = require('../config/db')

// 获取用户信息
exports.getUserInfo = async(req, res) => {
    const { id } = req.user
    const [ rows ] =  await db.query('select id, nickname, avatar, gender, autograph, is_delete from user where id = ?', id)
    if(!rows.length) return res.cc('获取用户信息失败')
    res.cc('获取用户信息成功', 0, rows[0])
}

// 更新头像
exports.updateAvatar = async(req, res, next) => {
    const { id } = req.user
    if (req.file) {
        const avatar = '/avatar/' + req.file.filename
        // 3. 执行SQL语句
        const sql = 'update user set avatar = ? where id = ?'
        try {
            const [rows] = await db.query(sql, [avatar, id])
            if (rows.affectedRows !== 1) return res.cc('修改头像失败！')
            res.cc('修改头像成功', 0, avatar)
        } catch (error) {
            next(error)
        }
    }else{
        res.cc('请上传图片')
    }
}

// 更新昵称信息
exports.setNickname = async(req, res, next) => {
    // 1. 定义SQL语句
    const sql = 'update user set nickname = ? where id = ?'
    // 2. 执行SQL修改
    try {
        const [rows] = await db.query(sql, [req.body.nickname, req.user.id])
        if (rows.affectedRows !== 1) return res.cc('更新用户信息失败')
        res.cc('更新用户信息成功', 0)
    } catch (error) {
        next(error)
    }
}

exports.setGender = async (req, res, next) => {
   const { gender } =  req.body
    if (!gender) return res.cc('性别不能为空')
    const sql = 'update user set gender = ? where id = ?'
    try {
        const [rows] = await db.query(sql, [gender, req.user.id])
        if (rows.affectedRows !== 1) return res.cc('更新用户信息失败')
        res.cc('更新用户信息成功', 0)
    } catch (error) {
        next(error)
    }
}

// 更新用户信息
exports.setUserInfo = async(req, res) => {
    const { id } = req.user
    const sql = 'update user set ? where id = ' + id
    try {
        const [rows] = await db.query(sql, req.body)
        if (rows.affectedRows !== 1) return res.cc('更新用户信息失败')
        res.cc('更新用户信息成功', 0)
    } catch (error) {
        next(error)
    }
}

// 获取用户贴子
exports.getUserArticleList = async(req, res) => {
    const { id } = req.user
    const sql = 'select id, cover, title, introduce, comment, count, browse, time, section, category from article where uid = ? and is_delete = 0'
    const [ rows ] = await db.query(sql, [id])
    const arr = rows.map(item => ({id: item.id, author: item.author, title:item.title, avatar: item.avatar,  category: item.category, browse: item.browse, count: item.count, comment: item.comment, introduce: item.introduce, section: item.section, time: item.time, cover: JSON.parse(item.cover)}))
    res.cc('获取用户贴子成功', 0, arr)
}

// 删除用户帖子
exports.removeArticle = async(req, res) => {
    const { id } = req.params
    const [result] = await db.query('select * from article where id = ? and is_delete = 0', id)
    if (!result.length) return res.cc('id有误')
    // 2. 根据ID删除类别（根据ID修改类别的 状态 is_delete = 1）
    const [rows] = await db.query('update article set is_delete = 1 where id = ?', id)
    if (rows.affectedRows !== 1) return res.cc('删除失败')
    res.cc('删除成功', 0)
}
