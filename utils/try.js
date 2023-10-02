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
    const value = await getAsync(key);
    return value;
  }

  // Set a key-value pair in Redis with an optional expiration (in seconds)
  async set(key, value, duration) {
    if (duration) {
      const setPromisify = promisify(this.client.set).bind(this.client);
      const response = await setPromisify(key, value, 'EX', duration);
      return response;
    }
    const setPromisifyWithoutDuration = promisify(this.client.set).bind(this.client);
    const response = await setPromisifyWithoutDuration(key, value);
    return response;
  }

  // Delete a key from Redis
  async del(key) {
    const delPromisify = promisify(this.client.del).bind(this.client);
    const response = await delPromisify(key);
    return response;
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();

module.exports = redisClient;
