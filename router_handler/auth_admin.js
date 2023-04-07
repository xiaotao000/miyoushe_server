const db = require('../config/db')
const jwt = require('jsonwebtoken')
const config = require('../config')
const res = require('express/lib/response')

// 登入
exports.adminLogin = async (req, res) => {
    const {
        username,
        password
    } = req.body
    const [rows] = await db.query(`select * from user_admin where nickname = '${username}'`)
    if (rows.length === 0) return res.cc('用户名或密码错误！')
    if (rows[0].password !== password) return res.cc('用户名或密码错误！')
    const user = {
        ...rows[0],
        password: ''
    }
    const token = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: config.expiresIn
    })
    res.cc('登录成功', 0, {
        token
    })
}

// 获取用户列表
exports.getUserList = async (req, res) => {
    const {
        pagenum = 1, limit = 5
    } = req.query
    const sql = 'select id, nickname, avatar, is_delete from user limit ?, ?'
    const [rows] = await db.query(sql, [(pagenum - 1) * limit, Number(limit)])
    const [count] = await db.query('select * from user')
    if (!rows.length) return res.cc('获取用户信息列表失败')
    return res.send({
        status: 0,
        message: '获取用户列表成功',
        data: rows,
        total: count.length,
        pagenum: Number(pagenum),
        limit: Number(limit)
    })
}

// 新增用户
exports.adminAddUser = async (req, res, next) => {
    const {
        username,
        password
    } = req.body
    if (!username || !password) return res.cc('手机号或密码不能为空！')
    const [users] = await db.query('select * from user_admin where nickname = ?', username)
    if (users.length) return res.cc('用户已存在！！！')
    try {
        await db.query('insert into user_admin (nickname, password) values (?, ?)', [username, password])
        res.cc('新增成功', 0, )
    } catch (error) {
        next(error)
    }
}

// 删除用户
exports.removeUser = async (req, res) => {
    const {
        id
    } = req.params
    const [result] = await db.query('select * from user where id = ?', id)
    if (!result.length) return res.cc('id有误')
    if (result[0].is_delete == 0) {
        const [rows] = await db.query('update user set is_delete = 1 where id = ?', id)
        if (rows.affectedRows !== 1) return res.cc('删除失败')
        res.cc('封号成功', 0)
    } else {
        const [rows] = await db.query('update user set is_delete = 0 where id = ?', id)
        if (rows.affectedRows !== 1) return res.cc('删除失败')
        res.cc('解封成功', 0)
    }
}

// 新增轮播
exports.addRotation = async (req, res, next) => {
    const [count] = await db.query('select * from rotation')
    const sql = 'insert into rotation set ?'
    const data = {
        ...req.body,
        serial: count.length + 1
    }
    try {
        const [rows] = await db.query(sql, data)
        if (rows.affectedRows !== 1) return res.cc('新增失败')
        res.cc('新增成功', 0)
    } catch (error) {
        res.cc('新增失败')
    }
}

// 修改轮播
exports.updateRotation = async (req, res) => {
    const {
        id
    } = req.params
    const sql = 'update rotation set ? where id = ' + id
    try {
        const [rows] = await db.query(sql, req.body)
        if (rows.affectedRows !== 1) return res.cc('更新轮播图成功！！！')
        res.cc('更新轮播图成功！！！', 0)
    } catch (error) {
        res.cc('更新失败')
    }
}

exports.removeRotation = async (req, res) => {
    const { id } = req.params
    const [result] = await db.query('select * from rotation where id = ?', [id])
    if (!result.length) return res.cc('id有误')
    const [rows] = await db.query('delete from rotation where id = ?', [id])
    if (rows.affectedRows !== 1) return res.cc('删除失败')
    res.cc('删除成功', 0)
}