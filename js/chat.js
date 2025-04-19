// Chat System
class ChatSystem {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.chatRef = firebase.database().ref('chats');
        this.currentUser = null;
        this.isAdmin = false;
        
        this.initialize();
    }

    async initialize() {
        // Check if user is logged in
        this.currentUser = firebase.auth().currentUser;
        if (this.currentUser) {
            // Check if user is admin
            const userDoc = await firebase.firestore().collection('users').doc(this.currentUser.uid).get();
            this.isAdmin = userDoc.exists && userDoc.data().isAdmin;
        }

        this.setupEventListeners();
        this.loadMessages();
    }

    setupEventListeners() {
        // Send message button
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key in input
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Listen for new messages
        this.chatRef.on('child_added', (snapshot) => {
            this.displayMessage(snapshot.val());
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || !this.currentUser) return;

        const messageData = {
            text: message,
            userId: this.currentUser.uid,
            userName: this.currentUser.displayName || 'Anonymous',
            timestamp: Date.now(),
            isAdmin: this.isAdmin
        };

        try {
            await this.chatRef.push(messageData);
            this.chatInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.isAdmin ? 'admin' : ''}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString();
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="user-name">${message.userName}</span>
                <span class="time">${time}</span>
            </div>
            <div class="message-content">${message.text}</div>
        `;

        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    loadMessages() {
        // Load last 50 messages
        this.chatRef.limitToLast(50).once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                this.displayMessage(childSnapshot.val());
            });
        });
    }
}

// Initialize chat system
document.addEventListener('DOMContentLoaded', () => {
    new ChatSystem();
}); 