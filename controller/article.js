const moment = require('moment')
const conn = require('../db/db')
const marked = require('marked')
const path=require('path')
const fs=require('fs')
var formidable = require('formidable')

const showAddPage = (req, res) => {
    if (req.session.islogin) {
        res.render('./article/add.ejs', {
            user: req.session.user,
            islogin: req.session.islogin
        })
    } else {
        return res.redirect('/')
    }
}
const showEditPage=(req,res)=>{
    if(req.session.islogin){
        const sqlstr='select * from article where id=?'
        conn.query(sqlstr,req.params.id,(err,result)=>{
            if(err) return res.redirect('/')
            if(result.length!==1) return res.redirect('/')
            res.render('./article/edit.ejs',{user:req.session.user,islogin:req.session.islogin,article:result[0]})
        })
    }
}
const editArticle=(req,res)=>{
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "venderors/music";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.parse(req, function (err, fields, files) { 
        // var oldpath = files.music.path;
        // var newpath = path.join(path.dirname(oldpath),files.music.name);       
        // fs.rename(oldpath,newpath,(err)=>{
        //     if(err) throw err;
        // })
        if (files.music) {
            files.music.path=files.music.path.replace(/\\/g, '\/');
            const sqlstr=`update article set title='${fields.title}',content='${fields.content}',music='${files.music.path}' where id=${fields.id}`   
            conn.query(sqlstr,(err,result)=>{
                if(err) return res.send({ msg: '修改文章失败', status: 502 })
                res.send({msg:'ok',status:200})
            })
        } else {           
            const sqlstr2=`update article set title='${fields.title}',content='${fields.content}' where id=${fields.id}`
            conn.query(sqlstr2,(err,result)=>{
                if(err) return res.send({ msg: '修改文章失败', status: 502 })
                res.send({msg:'ok',status:200})
            })
        }

    });
}
const addArticle = (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "venderors/music";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.parse(req, function (err, fields, files) { 
        fields.ctime = moment().format();
        if (files.music) {
            files.music.path=files.music.path.replace(/\\/g, '\/');
            const sqlstr=`insert into article set title='${fields.title}',content='${fields.content}',music='${files.music.path}',authorId=${fields.id},ctime='${fields.ctime}'`   
            conn.query(sqlstr,(err,result)=>{
                if(result.affectedRows !== 1) return res.send({ msg: '发表文章失败', status: 501 })
                res.send({msg:'发表文章成功',status:200,insertId: result.insertId})
            })
        } else {
            const sqlstr=`insert into article set title='${fields.title}',content='${fields.content}',authorId=${fields.id},ctime='${fields.ctime}'`   
            conn.query(sqlstr,(err,result)=>{
                if(result.affectedRows !== 1) return res.send({ msg: '发表文章失败', status: 501 })
                res.send({msg:'发表文章成功',status:200,insertId: result.insertId})
            })
        }
    });
    // const body = req.body
    //     // 如果在服务器端获取作者的Id，会有问题；如果文章编写了很长的时间，则 session 很可能会失效；
    // body.ctime = moment().format()
    // const sqlstr = 'insert into article set ?'
    // conn.query(sqlstr, body, (err, result) => {
    //     if (result.affectedRows !== 1) return res.send({ msg: '发表文章失败', ststus: 501 })
    //     res.send({ msg: '发表文章成功', status: 200, insertId: result.insertId })
    // })
}

const showArticleDetail = (req, res) => {
    const id = req.params.id
    const sqlstr = 'select * from article where id=?'
    conn.query(sqlstr, id, (err, result) => {
        if (err) return res.send({ msg: '获取文章详情失败！', status: 500 })
        if (result.length !== 1) res.redirect('/')
            // 在 调用 res.render 方法之前，要先把 markdown 文本，转为 html 文本
        const html = marked(result[0].content)
        result[0].content = html
        res.render('./article/info.ejs', { article: result[0], user: req.session.user, islogin: req.session.islogin })
    })
}

module.exports = {
    showAddPage,
    addArticle,
    showArticleDetail,
    showEditPage,
    editArticle
}