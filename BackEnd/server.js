// Import required modules
const express = require('express');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const {
    createPerson,
    getPeopleByUserId,
    editPerson,
    deletePerson,
    deleteMemory,
    handleGoogleLogin,
    getUserByGoogleId
} = require('./dbFunctions');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Configure multer for handling file uploads

// Middleware to parse JSON requests and manage sessions
app.use(express.json());
app.use(session({
    secret: 'your_session_secret', // Secret key for signing session cookies
    resave: false, // Prevent resaving sessions if not modified
    saveUninitialized: true // Allow uninitialized sessions to be saved
}));
app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Enable session handling for Passport

// Google authentication strategy setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth client secret from environment variables
    callbackURL: "http://localhost:3000/auth/google/callback" // URL to redirect to after Google login
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Function to handle Google login and find or create user in the database
        const user = await handleGoogleLogin(profile);
        done(null, user); // Successful login, pass user to done callback
    } catch (error) {
        done(error, null); // If an error occurs, pass error to done callback
    }
}));

// Serialize user to session: converts user object to user ID
passport.serializeUser((user, done) => done(null, user.googleId));

// Deserialize user from session: retrieves full user info using user ID
passport.deserializeUser(async (googleId, done) => {
    try {
        const user = await getUserByGoogleId(googleId); // Retrieve user from database by Google ID
        done(null, user); // Pass retrieved user object to done callback
    } catch (error) {
        done(error, null); // Handle errors during deserialization
    }
});

// Middleware to ensure the user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized'); // Block unauthenticated users
    }
    next(); // Allow access if authenticated
}

// Route: Initiate Google login
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route: Handle Google login callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard'); // Redirect to the dashboard after successful login
});

// Route: Dashboard page
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.name}! <a href="/people">View People</a> | <a href="/logout">Logout</a>`);
});

// Route: Logout user
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/'); // Redirect to the homepage after logout
    });
});

// Route: Homepage
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard'); // Redirect authenticated users to the dashboard
    }
    res.send('<a href="/auth/google">Login with Google</a>'); // Show login link for unauthenticated users
});

// Route to create a new person
app.post('/createPerson', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const userId = req.user._id; // Retrieve logged-in user ID
        const { name } = req.body; // Extract name from request body
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // Save uploaded profile picture
        const person = await createPerson(userId, name, profilePicture); // Create person
        res.json(person); // Respond with created person data
    } catch (error) {
        res.status(500).send('Error creating person'); // Handle errors
    }
});

// Route to edit an existing person
app.put('/editPerson/:personId', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const { personId } = req.params; // Extract person ID from route parameters
        const updates = {
            name: req.body.name, // Update name if provided
            ...(req.file && { profilePicture: `/uploads/${req.file.filename}` }) // Update profile picture if provided
        };
        const person = await editPerson(personId, updates); // Update person details
        res.json(person); // Respond with updated person data
    } catch (error) {
        res.status(500).send('Error editing person'); // Handle errors
    }
});

// Route to retrieve all people created by the logged-in user
app.get('/people', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id; // Retrieve logged-in user ID
        const people = await getPeopleByUserId(userId); // Fetch people
        res.json(people); // Respond with people data
    } catch (error) {
        res.status(500).send('Error retrieving people'); // Handle errors
    }
});

// Route to delete a person and all associated data
app.delete('/deletePerson/:personId', isAuthenticated, async (req, res) => {
    try {
        const { personId } = req.params; // Extract person ID
        await deletePerson(personId); // Delete person and associated data
        res.send(`Person with ID ${personId} deleted`); // Confirm deletion
    } catch (error) {
        res.status(500).send('Error deleting person'); // Handle errors
    }
});

// Route to delete a memory and associated comments
app.delete('/deleteMemory/:memoryId', isAuthenticated, async (req, res) => {
    try {
        const { memoryId } = req.params; // Extract memory ID
        await deleteMemory(memoryId); // Delete memory and associated comments
        res.send(`Memory with ID ${memoryId} deleted`); // Confirm deletion
    } catch (error) {
        res.status(500).send('Error deleting memory'); // Handle errors
    }
});

// Start the server
const port = 3000; // Define the server port
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
