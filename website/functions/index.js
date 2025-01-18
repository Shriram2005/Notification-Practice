const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { notification } = req.body;
    
    if (!notification) {
        res.status(400).send('Missing notification data');
        return;
    }

    try {
        await admin.messaging().send({
            topic: 'all_users',
            notification: notification
        });
        res.status(200).send('Notification sent successfully to all users');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send('Error sending notification: ' + error.message);
    }
});
