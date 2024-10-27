const { User, Memory, Comment } = require('./models');

// Function to handle Google login
async function handleGoogleLogin(googleProfile) {
  try {
    let user = await User.findOne({ googleId: googleProfile.id });
    
    if (!user) {
      user = new User({
        googleId: googleProfile.id,
        email: googleProfile.emails[0].value,
        name: googleProfile.displayName,
        profilePicture: googleProfile.photos[0].value
      });
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Error handling Google login:', error);
    throw error;
  }
}

// Function to retrieve a user by Google ID
async function getUserByGoogleId(googleId) {
  try {
    return await User.findOne({ googleId });
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw error;
  }
}

// Function to retrieve memories for a specific user
async function getMemoriesByUserId(userId) {
  try {
    return await Memory.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error retrieving memories:', error);
    throw error;
  }
}

// Function to retrieve comments for a specific memory
async function getCommentsByMemoryId(memoryId) {
  try {
    return await Comment.find({ memoryId })
      .populate('userId', 'name profilePicture')
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error retrieving comments:', error);
    throw error;
  }
}

module.exports = {
  handleGoogleLogin,
  getUserByGoogleId,
  getMemoriesByUserId,
  getCommentsByMemoryId
};
