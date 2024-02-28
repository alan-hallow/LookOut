const { renderFile } = require("ejs");
const corpses = require("./../../models/corpses-post");
const path = require("path"); // Import path module if not already imported
const { time } = require("console");

module.exports = {
  // Async function to handle saving missing kids data
  helperCorpses: async (helperCorpses) => {
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
      } = helperCorpses;

      // Create a new missing kid object
      const newCorpse = new corpses({
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
      const savedCorpse = await newCorpse.save();

      return savedCorpse;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
