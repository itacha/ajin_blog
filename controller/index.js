const conn = require('../db/db.js')
const showIndexPage = (req, res) => {
    // 每页显示3条数据
    const pagesize = 10
    const nowpage = Number(req.query.page) || 1
  
    const sql = `select a.content,DATE_FORMAT(a.ctime,'%Y-%m-%d %H:%i:%S') as ctime,a.id,a.title,a.music,u.username,u.profileAddress from article a INNER JOIN user u on a.authorId=u.id ORDER BY a.ctime desc limit ${(nowpage - 1) * pagesize}, ${pagesize};select count(*)as count from article`
    conn.query(sql, (err, result) => {
      if (err) {
        return res.render('index.ejs', {
          user: req.session.user,
          islogin: req.session.islogin,
          articles: []
        })
      }
      // 总页数
      const totalPage = Math.ceil(result[1][0].count / pagesize)
      res.render('index.ejs', {
        user: req.session.user,
        islogin: req.session.islogin,
        articles: result[0],
        // 总页数
        totalPage: totalPage,
        // 当前展示的是第几页
        nowpage: nowpage
      })
    })
  }
module.exports = {
    showIndexPage
}