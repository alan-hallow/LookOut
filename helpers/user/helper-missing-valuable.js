const { renderFile } = require("ejs");
const missingValuable = require("./../../models/missing-valuable-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingValuable: async (helperMissingValuable) => {
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
      } = helperMissingValuable;

      // Create a new missing kid object
      const newMissingValuable = new missingValuable({
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
      const savedMissingValuable = await newMissingValuable.save();

      return savedMissingValuable;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
