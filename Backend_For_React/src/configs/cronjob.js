import cron from 'node-cron';
import { MsgModel } from '../models/msg.model.js';
import { UserModel } from '../models/user.model.js';



cron.schedule('5 * * * *', async () => { // due to spin dont in 15 mnt of render running thiscron job too fast, every 5mnt
  console.log('Cron job running every 12 hours');
  await cleanUpMessages();
});





const cleanUpMessages = async () => {
  try {
    // Get all existing user IDs (who have not been deleted)
    const existingUserIds = await UserModel.distinct('_id');

    // Delete all messages where 'to' is NOT in the existing user list
    const result = await MsgModel.deleteMany({
      to: { $nin: existingUserIds },
    });
  } catch (error) {
    console.error('Error while cleaning messages:', error.message);
  }
};
