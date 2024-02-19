const missingPets = require('./../../models/models-signup');
const bcrypt = require('bcrypt');
const saltRounds = 10; // This determines the complexity of the hash, usually between 10-12 is recommended

module.exports = {
    userData: async (userData) => {
        try {
            const { name, email, phone, place, password } = userData;

            // Hash the provided password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new missingPets({
                name: name,
                email: email,
                phone: phone,
                place: place, // Assuming 'place' corresponds to 'location' in the model
                password: hashedPassword, // Store the hashed password
            });

            const usersDataSuccess = await newUser.save();

            return usersDataSuccess;

        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error to handle it in the calling function.
        }
    }
};
