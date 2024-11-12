// I'm importing the necessary modules
const express = require('express');
const { MongoClient } = require("mongodb");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();

// I'm setting up middleware
app.use(express.json());
app.use(session({
    secret: 'your_session_secret', // I need to replace this with a real secret in production
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// I'm setting up my MongoDB connection
const uri = "mongodb://localhost:27017/local";
const client = new MongoClient(uri);

// I'm configuring Passport to use Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        await client.connect();
        const database = client.db('local');
        const users = database.collection('User');

        // I'm checking if the user exists, if not I'm creating a new user
        let user = await users.findOne({ googleId: profile.id });
        if (!user) {
            user = {
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                profilePicture: profile.photos[0].value,
                friends: [],
                dateCreated: new Date()
            };
            await users.insertOne(user);
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    } finally {
        await client.close();
    }
}));

// I'm telling Passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.googleId);
});

// I'm telling Passport how to deserialize the user
passport.deserializeUser(async (googleId, done) => {
    try {
        await client.connect();
        const database = client.db('local');
        const users = database.collection('User');
        const user = await users.findOne({ googleId: googleId });
        done(null, user);
    } catch (error) {
        done(error, null);
    } finally {
        await client.close();
    }
});

// I'm setting up Google Auth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  ); //so when i viit http://localhost:3000/auth/google this route triggers in the server.js

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log("Authentication successful, user:", req.user);
    res.redirect('/dashboard');
  }
);

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome to your dashboard, ${req.user.name}! <a href="/logout">Logout</a>`);
  } else {
    res.redirect('/auth/google');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.name}! <a href="/dashboard">Go to dashboard</a> | <a href="/logout">Logout</a>`);
  } else {
    res.send('Welcome! <a href="/auth/google">Login with Google</a>');
  }
});

// I'm modifying the existing functions to work with Google login data

// This function retrieves a user by their Google ID
async function retrieveUser(googleId) {
    try {
        await client.connect();
        const database = client.db('local');
        const users = database.collection('User');
        return await users.findOne({ googleId: googleId });
    } finally {
        await client.close();
    }
}

// This function retrieves memories for a specific user
async function retrieveMemory(userId) {
    try {
        await client.connect();
        const database = client.db('local');
        const memories = database.collection('Memory');
        return await memories.find({ UserID: userId }).toArray();
    } finally {
        await client.close();
    }
}

// This function retrieves comments for a specific memory
async function retrieveComment(memoryId) {
    try {
        await client.connect();
        const database = client.db('local');
        const comments = database.collection('Comment');
        return await comments.find({ MemoryID: memoryId }).toArray();
    } finally {
        await client.close();
    }
}

// I'm modifying the routes to work with the new authentication system

// This route retrieves all data for the authenticated user
app.get('/data', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const userList = await retrieveUser(req.user.googleId);
        const memoryList = await retrieveMemory(req.user._id);
        const commentList = await retrieveComment(memoryList.map(m => m._id));
        const data = {
            users: userList,
            memories: memoryList,
            comments: commentList
        };
        res.json(data);
    } catch (error) {
        res.status(500).send('Error retrieving data');
    }
});

// This route retrieves the authenticated user's information
app.get('/users', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const user = await retrieveUser(req.user.googleId);
        res.json(user);
    } catch (error) {
        res.status(500).send('Error retrieving user');
    }
});

// This route retrieves memories for the authenticated user
app.get('/memories', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const memories = await retrieveMemory(req.user._id);
        res.json(memories);
    } catch (error) {
        res.status(500).send('Error retrieving memories');
    }
});

// This route retrieves comments for a specific memory
app.get('/comments/:memoryId', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const comments = await retrieveComment(req.params.memoryId);
        res.json(comments);
    } catch (error) {
        res.status(500).send('Error retrieving comments');
    }
});

// THis starts the server
const port = 3000;
app.listen(port, () => {
    console.log(`I've started the server on port ${port}`);
    console.log(`http://localhost:${port}/auth/google`);
    console.log(`http://localhost:${port}/users`);
    console.log(`http://localhost:${port}/memories`);
    console.log(`http://localhost:${port}/comments`);
    console.log(`http://localhost:${port}/comments/MEMORY_ID`); // To get comments for a specific memory (replace MEMORY_ID with an actual memory ID)
});
