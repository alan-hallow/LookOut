const { renderFile } = require("ejs");
const missingElderly = require("./../../models/missing-elderly-post");
const path = require("path"); // Import path module if not already imported

module.exports = {
  // Async function to handle saving missing kids data
  helperMissingElderly: async (helperMissingElderly) => {
    try {
      // Destructure data from helperMissingKids object
      const {
        name,
        gender,
        age,
        date,
        time,
        place,
        height,
        color,
        marks,
        religion,
        residence,
        dress,
        reward,
        additional,
      } = helperMissingElderly;

      // Create a new missing kid object
      const newMissingElderly = new missingElderly({
        name: name,
        gender: gender,
        age: age,
        date: date,
        time: time,
        place: place,
        height: height,
        color: color,
        marks: marks,
        religion: religion,
        residence: residence,
        dress: dress,
        reward: reward,
        additional: additional,
        createddate: new Date(), // Assuming you want to set the creation date automatically
      });

      // Save the missing kid to the database
      const savedMissingElderly = await newMissingElderly.save();

      return savedMissingElderly;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
