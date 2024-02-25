const missingElderlyComment = require("./../../models/model-elderly-comment");

module.exports = {
  // Async function to handle saving missing kids data
  newComment: async (newCommentContent) => {
    try {
      // Destructure data from newCommentContent object
      const { name, postId, comment } = newCommentContent;

      // Create a new missing kids comment object
      const newCommentSave = new missingElderlyComment({
        name: name,
        postId: postId,
        comment: comment,
        createddate: new Date(), // Assuming you want to set the creation date automatically
      });

      // Save the missing kids comment to the database
      const newCommentSaved = await newCommentSave.save();

      return newCommentSaved;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
