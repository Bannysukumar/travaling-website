// Push Notification System
class NotificationSystem {
    constructor() {
        this.messaging = firebase.messaging();
        this.initialize();
    }

    async initialize() {
        try {
            // Request permission
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                // Get FCM token
                const token = await this.messaging.getToken();
                await this.saveToken(token);
            }

            // Handle incoming messages
            this.messaging.onMessage((payload) => {
                this.showNotification(payload);
            });

            // Handle notification clicks
            this.messaging.onNotificationOpenedApp((payload) => {
                this.handleNotificationClick(payload);
            });

            // Check if app was opened from notification
            this.checkInitialNotification();
        } catch (error) {
            console.error('Notification initialization error:', error);
        }
    }

    async saveToken(token) {
        const user = firebase.auth().currentUser;
        if (user) {
            await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    fcmToken: token
                });
        }
    }

    showNotification(payload) {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            data: payload.data
        });

        notification.onclick = () => {
            this.handleNotificationClick(payload);
        };
    }

    handleNotificationClick(payload) {
        // Handle different notification types
        switch (payload.data.type) {
            case 'booking_confirmation':
                window.location.href = `/booking.html?id=${payload.data.bookingId}`;
                break;
            case 'booking_update':
                window.location.href = `/booking.html?id=${payload.data.bookingId}`;
                break;
            case 'chat_message':
                // Open chat widget
                document.getElementById('chatContainer').classList.add('active');
                break;
            default:
                console.log('Unknown notification type:', payload.data.type);
        }
    }

    async checkInitialNotification() {
        try {
            const messaging = firebase.messaging();
            const notification = await messaging.getInitialNotification();
            if (notification) {
                this.handleNotificationClick(notification);
            }
        } catch (error) {
            console.error('Error checking initial notification:', error);
        }
    }

    // Send notification to specific user
    async sendNotification(userId, title, body, data = {}) {
        try {
            const userDoc = await firebase.firestore()
                .collection('users')
                .doc(userId)
                .get();

            if (userDoc.exists && userDoc.data().fcmToken) {
                const message = {
                    notification: {
                        title,
                        body
                    },
                    data: {
                        ...data,
                        click_action: 'FLUTTER_NOTIFICATION_CLICK'
                    },
                    token: userDoc.data().fcmToken
                };

                await fetch('https://fcm.googleapis.com/fcm/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': `key=${firebaseConfig.messagingSenderId}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem(); 