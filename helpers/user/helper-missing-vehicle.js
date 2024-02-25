const { renderFile } = require("ejs");
const missingVehicle = require("./../../models/missing-vehicle-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingVehicle: async (helperMissingVehicle) => {
    try {
      // Destructure data from helperMissingKids object
      const {
        name,
        gender,
        age,
        date,
        time,
        place,
        residence,
        dress,
        reward,
        additional,
      } = helperMissingVehicle;

      // Create a new missing kid object
      const newMissingVehicle = new missingVehicle({
        name: name,
        gender: gender,
        age: age,
        date: date,
        time: time,
        place: place,
        residence: residence,
        dress: dress,
        reward: reward,
        additional: additional,
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
