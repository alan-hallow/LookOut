const missingPets = require('./../../models/model-signup');



module.exports = {



    // Async function to handle saving missing kids data
    users: async (userData) => {
        try {
            // Destructure data from helperMissingKids object
            const { name, email, phone, location, password} = helperMissingPets;

            // Create a new missing kid object
            const newMissingPets = new missingPets({
                name: name,
                email: email,
                phone: phone,
                location: location,
                password: password,
                createddate: new Date(), // Assuming you want to set the creation date automatically
            });

            // Save the missing kid to the database
            const usersDataSuccess = await users.save();

            return usersDataSuccess

        } catch (error) {
            // Handle any errors that occur during the process
            console.error(error);
        }
    }
};
