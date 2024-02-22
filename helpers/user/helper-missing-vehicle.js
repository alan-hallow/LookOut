const { renderFile } = require("ejs");
const missingPets = require("./../../models/missing-vehicle-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingValuable: async (helperMissingVehicle) => {
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
      } = helperMissingVehicle;

      // Create a new missing kid object
      const newMissingVehicle = new missingVehicle({
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
      const savedMissingVehicle = await newMissingVehicle.save();

      return savedMissingVehicle;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
