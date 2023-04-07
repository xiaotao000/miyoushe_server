const express = require('express')
const home_handler = require('../router_handler/home_handler')
const router = express.Router()


router.get('/home/app-article', home_handler.getArticleList)

module.exports = router
