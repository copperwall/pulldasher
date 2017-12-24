import * as mysql from 'mysql';
import config from '../config';
import * as Promise from 'promise';

var pool = mysql.createPool({
   host: config.mysql.host,
   database: config.mysql.db,
   user: config.mysql.user,
   password: config.mysql.pass
});

// If we ever want the old node-style callbacks we can uncomment this.
// pool.callback_query = pool.query

pool.query = Promise.denodeify(pool.query);

export default pool;
