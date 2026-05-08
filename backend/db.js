const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

// Test the connection
client.connect()
  .then(() => console.log("Connected:", client.db().databaseName))
  .catch(err => console.error("Connection error:", err));

module.exports = client;
