const db = require("../config/db");

// 分类
exports.getArticleList = async (req, res) => {
  const { category, pagenum = 1 } = req.query;
  if (category) {
    const sql =
      "select * from article where category = ? and is_delete = 0 limit ?, 10";
    const sql2 = await db.query(
      "SELECT COUNT(count) as count FROM article where category = ? and is_delete = 0",
      category
    );
    const [rows] = await db.query(sql, [category, (pagenum - 1) * 10]);
    if (!rows.length) return res.cc("获取文章分类列表失败");
    const arr = rows.map((item) => ({
      ...item,
      cover: JSON.parse(item.cover),
    }));
    const data = {
      data: arr,
      pageSize: Number(pagenum),
      totalCount: sql2[0][0].count,
      totalPage: Math.ceil(sql2[0][0].count / 10),
    };
    res.cc("获取文章列表成功", 0, data);
  } else {
    const sql =
      'SELECT * FROM `article` WHERE  category = "同人图" AND is_delete = 0 or category = "官方" AND is_delete = 0 or category = "硬核" AND is_delete = 0 or category = "酒馆" AND is_delete = 0 ORDER BY RAND() LIMIT ?, 10';
      const sql2 = await db.query("SELECT COUNT(count) as count FROM article where category = '同人图' OR category = '攻略' or category = '硬核' and is_delete = 0");
      const [rows] = await db.query(sql, [(pagenum - 1) * 10]);
    if (!rows.length) return res.cc("获取文章别表失败");
    const arr = rows.map((item) => ({
      ...item,
      cover: JSON.parse(item.cover),
    }));
    const data = {
        data: arr,
        pageSize: Number(pagenum),
        totalCount: sql2[0][0].count,
        totalPage: Math.ceil(sql2[0][0].count / 10),
      }
    res.cc("获取文章列表成功", 0, data);
  }
};
