const {ConnectionString} = require('connection-string');
const con = new ConnectionString(process.env.DB_URL);


module.exports = require('knex')({
    client: 'mysql2',
    connection: {
        host : con.hosts[0].name,
        port : con.hosts[0].port,
        user : con.user,
        password : con.password,
        database : con.path[0]
    }
});