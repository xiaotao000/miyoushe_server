const express = require('express')
const cors = require('cors')
const expressJWT = require('express-jwt')
const { port, jwtSecretKey } = require('./config')
const Joi = require('joi')

const app = express()

app.use('/upload', express.static('./uploads'))

app.use('/avatar', express.static('./avatar'))

// 解决跨域
app.use(cors())

// 解决post请求参数
app.use(express.urlencoded({
    extended: false
}))

app.use(express.json())

app.use((req, res, next) => {
    // 封装响应函数
    res.cc = function (message = '请求成功', status = 1, data = []) {
        res.send({
            status,
            message: message instanceof Error ? message.message : message,
            data
        })
    }
    // 放行请求
    next()
})
/
// 解析token 并设置拦截
// authorization Bearer
app.use(expressJWT({ secret: jwtSecretKey, algorithms: ["HS256"] }).unless({ path: /^\/(upload)|(api)\// }))
// 不需要权限验证 /api
app.use('/api', [require('./router/home'), require('./router/auth'), require('./router/article'), require('./router/auth_admin')])
// 需要权限验证 /my
app.use('/my', [require('./router/my'), require('./router/user'), require('./router/upload'), require('./router/user_admin')])

// 统一处理404路由
app.use((req, res) => {
    res.cc('该api未开发')
})

app.use((error, req, res, next) => {
    // 判断错误类型是否为校验错误
    if (error instanceof Joi.ValidationError) return res.cc(error.message)
    // 判断错误类型是否为token解析错误
    if (error.name === 'UnauthorizedError') return res.cc('token失效或错误')
    console.log(error)
    // 判断错误类型
    res.cc(error)
})

app.listen(port, () => {
    console.log(`server running ... address:http://172.19.10.137:${port}`)
})