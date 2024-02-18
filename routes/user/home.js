const express = require('express')
const router = express.Router()


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



router.get('/userSignUp', async (req,res)=>{


    try{
        const usersData = await users.userData(req.data)
        res.render('user/home')
    }
    catch (error){
        console.log('Error:', error)
        res.status(500).send('An error occurred while saving users data.');
    }
})






module.exports = router