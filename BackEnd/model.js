// Import mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Define User Schema to store user details
const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true }, // Google ID, unique identifier for each user from Google OAuth
    email: { type: String, required: true, unique: true }, // User's email address, must be unique
    name: { type: String, required: true }, // User's display name from Google profile
    profilePicture: { type: String } // URL of the user's profile picture from Google
});

// Define Memory Schema to store user memories (albums)
// Each memory is associated with a specific user and contains a title, description, and creation date
const memorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created this memory
    title: { type: String, required: true }, // Title of the memory/album, required field
    description: { type: String }, // Optional description of the memory
    createdAt: { type: Date, default: Date.now } // Date the memory was created, defaults to current date
});

// Define Comment Schema to store comments on memories
// Each comment is associated with a specific memory and user, and includes the comment text and creation date
const commentSchema = new mongoose.Schema({
    memoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Memory', required: true }, // Reference to the Memory this comment belongs to
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created the comment
    text: { type: String, required: true }, // The actual comment text, required field
    createdAt: { type: Date, default: Date.now } // Date the comment was created, defaults to current date
});

// Create models from schemas to interact with MongoDB collections
const User = mongoose.model('User', userSchema); // Model for User collection
const Memory = mongoose.model('Memory', memorySchema); // Model for Memory collection
const Comment = mongoose.model('Comment', commentSchema); // Model for Comment collection

// Export models to use in other parts of the application
module.exports = { User, Memory, Comment };
