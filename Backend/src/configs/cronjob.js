import cron from 'node-cron';
import { MsgModel } from '../models/msg.model.js';
import { UserModel } from '../models/user.model.js';



cron.schedule('0 */12 * * *', async () => {
  console.log('Cron job running every 12 hours');
  await cleanUpMessages();
});




// Inside your cron job or cleanup function
const cleanUpMessages = async () => {
  try {
    // Get all existing user IDs (who have not been deleted)
    const existingUserIds = await UserModel.distinct('_id');

    // Delete all messages where 'to' is NOT in the existing user list
    const result = await MsgModel.deleteMany({
      to: { $nin: existingUserIds },
    });

    console.log(`${result.deletedCount} orphaned messages deleted.`);
  } catch (error) {
    console.error('Error while cleaning messages:', error.message);
  }
};
