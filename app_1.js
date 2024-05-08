
// const { MongoClient } = require('mongodb');

// const signinRoutes = require('./signin');
// const signupRoutes = require('./signup');


// MongoDB connection
// const dbURI = process.env.ATLAS_URI;
// const client = new MongoClient(dbURI);

// async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");
    
//     // Start the server after successful connection
//     startServer();
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1); // Exit the process if unable to connect to MongoDB
//   }
// }

// Define routes with appropriate prefixes
// app.use('/signup', signupRoutes);
// app.use('/signin', signinRoutes);

// Function to make prediction requests to Flask API

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to make prediction requests to Flask API
async function predictDisease(endpoint, inputData) {
    try {
        const flaskResponse = await axios.post(endpoint, inputData);
        return flaskResponse.data.prediction;
    } catch (error) {
        throw new Error(`Prediction failed: ${error.message}`);
    }
}

// Endpoint to handle heart disease prediction
app.post('/heart_predict', async (req, res) => {
    try {
        const inputData = req.body;
        const predictionResult = await predictDisease('http://localhost:5000/heart_predict', inputData);
        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to handle liver disease prediction
app.post('/liver_predict', async (req, res) => {
    try {
        console.log("req",req.body);
        const inputData = req.body;
        const predictionResult = await predictDisease('http://localhost:5000/liver_predict', inputData);
        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to handle diabetes prediction
app.post('/diabetes_predict', async (req, res) => {
    try {
        console.log("req",req.body);
        const inputData = req.body;
        const predictionResult = await predictDisease('http://localhost:5000/diabetes_predict', inputData);
        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to handle kidney disease prediction
app.post('/kidney_predict', async (req, res) => {
    try {
        const inputData = req.body;
        const predictionResult = await predictDisease('http://localhost:5000/kidney_predict', inputData);
        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Node.js server is running on port ${PORT}`);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const sequelize = require('./sequelize');

// const signinRoutes = require('./routes/signin');
// const signupRoutes = require('./routes/signup');

// const app = express();

// app.use(bodyParser.json());

// // Connect to MySQL database using Sequelize
// async function connectToMySQL() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connected to MySQL database.');
//     startServer();
//   } catch (error) {
//     console.error('Unable to connect to the MySQL database:', error);
//     process.exit(1);
//   }
// }

// // Define routes with appropriate prefixes
// app.use('/signup', signupRoutes);
// app.use('/signin', signinRoutes);

// // Function to make prediction requests to Flask API
// async function predictDisease(endpoint, inputData) {
//   try {
//     const flaskResponse = await axios.post(endpoint, inputData);
//     return flaskResponse.data.prediction;
//   } catch (error) {
//     throw new Error(`Prediction failed: ${error.message}`);
//   }
// }

// // Define endpoints for prediction
// app.post('/heart_predict', async (req, res) => {
//   try {
//     const inputData = req.body;
//     const predictionResult = await predictDisease('http://localhost:5000/heart_predict', inputData);
//     res.json({ prediction: predictionResult });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// function startServer() {
//   const PORT = 3000;
//   app.listen(PORT, () => {
//     console.log(`Node.js server is running on port ${PORT}`);
//   });
// }

// connectToMySQL();
