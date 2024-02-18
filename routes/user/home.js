const express = require('express')
const router = express.Router()
const userDataModels = require('./../../models/models-signup');
const userDataHelper = require('./../../helpers/user/helper-signup');
const fs = require('fs');
const path = require('path');


router.get('/', (req, res) => {
    res.render('user/home', {
        body: 'hello'
    });
});



router.get('/signup', (req,res)=>{
    res.render('user/signup')
})


router.get('/signin', async (req,res)=>{
        res.render('user/login')

})



router.post('/userSignup', async (req,res)=>{
    try{
        const usersData = await userDataHelper.userData(req.data)
        res.render('user/home')
    }
    catch (error){
        console.log('Error:', error)
        res.status(500).send('An error occurred while saving users data.');
    }
})






module.exports = router