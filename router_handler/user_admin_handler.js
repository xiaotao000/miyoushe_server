const db = require('../config/db')

// 获取用户信息
exports.getUserInfo = async(req, res) => {
    const { id } = req.user
    const [ rows ] =  await db.query('select id, nickname, avatar, password from user_admin where id = ?', id)
    if(!rows.length) return res.cc('获取用户信息失败')
    if (rows[0].id === 1) {
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: rows[0],
            routes: ['article', 'manage', 'userManage', 'personalData', 'rotation']
        })
    } else {
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: rows[0],
            routes: ['article', 'manage', 'personalData', 'rotation'],
            button: ['edit', 'remover']
        })
    }
}

// 获取文章列表
exports.getArticleCates = async(req, res, next) => {
    const { pagenum = 1, limit = 5 } = req.body
    if (!pagenum || pagenum < 1) return res.cc('页码数不能小于1')
     try {
        const [rows] = await db.query('select * from article where is_delete = 0 LIMIT ?, ?', [(pagenum - 1) * 5, Number(limit)])
        const [count] = await db.query('select * from article where is_delete = 0')
        const data = rows.map(item => ({id: item.id, author: item.author, title:item.title, avatar: item.avatar,  category: item.category, browse: item.browse, count: item.count, comment: item.comment, introduce: item.introduce, section: item.section, time: item.time, cover: JSON.parse(item.cover)}))
        return res.send({
            status: 0,
            message: '获取文章列表成功',
            data,
            total: count.length,
            pagenum: Number(pagenum),
            limit: Number(limit)
        })
    } catch (error) {
        next(error)
    }
}

// 根据类别查询文章
exports.findCate = async (req, res, next) => {
    const { category, pagenum = 1, limit = 5 } = req.body
    if (!pagenum || pagenum < 1) return res.cc('页码数不能小于1')
    try {
        const [rows] = await db.query('select * from article where category = ? and is_delete = 0 LIMIT ?, ?', [category, (pagenum - 1) * limit, limit])
        const [count] = await db.query('select * from article where category = ? and is_delete = 0', [category])
        const data = rows.map(item => ({id: item.id, author: item.author, title:item.title, avatar: item.avatar,  category: item.category, browse: item.browse, count: item.count, comment: item.comment, introduce: item.introduce, section: item.section, time: item.time, cover: JSON.parse(item.cover)}))
        return res.send({
            status: 0,
            message: '获取类别查询文章',
            data,
            total: count.length,
            pagenum: pagenum,
            limit: limit
        })
    } catch (error) {
        next(error)
    }
}

// 更新头像
exports.updateAvatar = async(req, res, next) => {
    const { id } = req.user
    if (req.file) {
        const avatar = '/avatar/' + req.file.filename
        // 3. 执行SQL语句
        const sql = 'update user_admin set avatar = ? where id = ?'
        try {
            const [rows] = await db.query(sql, [avatar, id])
            if (rows.affectedRows !== 1) return res.cc('修改头像失败！')
            res.cc('修改头像成功', 0)
        } catch (error) {
            next(error)
        }
    }else{
        res.cc('请上传图片')
    }
}

// 搜索
exports.getSearch = async(req, res) => {
    const { search, pagenum = 1 } = req.query
    let count = (pagenum - 1) * 5
    const [ rows ] = await db.query(`select * from article where title like '%${search}%' and is_delete = 0 LIMIT ${count}, 5`)
    if(!rows.length) return res.cc('未搜索到数据')
    const data = rows.map(item => ({id: item.id, author: item.author, title:item.title, avatar: item.avatar,  category: item.category, browse: item.browse, count: item.count, comment: item.comment, introduce: item.introduce, section: item.section, time: item.time, cover: JSON.parse(item.cover)}))
    return res.send({
        status: 0,
        message: '搜索文章数据成功',
        data,
        total: rows.length,
        pagenum: pagenum,
        limit: 5
    })
}

// 搜索用户
exports.getUserSearch = async(req, res) => {
    const { search, pagenum = 1 } = req.query
    let count = (pagenum - 1) * 5
    const [ rows ] = await db.query(`select * from user where nickname like '%${search}%' LIMIT ${count}, 5`)
   const [length] = await db.query(`select * from user where nickname like '%${search}%'`)
    if(!rows.length) return res.cc('未搜索到用户')
    return res.send({
        status: 0,
        message: '搜索用户列表成功',
        data: rows,
        total: length.length,
        pagenum: pagenum,
        limit: 5
    })
}

// 更新用户信息
exports.UpdateUser = async(req, res, next) => {
    const sql = 'update user_admin set ? where id = ?'
    try {
        const [rows] = await db.query(sql, [req.body, req.user.id])
        if (rows.affectedRows !== 1) return res.cc('更新用户信息失败')
        res.cc('更新用户信息成功', 0)
    } catch (error) {
        next(error)
    }
}