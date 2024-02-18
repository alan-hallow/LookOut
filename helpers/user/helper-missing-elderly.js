const { renderFile } = require('ejs');
const missingElderly = require('./../../models/missing-elderly-post');
const path = require('path'); // Import path module if not already imported



module.exports = {



    // Async function to handle saving missing kids data
    helperMissingElderly: async (helperMissingElderly) => {
        try {
            // Destructure data from helperMissingKids object
            const { name, placeofliving, placewentmissing, age, dress, description, missingdate, reward } = helperMissingElderly;

            // Create a new missing kid object
            const newMissingElderly = new missingElderly({
                name: name,
                placeofliving: placeofliving,
                placewentmissing: placewentmissing,
                age: age,
                dress: dress,
                description: description,
                missingdate: missingdate,
                reward: reward,
                createddate: new Date(), // Assuming you want to set the creation date automatically
            });

            // Save the missing kid to the database
            const savedMissingElderly = await newMissingElderly.save();

            return savedMissingElderly

        } catch (error) {
            // Handle any errors that occur during the process
            console.error(error);
        }
    }
};
