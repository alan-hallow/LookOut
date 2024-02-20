const { renderFile } = require("ejs");
const missingPets = require("./../../models/missing-pets-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingPets: async (helperMissingPets) => {
    try {
      // Destructure data from helperMissingKids object
      const {
        name,
        type,
        breed,
        placewentmissing,
        age,
        dress,
        description,
        missingdate,
        reward,
      } = helperMissingPets;

      // Create a new missing kid object
      const newMissingPets = new missingPets({
        name: name,
        type: type,
        breed: breed,
        placewentmissing: placewentmissing,
        age: age,
        description: description,
        missingdate: missingdate,
        reward: reward,
        createddate: new Date(), // Assuming you want to set the creation date automatically
      });

      // Save the missing kid to the database
      const savedMissingPets = await newMissingPets.save();

      return savedMissingPets;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
