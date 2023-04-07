const express = require('express')
const my_handler = require('../router_handler/my_handler')
const router = express.Router()


router.get('/release/article', my_handler.releaseArticle)

router.post('/update/userinfo',  my_handler.setUserInfo)


module.exports = router
