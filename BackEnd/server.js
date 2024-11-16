// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');

// Import database functions
const {
    getUserByGoogleId,
    handleGoogleLogin,
    createPerson,
    getPeopleByUserId,
    editPerson,
    deletePerson,
    deleteMemory
} = require('./dbFunctions');

// Initialize Express App
const app = express();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit if unable to connect
    });

// Middleware Configuration
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Google Authentication Strategy Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await handleGoogleLogin(profile);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Passport Serialization and Deserialization
passport.serializeUser((user, done) => done(null, user.googleId)); // Serialize user to session
passport.deserializeUser(async (googleId, done) => {
    try {
        const user = await getUserByGoogleId(googleId);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Middleware to ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }
    next();
}

// Routes

// Home Route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.send('<a href="/auth/google">Login with Google</a>');
});

// Google Login and Callback
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard');
});

// Dashboard Route
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.name}! <a href="/people">View People</a> | <a href="/logout">Logout</a>`);
});

// Logout Route
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/');
    });
});

// People Management Routes

// Create a new person
app.post('/createPerson', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const userId = req.user._id;
        const { name } = req.body;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
        const person = await createPerson(userId, name, profilePicture);
        res.json(person);
    } catch (error) {
        res.status(500).send('Error creating person');
    }
});

// Edit an existing person
app.put('/editPerson/:personId', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const { personId } = req.params;
        const updates = {
            name: req.body.name,
            ...(req.file && { profilePicture: `/uploads/${req.file.filename}` })
        };
        const person = await editPerson(personId, updates);
        res.json(person);
    } catch (error) {
        res.status(500).send('Error editing person');
    }
});

// Get all people for the logged-in user
app.get('/people', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const people = await getPeopleByUserId(userId);
        res.json(people);
    } catch (error) {
        res.status(500).send('Error retrieving people');
    }
});

// Delete a person and all associated data
app.delete('/deletePerson/:personId', isAuthenticated, async (req, res) => {
    try {
        const { personId } = req.params;
        await deletePerson(personId);
        res.send(`Person with ID ${personId} deleted`);
    } catch (error) {
        res.status(500).send('Error deleting person');
    }
});

// Memory Management Routes

// Delete a memory and its associated comments
app.delete('/deleteMemory/:memoryId', isAuthenticated, async (req, res) => {
    try {
        const { memoryId } = req.params;
        await deleteMemory(memoryId);
        res.send(`Memory with ID ${memoryId} deleted`);
    } catch (error) {
        res.status(500).send('Error deleting memory');
    }
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
