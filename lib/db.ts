import * as mysql from 'mysql';
import config from '../config';
import * as Promise from 'bluebird';

const pool = mysql.createPool({
   host: config.mysql.host,
   database: config.mysql.db,
   user: config.mysql.user,
   password: config.mysql.pass
});

pool.query = Promise.promisify(pool.query);

export default pool;
