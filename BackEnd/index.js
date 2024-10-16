// Description: Main entry point for the application.
const express = require('express')
const { MongoClient } = require("mongodb");
const app = express()

// Define the MongoDB URI
const uri = "mongodb://localhost:27017/local";
const client = new MongoClient(uri);

// Retrieve the data from the collections(User, Memory, Comment)
async function retrieveUser() {
    try {
        await client.connect(); // Ensure the client is connected

        const database = client.db('local');

        const users = database.collection('User');  // Find all of the users in the collection
        const userList = await users.find().toArray();
        console.log(userList);
        return userList;
    } finally {
        await client.close(); // Ensures that the client will close when you finish/error
    }
}

async function retrieveMemory() {
    try {
        await client.connect();

        const database = client.db('local');

        const memories = database.collection('Memory');
        const memoryList = await memories.find().toArray();
        console.log(memoryList);
        return memoryList;
    } finally {
        await client.close();
    }
}

async function retrieveComment() {
    try {
        await client.connect();

        const database = client.db('local');

        const comments = database.collection('Comment');
        const commentList = await comments.find().toArray();
        console.log(commentList);
        return commentList;
    } finally {
        await client.close();
    }
}

// Add a data for the collections
async function addUser(username) {
    try {
        await client.connect();

        const database = client.db('local');

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
        await client.close();
    }
}

async function addMemory(userID, description, title, isPhoto, tags, accessLevel) {
    try {
        await client.connect();

        const database = client.db('local');

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
        await client.close();
    }
}

async function addComment(memoryID, userID, text) {
    try {
        await client.connect();

        const database = client.db('local');

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
        await client.close();
    }
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Route of '/data' to retrieve all the data from the collections
app.get('/data', async (req, res) => {
    try {
        await client.connect(); // Ensure the client is connected

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
        await client.close();
    }
}); 

/*// Route to add a user and test the addUser function
app.get('/addUser', async (req, res) => {
    try {
        await client.connect();
        await addUser('testUser');
        res.send('User added successfully');
    } finally {
        await client.close();
    }
});
*/

/*// Route to add a Memory and test the addMemory function
app.get('/addMemory', async (req, res) => {
    try {
        await client.connect();
        await addMemory('testUserID', 'testDescription', 'testTitle', true, ['testTag1', 'testTag2'], '0');
        res.send('Memory added successfully');
    } finally {
        await client.close();
    }
});
*/

/*// Route to add a Memory and test the addMemory function
app.get('/addComment', async (req, res) => {
    try {
        await client.connect();
        await addComment('testMemoryID', 'testUserID', 'testText');
        res.send('Comment added successfully');
    } finally {
        await client.close();
    }
});
*/

// Start the server
const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})