// Import mongoose library for database modeling
const mongoose = require('mongoose');

// User Schema: Represents the user logging in through Google OAuth
const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true }, // Unique Google ID for the user
    email: { type: String, required: true, unique: true }, // Email address of the user
    name: { type: String, required: true }, // Display name of the user
    profilePicture: { type: String } // Profile picture URL from Google profile
});

// Memory Schema: Represents memories (albums) uploaded by users
const memorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link memory to a specific user
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' }, // Optional link to a person this memory belongs to
    title: { type: String, required: true }, // Title of the memory
    description: { type: String }, // Optional description of the memory
    createdAt: { type: Date, default: Date.now } // Timestamp when the memory was created
});

// Comment Schema: Represents comments on memories
const commentSchema = new mongoose.Schema({
    memoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Memory', required: true }, // Link comment to a memory
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link comment to the user who created it
    text: { type: String, required: true }, // Text of the comment
    createdAt: { type: Date, default: Date.now } // Timestamp when the comment was created
});

// Person Schema: Represents "people" associated with a user's memories
const personSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link person to a specific user
    name: { type: String, required: true }, // Name of the person
    profilePicture: { type: String }, // Profile picture URL for the person
    createdAt: { type: Date, default: Date.now } // Timestamp when the person was created
});

// Models for interacting with the respective collections in MongoDB
const User = mongoose.model('User', userSchema);
const Memory = mongoose.model('Memory', memorySchema);
const Comment = mongoose.model('Comment', commentSchema);
const Person = mongoose.model('Person', personSchema);

// Export the models to use them in other parts of the application
module.exports = { User, Memory, Comment, Person };
