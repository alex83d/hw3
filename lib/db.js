const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./lib/file.json')
const db = lowdb(adapter)

module.exports = db
