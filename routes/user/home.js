const express = require('express');
const userDataHelper = require('./../../helpers/user/helper-signup');
const users = require('../../models/models-signup');
const router = express.Router();
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render('user/home', {
        body: 'hello'
    });
});

router.get('/signup', (req, res) => {
    res.render('user/signup');
});

router.get('/signin', (req, res) => {
    res.render('user/signin');
});

router.post('/userSignup', async (req, res) => {
    try {
        const usersData = await userDataHelper.userData(req.body);
        console.log(usersData);
        res.render('user/home');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('An error occurred while saving users data.');
    }
});



router.post('/userSignIn', async (req, res) => {
    try {
        // Assuming email is the unique identifier for users in your database
        const userEmail = await users.findOne({ email: req.body.email });

        if (userEmail) {
            const loginPassword = req.body.password;
            const dbUserPassword = userEmail.password;

            bcrypt.compare(loginPassword, dbUserPassword, function(err, result) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('An error occurred while trying to login.');
                }
                if (result) {
                    // Passwords match, proceed with login
                    console.log('Passwords match');
                    // Send appropriate response to the client
                    res.redirect('/');
                } else {
                    // Passwords don't match, handle accordingly
                    console.log('Passwords do not match');
                    res.redirect('/signin')
                }
            });
        } else {
            console.log('User not found');
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('An error occurred while trying to login.');
    }
});


module.exports = router;
