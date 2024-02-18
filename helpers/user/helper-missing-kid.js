const { renderFile } = require('ejs');
const missingKids = require('./../../models/missing-kids-post');
const path = require('path'); // Import path module if not already imported
const { time } = require('console');



module.exports = {



    // Async function to handle saving missing kids data
    helperMissingKids: async (helperMissingKids) => {
        try {
            // Destructure data from helperMissingKids object
            const { name, gender, age, date, time, place,residence, religion,dress, reward, additional} = helperMissingKids;

            // Create a new missing kid object
            const newMissingKid = new missingKids({
                name: name,
                gender: gender,
                age: age,
                date: date,
                time: time,
                place: place,
                residence: residence,
                religion: religion,
                dress: dress,
                reward: reward,
                additional: additional,
                createddate: new Date(), // Assuming you want to set the creation date automatically
            });

            // Save the missing kid to the database
            const savedMissingKid = await newMissingKid.save();

            return savedMissingKid

        } catch (error) {
            // Handle any errors that occur during the process
            console.error(error);
        }
    }
};
