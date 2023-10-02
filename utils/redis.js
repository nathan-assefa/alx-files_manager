const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Handle Redis client errors
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error}`);
    });
  }

  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  // Get a value from Redis by key
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return await getAsync(key);
  }

  // Set a key-value pair in Redis with an optional expiration (in seconds)
  async set(key, value, duration) {
    if (duration) {
      return await promisify(this.client.set).bind(this.client)(key, value, 'EX', duration);
    } else {
      return await promisify(this.client.set).bind(this.client)(key, value);
    }
  }

  // Delete a key from Redis
  async del(key) {
    return await promisify(this.client.del).bind(this.client)(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();

module.exports = redisClient;
