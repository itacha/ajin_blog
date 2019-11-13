const express = require('express')
const router = express.Router()
const path=require('path')
const conn = require('../db/db.js')

var formidable = require('formidable')
var uuid = require('node-uuid')
const fs = require('fs')

const controller = require('../controller/user')
router.get('/login', controller.showLoginPage)
router.get('/register', controller.showRegisterPage)
router.post('/register', controller.userRegister)
router.post('/login', controller.userlogin)
router.get('/logout', controller.logout)
router.get('/photo',(req,res)=>{
    res.render('./user/photoSet.ejs',{
        user: req.session.user,
        islogin: req.session.islogin
    })
    // res.sendFile(path.join(__dirname, '../views/user/photoSet.html'))
})
router.post('/photo',controller.setPhoto)
router.post('/imgCut/:id',controller.imgCut)
module.exports = router