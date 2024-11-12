// Import models to interact with database collections
const { User, Memory, Comment } = require('./models');

// Function to handle Google login by finding or creating a user in the database
// Takes Google profile data as input
async function handleGoogleLogin(googleProfile) {
    try {
        // Check if a user with the given Google ID already exists in the database
        let user = await User.findOne({ googleId: googleProfile.id });
        
        // If the user does not exist, create a new user
        if (!user) {
            user = new User({
                googleId: googleProfile.id, // Unique Google ID from OAuth
                email: googleProfile.emails[0].value, // Primary email from Google profile
                name: googleProfile.displayName, // Display name from Google profile
                profilePicture: googleProfile.photos[0].value // Profile picture URL from Google profile
            });
            await user.save(); // Save the new user in the database
        }
        
        return user; // Return the existing or new user
    } catch (error) {
        console.error('Error handling Google login:', error); // Log any errors that occur
        throw error; // Throw error to be handled by the caller
    }
}

// Function to retrieve a user by their Google ID
// Used during the authentication process to fetch user data based on Google ID
async function getUserByGoogleId(googleId) {
    try {
        return await User.findOne({ googleId }); // Find and return user by Google ID
    } catch (error) {
        console.error('Error retrieving user:', error); // Log any errors that occur
        throw error; // Throw error to be handled by the caller
    }
}

// Function to retrieve all memories created by a specific user
// Takes the user's ID as input and returns a list of memories sorted by creation date (newest first)
async function getMemoriesByUserId(userId) {
    try {
        return await Memory.find({ userId }).sort({ createdAt: -1 }); // Sort memories in descending order of creation date
    } catch (error) {
        console.error('Error retrieving memories:', error); // Log any errors that occur
        throw error; // Throw error to be handled by the caller
    }
}

// Function to retrieve all comments for a specific memory
// Takes memory ID as input and returns comments with user details populated, sorted by creation date (newest first)
async function getCommentsByMemoryId(memoryId) {
    try {
        // Populate 'userId' field with 'name' and 'profilePicture' fields from the User model
        return await Comment.find({ memoryId })
            .populate('userId', 'name profilePicture') // Populate user details
            .sort({ createdAt: -1 }); // Sort comments in descending order of creation date
    } catch (error) {
        console.error('Error retrieving comments:', error); // Log any errors that occur
        throw error; // Throw error to be handled by the caller
    }
}

// Export functions to use in other parts of the application
module.exports = {
    handleGoogleLogin,
    getUserByGoogleId,
    getMemoriesByUserId,
    getCommentsByMemoryId
};
