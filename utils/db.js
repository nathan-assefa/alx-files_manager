const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    // Retrieve MongoDB connection details from environment variables or use defaults
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    // Connection URL for MongoDB
    const url = `mongodb://${this.host}:${this.port}`;

    // Create a new MongoClient
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to MongoDB
    this.connect();
  }

  async connect() {
    try {
      // Connect to the MongoDB server
      await this.client.connect();

      // Select the database
      this.db = this.client.db(this.database);
    } catch (error) {
      console.error(error);
    }
  }

  isAlive() {
    // Check if the MongoDB client is connected
    return this.client.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.db.collection('users');
    const count = await usersCollection.countDocuments();
    return count;
  }

  async nbFiles() {
    const filesCollection = this.db.collection('files');
    const count = await filesCollection.countDocuments();
    return count;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
