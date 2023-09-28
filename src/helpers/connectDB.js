const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'doan2',
});
conn.on('connected', function () {
  console.log('mongodb connection DATABASE:: ' + this.name);
});
conn.on('disconnected', function () {
  console.log('mongodb disconnected :: ' + this.name);
});
conn.on('error', function (error) {
  console.log('mongodb error :: ' + error);
});

process.on('SIGINT', async function () {
  await conn.close();
  process.exit(0);
});

module.exports = conn;
