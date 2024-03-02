const usersNotification = require("./../../models/admin-model-users-notification");

module.exports = {
  // Async function to handle saving missing kids data
  newNotification: async (newNotificationContent) => {
    try {
      // Destructure data from newCommentContent object
      const { postId, notification } = newNotificationContent;

      // Create a new missing kids comment object
      const newNotificationSave = new usersNotification({
        postId: postId,
        notification: notification,
        createddate: new Date(), // Assuming you want to set the creation date automatically
      });

      // Save the missing kids comment to the database
      const newNotificationSaved = await newNotificationSave.save();

      return newNotificationSaved;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
    }
  },
};
