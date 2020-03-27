require('dotenv').config({path:__dirname + '../.env'})
const { Client } = require('pg')
// refactor to generalise
class DbConn {
  constructor() {
    this.port = process.env.DB_PORT || 5432;
    
    if (process.env.NODE_ENV == 'test'){
      this.user = process.env.DB_USER_LOCAL || "postgres";
      this.db_name = process.env.TEST_DB_NAME;
      this.db_ip = 'localhost'
      this.uri = `postgres://${this.user}@${this.db_ip}:${this.port}/${this.db_name}`;
      this.client = new Client(this.uri)
    } else if (process.env.NODE_ENV == 'development') {
      this.user = process.env.DB_USER_LOCAL || "postgres";
      this.db_name = process.env.DB_NAME;
      this.db_ip = 'localhost'
      this.uri = `postgres://${this.user}@${this.db_ip}:${this.port}/${this.db_name}`;
      this.client = new Client(this.uri)
    } else if (process.env.NODE_ENV == 'production') {
      this.config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: 5432
      }
      this.client = new Client(this.config)
    } else {
      throw new Error('config not present, check NODE_ENV')
    }
  }

  async start() {
    try {
      await this.client.connect()
    } catch (err) {
      console.error(err.message)
    }
  }

  async close() {
    try {
      await this.client.end()
    } catch (err) {
      console.error(err.message)
    }
  }

  async query(query) {
    try {
      await this.start()
      let result =  await this.client.query(query)
      await this.close()
      return result
    } catch (err) {
      console.error(err.message)
      return []
    }
  }
}

module.exports = DbConn;