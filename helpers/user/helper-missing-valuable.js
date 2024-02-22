const { renderFile } = require("ejs");
const missingPets = require("./../../models/missing-valuable-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingValuable: async (helperMissingValuable) => {
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
      const newMissingValuable = new missingValuable({
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
      const savedMissingValuable = await newMissingValuable.save();

      return savedMissingValuable;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
