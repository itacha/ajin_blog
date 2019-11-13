const express = require('express')
const app = express()

const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

var session = require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 // default session expiration is set to 1 hour
    },
}))

app.set('view engine', 'ejs')
app.set('views', './views')

app.use('/node_modules', express.static('./node_modules'))
app.use('/venderors', express.static('./venderors'))
// const router1 = require('./router/index.js')
// app.use(router1)
// const router2 = require('./router/user.js')
// app.use(router2)
//循环注册路由模块，不需要一个一个注册，readdir读取目录下的所有文件名，返回的是文件名数组
fs.readdir(path.join(__dirname, './router'), (err, filename) => {
    if (err) return console.log('读取router目录中的路由失败');
    filename.forEach(fname => {
        const router = require(path.join(__dirname, './router', fname))
        app.use(router)
    })
})

app.listen(80, function() {
    console.log('Express server running at http://127.0.0.1:80')
})