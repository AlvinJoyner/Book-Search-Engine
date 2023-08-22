// Import necessary modules
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Helper function to handle authentication and throw error if user is not authenticated
const handleAuthentication = async (user, errorMessage) => {
  if (!user) throw new AuthenticationError(errorMessage);
};

// Define resolvers
const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      // Ensure user is authenticated, or throw an error
      await handleAuthentication(user, "Not logged in");
      // Retrieve user data and filter out sensitive information
      return User.findById(user._id).select('-__v -password');
    },
  },

  Mutation: {
    addUser: async (_, args) => {
      // Create a new user and generate a token
      const user = await User.create(args);
      return { token: signToken(user), user };
    },

    login: async (_, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });
      // Ensure user exists, or throw an error
      await handleAuthentication(user, "User not found.");
      // Check password correctness, or throw an error
      if (!(await user.isCorrectPassword(password))) throw new AuthenticationError("Incorrect credentials");
      // Generate token and return user data
      return { token: signToken(user), user };
    },

    saveBook: async (_, { bookData }, { user }) => {
      // Ensure user is authenticated, or throw an error
      await handleAuthentication(user, "You need to be logged in!");
      // Add book data to user's savedBooks and return updated user
      return User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      );
    },

    removeBook: async (_, { bookId }, { user }) => {
      // Ensure user is authenticated, or throw an error
      await handleAuthentication(user, "You need to be logged in!");
      // Remove book data from user's savedBooks and return updated user
      return User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

// Export the resolvers
module.exports = resolvers;
