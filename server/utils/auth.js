const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Exported module
module.exports = {
  // Custom authentication middleware function
  customAuthMiddleware: function ({ req }) {
    let authToken = req.headers['x-custom-auth-token'];

    if (!authToken) {
      return req;
    }

    try {
      const decodedToken = customVerifyToken(authToken); // Custom token verification function
      req.userInfo = decodedToken.data;
    } catch (error) {
      console.error('Invalid custom token:', error.message);
    }

    return req;
  },

  // Function for signing a token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

// Custom token verification function
function customVerifyToken(token) {
  // Implement your custom token verification logic here
  // Return an object with { isValid, data } where "isValid" indicates token validity
  // and "data" contains user information from the token
  // Example: return { isValid: true, data: { userId: '123', role: 'user' } }
}
