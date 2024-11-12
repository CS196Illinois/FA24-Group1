// Import required modules
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { handleGoogleLogin, getMemoriesByUserId, getUserByGoogleId } = require('./dbFunctions');
const { User, Memory, Comment } = require('./models'); // Import database models
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Initialize Express application

// Middleware setup
app.use(express.json()); // Middleware to parse JSON requests
app.use(session({
    secret: 'your_session_secret', // Secret key to sign session ID cookies, should be secured in production
    resave: false, // Prevents session resaving if nothing changed
    saveUninitialized: true // Allows saving uninitialized sessions
}));
app.use(passport.initialize()); // Initialize Passport for authentication handling
app.use(passport.session()); // Enable persistent login sessions

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
    const user = await getUserByGoogleId(googleId); // Retrieve user from database by Google ID
    done(null, user); // Pass retrieved user object to done callback
});

// Route to initiate Google login flow
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google login completes
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Redirect to list of people (albums) after successful authentication
    res.redirect('/listOfPeople');
});

// Route to display a list of people who have created albums (memories)
// This route represents the "listOfPeople" page where users see all other users with albums
app.get('/listOfPeople', async (req, res) => {
    // Ensure the user is authenticated before allowing access
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized'); // Send Unauthorized status if user is not authenticated
    }

    try {
        // Retrieve all users and select only their names and profile pictures
        const users = await User.find().select('name profilePicture'); 
        res.json(users); // Send list of users as JSON response
    } catch (error) {
        res.status(500).send('Error retrieving list of people'); // Handle potential errors
    }
});

// Route to display details of a person's album (memories) by user ID
// This route represents the "viewPerson" page where users can view memories associated with a specific person
app.get('/viewPerson/:userId', async (req, res) => {
    // Ensure the user is authenticated before allowing access
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized'); // Send Unauthorized status if user is not authenticated
    }

    try {
        // Retrieve all memories created by the specified user
        const memories = await getMemoriesByUserId(req.params.userId);
        res.json(memories); // Send list of memories as JSON response
    } catch (error) {
        res.status(500).send('Error retrieving memories for user'); // Handle potential errors
    }
});

// Dashboard route (home page after login)
// This route is a simple dashboard that redirects the user to the album list or offers logout
app.get('/dashboard', (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // If authenticated, display a welcome message and link to view albums
        res.send(`Welcome to your dashboard, ${req.user.name}! <a href="/listOfPeople">View Albums</a> | <a href="/logout">Logout</a>`);
    } else {
        // If not authenticated, redirect to Google login
        res.redirect('/auth/google');
    }
});

// Route to log out the user and end the session
app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); } // Handle logout errors
        res.redirect('/'); // Redirect to home page after successful logout
    });
});

// Home route (landing page before login)
// Displays a welcome message and link to Google login if the user is not authenticated
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard'); // Redirect authenticated users to dashboard
    } else {
        // Display login link for non-authenticated users
        res.send('Welcome! <a href="/auth/google">Login with Google</a>');
    }
});

// Server setup and start listening on specified port
const port = 3000; // Define the port the server will listen on
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Log server start information
});
