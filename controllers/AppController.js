const RedisClient = require('../utils/redis');
const DBClient = require('../utils/db');

const AppController = {
  // Endpoint to check the status of Redis and the database
  getStatus: async (req, res) => {
    const redisAlive = RedisClient.isAlive();
    const dbAlive = DBClient.isAlive();

    const status = {
      redis: redisAlive,
      db: dbAlive,
    };

    return res.status(200).json(status);
  },

  // Endpoint to get statistics (number of users and files)
  getStats: async (req, res) => {
    try {
      const numUsers = await DBClient.nbUsers();
      const numFiles = await DBClient.nbFiles();

      const stats = {
        users: numUsers,
        files: numFiles,
      };

      return res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = AppController;
