const db = require('../config/db')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const config = require('../config')
const toolCode = require('../tool/code')
const { route } = require('../router/auth_admin')
// 登入
exports.login = async (req, res) => {
  const { phone, password } = req.body
  if (!phone || !password) return res.cc('手机号或密码不能为空！！！')
  const [rows] = await db.query('select * from user where phone = ?', phone)
  if (rows.length === 0) return res.cc('手机号或密码错误！！!')
  if (rows[0].password !== md5(password)) return res.cc('手机号或密码错误！！!')
  const [require] = await db.query('select * from user where phone = ? and is_delete = 1', [phone])
  if (require.length) return res.cc('该号已被禁用')
  const user = { ...rows[0], password: '' }
  const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
  res.cc('登入成功！', 0, { token })
}
// 注册
exports.reg = async (req, res, next) => {
  const { phone, password, code } = req.body
  if (!phone || !password) return res.cc('手机号或密码不能为空！')
  const [users] = await db.query('select * from user where phone = ?', phone)
  if (users.length) return res.cc('手机号已存在！！！')
  if (!toolCode.has(phone, code)) return res.cc('验证码失效')
  try {
    const connection = await db.getConnection()
    await connection.query('insert into user (phone, password) values (?, ?)', [phone, md5(password)])
    const [[{ lastID }]] = await connection.query(`SELECT LAST_INSERT_ID() as lastID`)
    const token = jwt.sign({
      phone,
      id: lastID
    }, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.cc('注册成功！！！', 0, { token })
  } catch (error) {
    next(error)
  }
}

// 验证码
exports.code = async (req, res) => {
  const { phone } = req.body
  if (!phone) return res.cc('手机号不能为空')
  const [users] = await db.query('select * from user where phone = ?', phone)
  if (users.length) return res.cc('手机号已存在！！')
  res.cc('发送验证码成功', 0, toolCode.add(phone))
}
