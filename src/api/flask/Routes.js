// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const axios = require('axios')
const router    = express.Router();



async function predictDisease(endpoint, inputData) {
    try {
        const flaskResponse = await axios.post(endpoint, inputData);
        return flaskResponse.data.prediction;
    } catch (error) {
        throw new Error(`Prediction failed: ${error.message}`);
    }
}

router.post('/heart_predict', async (req, res) => {
    try {
        const inputData = req.body;
        const predictionResult = await predictDisease('http://localhost:5000/heart_predict', inputData);
        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/liver_predict', async (req, res) => {
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
router.post('/diabetes_predict', async (req, res) => {
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

router.post('/kidney_predict', async (req, res) => {
    try {
        const inputData = req.body;
        const predictionResult = await predictDisease('http://localhost:5000/kidney_predict', inputData);
        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router
// Function to make prediction requests to Flask API
