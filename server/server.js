// Import required dependencies
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { myAuthMiddleware } = require('./utils/auth');

// Define a custom port or use the default port 3001
const MY_PORT = process.env.PORT || 3001;

// Create an instance of Express named myApp
const myApp = express();

// Create an instance of Apollo Server named myServer
const myServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: myAuthMiddleware, // Use custom authentication middleware
});

// Middleware for parsing request bodies
myApp.use(express.urlencoded({ extended: true }));
myApp.use(express.json());

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  myApp.use(express.static(path.join(__dirname, '../client/build')));
}

// Route to serve the main HTML file
myApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Function to start the Apollo Server
const startMyApolloServer = async () => {
  await myServer.start(); // Start the Apollo Server
  myServer.applyMiddleware({ app: myApp }); // Apply Apollo Server middleware to the Express app

  // Open the database connection
  db.once('open', () => {
    // Start the Express app on the custom port
    myApp.listen(MY_PORT, () => {
      console.log(`App server running on port ${MY_PORT}!`);
      console.log(`Use GraphQL at http://localhost:${MY_PORT}${myServer.graphqlPath}`);
    });
  });
};

// Call the function to start the Apollo Server and Express app
startMyApolloServer();
