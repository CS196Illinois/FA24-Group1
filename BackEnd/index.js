// Description: Main entry point for the application.
const express = require('express')
const { MongoClient } = require("mongodb");
const { OAuth2Client } = require('google-auth-library');
const app = express()

const client = new OAuth2Client();

// Added this line to parse JSON bodies
app.use(express.json());

// Define the MongoDB URI
const uri = "mongodb://localhost:27017/local";
const mongoClient = new MongoClient(uri);

// Retrieve the data from the collections(User, Memory, Comment)
async function retrieveUser() {
    try {
        await mongoClient.connect(); // Ensure the client is connected

        const database = mongoClient.db('local');

        const users = database.collection('User');  // Find all of the users in the collection
        const userList = await users.find().toArray();
        console.log(userList);
        return userList;
    } finally {
        await mongoClient.close(); // Ensures that the client will close when you finish/error
    }
}

async function retrieveMemory() {
    try {
        await mongoClient.connect();

        const database = mongoClient.db('local');

        const memories = database.collection('Memory');
        const memoryList = await memories.find().toArray();
        console.log(memoryList);
        return memoryList;
    } finally {
        await mongoClient.close();
    }
}

async function retrieveComment() {
    try {
        await mongoClient.connect();

        const database = mongoClient.db('local');

        const comments = database.collection('Comment');
        const commentList = await comments.find().toArray();
        console.log(commentList);
        return commentList;
    } finally {
        await mongoClient.close();
    }
}

// Add a data for the collections
async function addUser(username) {
    try {
        await mongoClient.connect();

        const database = mongoClient.db('local');

        const users = database.collection('User');  
        
        const doc = {
            //_id(Object id) is going to be automatically created
            Username: username, //string
            Friends: [], //Array of object id
            DateCreated: new Date(),
        };

        const result = await users.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await mongoClient.close();
    }
}

async function addMemory(userID, description, title, isPhoto, tags, accessLevel) {
    try {
        await mongoClient.connect();

        const database = mongoClient.db('local');

        const memories = database.collection('Memory');  
        
        const doc = {
            //_id(Object id) is going to be automatically created
            UserID: userID,
            Comments: [], //Array of object id
            DateCreated: new Date(),
            Description: description,
            Title: title,
            Like: 0,
            IsPhoto: isPhoto,
            FilePath: "",
            Tags: tags, //Array of string
            AccessLevel: accessLevel
        };

        const result = await memories.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await mongoClient.close();
    }
}

async function addComment(memoryID, userID, text) {
    try {
        await mongoClient.connect();

        const database = mongoClient.db('local');

        const comments = database.collection('Comment');  
        
        const doc = {
            //_id(Object id) is going to be automatically created
            MemoryID: memoryID,
            UserID: userID,
            Text: text,
            DateCreated: new Date(),
        };

        const result = await comments.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await mongoClient.close();
    }
}

// Google Sign-In verification
async function verify(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: 'YOUR_GOOGLE_CLIENT_ID',  // Replace with your actual Client ID
        });

        const payload = ticket.getPayload();
        const userId = payload['sub'];  // Google user ID
        console.log('Verified user ID:', userId);
        return payload;  // Return the full payload to use further, such as email, name, etc.
    } catch (error) {
        console.error('Error verifying Google ID token:', error);
        throw new Error('Authentication failed');
    }
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Route of '/data' to retrieve all the data from the collections
app.get('/data', async (req, res) => {
    try {
        await mongoClient.connect(); // Ensure the client is connected

        // Retrieve all data from the collections
        const userList = await retrieveUser();
        const memoryList = await retrieveMemory();
        const commentList = await retrieveComment();

        // Combine all data into a single object
        const data = {
            users: userList,
            memories: memoryList,
            comments: commentList
        };

        // Send the combined data as a JSON response
        res.json(data);
    } finally {
        await mongoClient.close();
    }
}); 

// New User Endpoints
// Creating a new user
app.post('/users', async (req, res) => {
    try {
        const { username } = req.body;
        // this classes the addUser function with the provided username
        await addUser(username);
        // Send a success response
        res.status(201).send('User created successfully');
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send('Error creating user');
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        // this retrieves all users using the retrieveUser function
        const users = await retrieveUser();
        // this sends the users as a JSON response
        res.json(users);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send('Error retrieving users');
    }
});

// New Memory Endpoints

// Create a new memory
app.post('/memories', async (req, res) => {
    try {
        // This extracts memory details from the request body
        const { userID, description, title, isPhoto, tags, accessLevel } = req.body;
        // this calls the addMemory function with the provided details
        await addMemory(userID, description, title, isPhoto, tags, accessLevel);
        // This sends a success response
        res.status(201).send('Memory created successfully');
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send('Error creating memory');
    }
});

// Get all memories
app.get('/memories', async (req, res) => {
    try {
        // This retrieves all memories using the retrieveMemory function
        const memories = await retrieveMemory();
        // This sends the memories as a JSON response
        res.json(memories);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send('Error retrieving memories');
    }
});

// New Comment Endpoints

// Create a new comment
app.post('/comments', async (req, res) => {
    try {
        // This extracts comment details from the request body
        const { memoryID, userID, text } = req.body;
        // this calls the addComment function with the provided details
        await addComment(memoryID, userID, text);
        // this sends a success response
        res.status(201).send('Comment added successfully');
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send('Error adding comment');
    }
});

// Get all comments
app.get('/comments', async (req, res) => {
    try {
        // This retrieves all comments using the retrieveComment function
        const comments = await retrieveComment();
        // this sends the comments as a JSON response
        res.json(comments);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send('Error retrieving comments');
    }
});

// Google Sign-In Endpoint
app.post('/auth/google', async (req, res) => {
    const { token } = req.body; // Get the Google ID token from the client request
    try {
        const userPayload = await verifyGoogleToken(token);  // Verify the token
        const googleID = userPayload['sub'];
        
        // Optionally, find the user in your database or create a new one
        let user = await findUserByGoogleID(googleID);

        if (!user) {
            const newUserId = await addUserWithGoogleData(googleID, userPayload);
            user = { _id: newUserId, googleID: googleID, email: userPayload.email, name: userPayload.name };
        }

        // Return the user data after successful authentication
        res.json({
            message: 'User authenticated successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
});

// Start the server
const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

