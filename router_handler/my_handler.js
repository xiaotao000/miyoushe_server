const db = require('../config/db')

// 获取我发布的帖子
exports.releaseArticle = async(req, res) => {
    const { id } = req.user
    console.log(id)
}

// 更新我的用户信息
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