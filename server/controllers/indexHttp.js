const query = require('../utils/db')

getDetail = async (ctx, next) => {
    // let data = req.query
    // console.log(data)
    let sql = "select * from detail";
    let sqlArr = [];
    const rows = await query(sql, sqlArr);
    ctx.body = {
        code: 200,
        list: rows
    }
}

getPostdata = async (ctx, next) => {
    let { id } = ctx;
    var sql = 'select * from detail where id = ?;select * from mall_index'
    var sqlArr = [id];
    try {
        const rows = await query(sql, sqlArr)
        const rows2 = await query('select * from mall_index where id = ?',rows[1][3].id)
        console.log(rows)
        ctx.body = {
            code: 200,
            list: rows
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getDetail,
    getPostdata
}