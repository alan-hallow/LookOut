const missingElderlyUpdate = require("./../../models/admin-model-elderly-update");

module.exports = {
  // Async function to handle saving missing kids data
  newUpdate: async (newUpdateContent) => {
    try {
      // Destructure data from newCommentContent object
      const { postId, update } = newUpdateContent;

      // Create a new missing kids comment object
      const newUpdateSave = new missingElderlyUpdate({
        postId: postId,
        update: update,
        createddate: new Date(), // Assuming you want to set the creation date automatically
      });

      // Save the missing kids comment to the database
      const newElderlyUpdateSaved = await newUpdateSave.save();

      return newUpdateSaved;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
