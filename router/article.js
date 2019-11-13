const express = require('express')
const router = express.Router()

const controller = require('../controller/article')

router.get('/article/add', controller.showAddPage)
router.post('/article/add', controller.addArticle)
router.get('/article/edit/:id',controller.showEditPage)
router.post('/article/edit',controller.editArticle)
router.get('/article/info/:id', controller.showArticleDetail)

module.exports = router