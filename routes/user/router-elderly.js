const express = require('express');
const missingElderly = require('../../models/missing-elderly-post');
const router = express.Router();
const missingElderlyHelper = require('../../helpers/user/helper-missing-elderly');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const missingelderlyinfo = await missingElderly.find().sort({ createddate: 'desc' });
        res.render('user/elderly/missingelderly', { elderlyMissing: missingelderlyinfo });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching missing elderly data.');
    }
});

router.get('/createMissingElderlyPost', (req, res) => {
    res.render('user/elderly/newmissingelderlypost');
});

router.get('/missingelderlynewpost/:id', async (req, res) => {
    try {
        const missingElderlyDetails = await missingElderly.findById(req.params.id);
        if (!missingElderlyDetails) {
            res.redirect('/');
        } else {
            res.render('user/elderly/missingelderlydisplay', { missingelderlyfulldetails: missingElderlyDetails });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching missing elderly details.');
    }
});

router.post('/missingelderlypostrequest', async (req, res) => {
    try {
        const savedMissingElderly = await missingElderlyHelper.helperMissingElderly(req.body);
        console.log('Saved missing elderly:', savedMissingElderly);
        console.log(req.files.image)

        if (req.files && req.files.image) {
            let imageFile = req.files.image;
            // Use path.join for cross-platform compatibility
            imageFile.mv(path.join(__dirname, '../','../','public', 'images', 'missingelderly', `${savedMissingElderly.id}.jpg`));
        }

        // Redirect after saving missing kid
        res.redirect(`missingelderlynewpost/${savedMissingElderly.id}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while saving missing elderly data.');
    }
});

module.exports = router;
