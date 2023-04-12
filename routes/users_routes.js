const express = require('express')
const router = express.Router()

// User Model Import &  authenticate_token function Import
const User = require('../models/users')
const jwt = require('jsonwebtoken')

// Authentication Password Encryption
const bcrypt = require('bcrypt')
const app = express(); 

// JWT Web Token
const { authenticate_token } = require('../authentication/jwt_token')

// Register New User / Save in MongoDb
router.route('/register')
    .get((req, res) => {
    res.send('Register New User - Get Method')
    })
    .post(async (req, res) => {
        try {
            // Validate user input
            if ((!req.body.name || !req.body.email || !req.body.password)) {
                return res.status(400).send("All input is required");
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(req.body.password, 10);

            // Create New User
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: encryptedPassword
            })
            
            // Validate if user exist in our database
            const email = user.email
            const oldUser = await User.findOne({email});
            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }
            
            // Save & Return New User
            user.save().then(() => {
                return res.status(201).json(user);
            })
        }catch (err) {
            res.send(err.message)
        }
    })

// Login User
router.route('/login')
    .get(async (req, res) => {
        res.send('Login User - Get Method')
    })
    .post(async (req, res) => {
        // Authentication with Email
        let user = await User.find({ email: req.body.email }).exec()
        if (user[0] == null) {
            return res.status(400).send("Cannot find user")
        }

        try {
            if (await bcrypt.compare(req.body.password, user[0].password)) {
                // res.send('Login successful')

                // JWT Token
                const accessToken = jwt.sign(user[0].toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: "120min" })
                res.json({ accessToken: accessToken })
            } else {
                res.send("Please check your password")
            }
        } catch (err) {
            res.status(500).send(err.message)
        }
    })

// Get all Users
router.get('/users', authenticate_token, async (req, res) => {
    const users = await User.find();
    res.json(users)
})

// Get User by Id
router.get('/users/:id', authenticate_token, async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user)
})

// Update User by Id
router.put('/users/update/:id', authenticate_token,  async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // Validate user input
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Validate if user exist in our database
        const email = req.body.email
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exist");
        }

        //Encrypt user password
        const encryptedPassword = req.body.password && await bcrypt.hash(req.body.password, 10);
        
        // Update User 
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = encryptedPassword || user.password;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// Delete User by Id
router.delete('/users/delete/:id', authenticate_token, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        await user.deleteOne();
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
})

module.exports = router