const moment = require('moment')
var bcrypt = require('bcryptjs')

const con = require('../db/db.js')

const showLoginPage = (req, res) => {
    res.render('./user/login.ejs', {})
}
const showRegisterPage = (req, res) => {
    res.render('./user/register.ejs', {})
}
const userlogin = (req, res) => {
    var user = req.body
    var _password = user.password
    const sqlstr = 'select * from user where username=?'
    con.query(sqlstr, user.username, (err, result) => {
        if (err) return res.send({ msg: '用户查询失败', status: 502 })
        if (result.length == 0) return res.send({ msg: '该用户尚未注册', status: 500 })
            // var verifysign = crypto.createHash('md5').update(user.password, 'utf-8').digest("hex");
        bcrypt.compare(_password, result[0].password, function(err, r) {
            // res == true
            if (!r) return res.send({ msg: '密码错误，请重新输入', status: 500 })
            req.session.user = result[0]
            req.session.islogin = true
            return res.send({ msg: '登录成功', status: 200 })
        })
    })
}
const userRegister = (req, res) => {
    let user = req.body
    const sqlstr = 'select count(*) as count from user where username=?'
    con.query(sqlstr, user.username, (err, result) => {
        if (err) return res.send({ msg: '用户查重失败', status: 502 })
        if (result[0].count !== 0) return res.send({ msg: '用户名重复，请重新输入', status: 500 })
        user.ctime = moment().format()
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    const sqlstr2 = `insert into user set username='${user.username}',password='${hash}',nickname='${user.nickname}',ctime='${user.ctime}'`
                    con.query(sqlstr2, user, (err, result) => {
                        if (err) return res.send({ msg: '用户注册失败', status: 502 })
                        if (result.affectedRows !== 1) return res.send({ msg: '新用户注册失败', status: 505 })
                        return res.send({ msg: '新用户注册成功', status: 200 })
                    })
                });
            })
            // md5.update(user.password);
            // var sign = md5.digest('hex');
            // const sqlstr2 = `insert into user set username='${user.username}',password='${sign}',nickname='${user.nickname}',ctime='${user.ctime}'`
            // con.query(sqlstr2, (err, result) => {
            //     if (err) return res.send({ msg: err, status: 502 })
            //     if (result.affectedRows !== 1) return res.send({ msg: '新用户注册失败', status: 505 })
            //     return res.send({ msg: '新用户注册成功', status: 200 })
            // })
    })
}
const setPhoto=(req,res)=>{
    if(req.session.islogin){
//创建表单上传
var form = new formidable.IncomingForm();
//设置编辑
form.encoding = 'utf-8';
//设置文件存储路径
form.uploadDir = "venderors/temp";
//保留后缀
form.keepExtensions = true;
//设置单文件大小限制
form.maxFieldsSize = 2 * 1024 * 1024;
//form.maxFields = 1000;  设置所以文件的大小总和
form.parse(req, function (err, fields, files) {  
    // console.log(files.file.path);      
    res.send({msg:'ok',status:200,picAddr: files.file.path})
});}else{
    return res.redirect('/')
}
}

const imgCut=(req,res)=>{
    var id=req.params.id
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "venderors/profiles";
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function (err, fields, files) {  
        console.log(files.croppedImage); 
        // console.log(typeof(files.croppedImage));
        files.croppedImage.path=files.croppedImage.path.replace(/\\/g, '\/');
        const sqlstr=`update user set profileAddress='${files.croppedImage.path}' where id=${id}`   
        conn.query(sqlstr,(err,result)=>{
            if(err) return res.send({ msg: '失败', status: 502 })
            return res.redirect('/')
        })
    });
}

const logout = (req, res) => {
    req.session.destroy(function(err) {
        if (err) throw err;
        res.redirect('/');
    });
}

module.exports = {
    showLoginPage,
    showRegisterPage,
    userRegister,
    userlogin,
    setPhoto,
    imgCut,
    logout
}