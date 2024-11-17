// Import models to interact with database collections
const { User, Memory, Comment, Person } = require('./model');

// Function to retrieve a user by their Google ID
// This is used for session deserialization in Passport.js
async function getUserByGoogleId(googleId) {
    try {
        // Find the user in the database using their Google ID
        return await User.findOne({ googleId });
    } catch (error) {
        console.error('Error retrieving user by Google ID:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to handle Google login
// Finds or creates a user in the database based on their Google profile
async function handleGoogleLogin(googleProfile) {
    try {
        let user = await User.findOne({ googleId: googleProfile.id });
        if (!user) {
            // If the user does not exist, create a new one
            user = new User({
                googleId: googleProfile.id,
                email: googleProfile.emails[0].value,
                name: googleProfile.displayName,
                profilePicture: googleProfile.photos[0].value
            });
            await user.save();
        }
        return user; // Return the existing or newly created user
    } catch (error) {
        console.error('Error handling Google login:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to retrieve all people created by a user
async function getPeopleByUserId(userId) {
    try {
        return await Person.find({ userId }); // Find all people linked to the user
    } catch (error) {
        console.error('Error retrieving people:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to create a new person
async function createPerson(userId, name, profilePicture) {
    try {
        const person = new Person({ userId, name, profilePicture });
        await person.save();
        return person; // Return the created person
    } catch (error) {
        console.error('Error creating person:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to edit an existing person's details
async function editPerson(personId, updates) {
    try {
        return await Person.findByIdAndUpdate(personId, updates, { new: true }); // Return the updated person
    } catch (error) {
        console.error('Error editing person:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to delete a person and their associated data
async function deletePerson(personId) {
    try {
        const memories = await Memory.find({ personId }); // Find all memories linked to the person
        const memoryIds = memories.map(mem => mem._id); // Extract memory IDs
        await Memory.deleteMany({ personId }); // Delete all linked memories
        await Comment.deleteMany({ memoryId: { $in: memoryIds } }); // Delete all comments for those memories
        return await Person.findByIdAndDelete(personId); // Delete the person record
    } catch (error) {
        console.error('Error deleting person:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to delete a memory and its associated comments
async function deleteMemory(memoryId) {
    try {
        await Comment.deleteMany({ memoryId }); // Delete all comments linked to the memory
        return await Memory.findByIdAndDelete(memoryId); // Delete the memory itself
    } catch (error) {
        console.error('Error deleting memory:', error);
        throw error; // Propagate the error to the caller
    }
}

// Export all functions for use in other parts of the application
module.exports = {
    getUserByGoogleId,
    handleGoogleLogin,
    getPeopleByUserId,
    createPerson,
    editPerson,
    deletePerson,
    deleteMemory
};
