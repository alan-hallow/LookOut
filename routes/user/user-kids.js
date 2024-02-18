const express = require('express');
const missingKids = require('../../models/missing-kids-post');
const router = express.Router();
const missingKidsHelper = require('../../helpers/user/helper-missing-kid');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const missingkidsinfo = await missingKids.find().sort({ createddate: 'desc' });
        res.render('user/kids/missingkids', { childMissing: missingkidsinfo });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching missing kids data.');
    }
});

router.get('/createMissingKidPost', (req, res) => {
    res.render('user/kids/newmissingkidpost');
});

router.get('/missingkidnewpost/:id', async (req, res) => {
    try {
        const missingKidDetails = await missingKids.findById(req.params.id);
        if (!missingKidDetails) {
            res.redirect('/');
        } else {
            res.render('user/kids/missingkiddisplay', { missingkidsfulldetails: missingKidDetails });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching missing kid details.');
    }
});

router.post('/missingkidspostrequest', async (req, res) => {
    try {
        const savedMissingKid = await missingKidsHelper.helperMissingKids(req.body);
        console.log('Saved missing kid:', savedMissingKid);
        console.log(req.files.image)

        if (req.files && req.files.image) {
            let imageFile = req.files.image;
            // Use path.join for cross-platform compatibility
            imageFile.mv(path.join(__dirname, '../','../','public', 'images', 'missingkids', `${savedMissingKid.id}.jpg`));
        }

        // Redirect after saving missing kid
        res.redirect(`missingkidnewpost/${savedMissingKid.id}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while saving missing kid data.');
    }
});

module.exports = router;
