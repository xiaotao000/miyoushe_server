const db = require('../config/db')

// 轮播图
exports.getRotation = async(req, res) => {
    const [ rows ] =  await db.query('select * from rotation order by serial desc limit 0, 5')
    if(!rows.length) return res.cc('获取轮播图失败')
    res.cc('获取轮播图成功', 0, rows)
}

// 类型
exports.getCategory = async(req, res) => {
    const [ rows ] =  await db.query('select * from category')
    if(!rows.length) return res.cc('获取类型失败')
    res.cc('获取类型成功', 0, rows)
}

// 获取文章分类列表
exports.getArticleList = async(req, res) => {
    const { category, pagenum = 1 } = req.query
    if(category) {
        const sql = 'select * from article where category = ? and is_delete = 0'
        const [ rows ] = await db.query(sql, [category])
        if(!rows.length) return res.cc('获取文章分类列表失败')
        const arr = rows.map(item => ({ ...item, cover: JSON.parse(item.cover)}))
        res.cc('获取文章列表成功', 0, arr)
    } else {
        const sql = 'SELECT * FROM `article` WHERE  category = "同人图" AND is_delete = 0 or category = "官方" AND is_delete = 0 or category = "硬核" AND is_delete = 0 or category = "酒馆" AND is_delete = 0 ORDER BY RAND() LIMIT ?, 10'
        const [ rows ] = await db.query(sql, [(pagenum - 1) * 10])
        if(!rows.length) return res.cc('获取文章别表失败')
        const arr = rows.map(item => ({id: item.id, author: item.author, title:item.title, avatar: item.avatar,  category: item.category, browse: item.browse, count: item.count, comment: item.comment, introduce: item.introduce, time: item.time, section: item.section, cover: JSON.parse(item.cover)}))
        res.cc('获取文章列表成功', 0, arr)
    }
}
// 获取文章详情
exports.getArticleDetails= async(req, res) => {
    const sql = 'select * from article where id = ? and is_delete = 0'
    const [ rows ] = await db.query(sql, req.query.id)
    // await db.query(`update article set browse = ${ rows[0].browse + 1} where id = ?`, req.query.id)
    if(!rows.length) return res.cc('获取文章详情失败')
    rows[0].cover = JSON.parse(rows[0].cover)
    res.cc('获取文章详情成功', 0, rows)
}

// 获取推荐用户
exports.getAuthor = async(req, res) => {
    const sql = 'select id, nickname, avatar, gender, autograph from user ORDER BY RAND( )limit 1, 5'
    const [ rows ] = await db.query(sql)
    if(!rows.length) return res.cc('获取推荐用户失败')
    res.cc('获取推荐用户成功', 0, rows)
}

// 获取推荐话题
exports.getSubject = async(req, res) => {
    const sql = 'select id, avatar, section from article where section !="" AND is_delete = 0 ORDER BY RAND( )limit 1, 5'
    const [ rows ] = await db.query(sql)
    if(!rows.length) return res.cc('获取推荐话题失败')
    res.cc('获取推荐话题成功', 0, rows)
}

// 搜索
// select * from article where title like '%1%'
exports.getSearch = async(req, res) => {
    const { search } = req.query
    const [ rows ] = await db.query(`select id, author, title, avatar, cover, category, browse, count, comment, introduce, section, time from article where title like '%${search}%' and is_delete = 0`)
    if(!rows.length) return res.cc('未搜索到数据')
    const arr = rows.map(item => ({id: item.id, author: item.author, title:item.title, avatar: item.avatar,  category: item.category, browse: item.browse, count: item.count, comment: item.comment, introduce: item.introduce, section: item.section, time: item.time, cover: JSON.parse(item.cover)}))
    res.cc('搜索成功！！！', 0, arr)
}


// 上传封面图
exports.cover  = async(req, res) => {
    if (!req.files) return res.cc('请上传图片')
    const avatarList = req.files.map(item => ({ imgUrl: '/upload/' + item.filename, name: item.originalname}))
    res.cc('上传封面图成功', 0, avatarList)
}