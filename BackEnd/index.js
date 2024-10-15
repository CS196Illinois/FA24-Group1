// Description: Main entry point for the application.
const express = require('express')
const { MongoClient } = require("mongodb");
const app = express()

// Define the MongoDB URI
const uri = "mongodb://localhost:27017/local";
const client = new MongoClient(uri);

// Connect to the MongoDB database
async function run() {
  try {
    await client.connect(); // Ensure the client is connected

    const database = client.db('local');

    const users = database.collection('User');
    // Find all of the users in the collection
    const userList = await users.find().toArray();
    console.log(userList);

    const memories = database.collection('Memory');
    // Find all of the memories in the collection
    const memoryList = await memories.find().toArray();
    console.log(memoryList);

    const comments = database.collection('Comment');
    // Find all of the comments in the collection
    const commentList = await comments.find().toArray();
    console.log(commentList);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

// Define a main route
app.get('/users', (req, res) => {
  // retrieve all the data from a collection of 'User', 'Memory', and 'Comments'

}) 

// Start the server
const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})