// routes/signup.js

const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');

const router = express.Router();

// Define validation rules for signup request body
const signupValidationRules = [
    body('username').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
];

router.post('/', signupValidationRules, async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if user already exists
        const { email, username, password } = req.body;
        const userCount = await User.countDocuments({ email });

        if (userCount > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new User({
            unique_id: generateUniqueId(), // You can implement a function to generate unique IDs
            email,
            username,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;


// routes/signup.js
// routes/signup.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');

// const router = express.Router();

// // Define validation rules for signup request body
// const signupValidationRules = [
//     body('username').notEmpty().trim().escape(),
//     body('email').isEmail().normalizeEmail(),
//     body('password').isLength({ min: 6 }),
// ];

// router.post('/', signupValidationRules, async (req, res) => {
//     try {
//         // Validate request body
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         // Check if user already exists
//         const { email, username, password } = req.body;
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ error: 'User already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         await User.create({ username, email, password: hashedPassword });

//         // Respond with success message
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         console.error('Error signing up:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// module.exports = router;

