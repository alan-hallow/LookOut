const { renderFile } = require("ejs");
const missingVehicle = require("./../../models/missing-vehicle-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingVehicle: async (helperMissingVehicle) => {
    try {
      // Destructure data from helperMissingKids object
      const {
        brand,
        model,
        year,
        fuel,
        number,
        date,
        time,
        place,
        residency,
        reward,
        additional,
      } = helperMissingVehicle;

      // Create a new missing kid object
      const newMissingVehicle = new missingVehicle({
        brand: brand,
        model: model,
        year: year,
        fuel: fuel,
        number: number,
        date: date,
        time: time,
        place: place,
        residency: residency,
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
