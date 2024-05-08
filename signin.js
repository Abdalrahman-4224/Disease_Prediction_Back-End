// routes/signin.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User=require('./models/User')


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Retrieve email and password from request body
        const { email, password } = req.body;
        
        // Find user by email in the database
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Return error if user not found or password is incorrect
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        // Respond with success message and token
        res.json({ message: 'Signin successful', token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

// routes/signin.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();

// router.post('/', async (req, res) => {
//     try {
//         // Retrieve email and password from request body
//         const { email, password } = req.body;

//         // Find user by email in the database
//         const user = await User.findOne({ where: { email } });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             // Return error if user not found or password is incorrect
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Generate JWT token for authentication
//         const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

//         // Respond with success message and token
//         res.json({ message: 'Signin successful', token });
//     } catch (error) {
//         console.error('Error signing in:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// module.exports = router;

