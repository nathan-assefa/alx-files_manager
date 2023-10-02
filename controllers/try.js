const sha1 = require('sha1');
const DBClient = require('../utils/db');

const UsersController = {
  // POST /users endpoint for creating users
  postNew: async (req, res) => {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Check if the email or password is missing
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the database
    const userExists = await DBClient.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: 'Already exists' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user object
    const newUser = {
      email,
      password: hashedPassword,
    };

    try {
      // Insert the new user into the database
      const insertedUser = await DBClient.createUser(newUser);

      // Return the new user's email and id
      return res.status(201).json({ email: insertedUser.email, id: insertedUser._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UsersController;
