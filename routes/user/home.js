const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('user/home', {
        body: 'hello'
    });
});
module.exports = router