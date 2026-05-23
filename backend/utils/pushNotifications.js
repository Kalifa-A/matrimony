const webpush = require('web-push');
const Admin = require('../models/Admin');

webpush.setVapidDetails(
  `mailto:${process.env.BREVO_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (payload) => {
  try {
    const admins = await Admin.find({ 'subscriptions.0': { $exists: true } });
    
    const notifications = [];
    admins.forEach(admin => {
      admin.subscriptions.forEach(sub => {
        notifications.push(
          webpush.sendNotification(sub, JSON.stringify(payload))
            .catch(err => {
              if (err.statusCode === 404 || err.statusCode === 410) {
                // Subscription has expired or is no longer valid
                console.log('Removing invalid subscription');
                return Admin.updateOne(
                  { _id: admin._id },
                  { $pull: { subscriptions: { endpoint: sub.endpoint } } }
                );
              }
              console.error('Push notification error:', err);
            })
        );
      });
    });

    await Promise.all(notifications);
  } catch (err) {
    console.error('Failed to send push notifications:', err);
  }
};

module.exports = { sendPushNotification };
