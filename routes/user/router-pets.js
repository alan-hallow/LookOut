const express = require('express');
const missingPets = require('../../models/missing-pets-post');
const router = express.Router();
const missingPetsHelper = require('../../helpers/user/helper-missing-pets');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const missingpetsinfo = await missingPets.find().sort({ createddate: 'desc' });
        res.render('user/pets/missingpets', { petsMissing: missingpetsinfo });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching missing pets data.');
    }
});

router.get('/createMissingPetsPost', (req, res) => {
    res.render('user/pets/newmissingpetspost');
});

router.get('/missingpetsnewpost/:id', async (req, res) => {
    try {
        const missingPetsDetails = await missingPets.findById(req.params.id);
        if (!missingPetsDetails) {
            res.redirect('/');
        } else {
            res.render('user/pets/missingpetsdisplay', { missingpetsfulldetails: missingPetsDetails });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching missing pets details.');
    }
});

router.post('/missingpetspostrequest', async (req, res) => {
    try {
        const savedMissingPets = await missingPetsHelper.helperMissingPets(req.body);
        console.log('Saved missing pets:', savedMissingPets);
        console.log(req.files.image)

        if (req.files && req.files.image) {
            let imageFile = req.files.image;
            // Use path.join for cross-platform compatibility
            imageFile.mv(path.join(__dirname, '../','../','public', 'images', 'missingpets', `${savedMissingPets.id}.jpg`));
        }

        // Redirect after saving missing kid
        res.redirect(`missingpetsnewpost/${savedMissingPets.id}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while saving missing pets data.');
    }
});

module.exports = router;
