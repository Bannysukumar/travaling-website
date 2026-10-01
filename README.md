# TravelEase - Travel Booking Website

A modern, responsive travel booking website with an admin panel for managing bookings, users, and travel packages.

## Features

- User authentication (signup/login)
- Flight booking
- Hotel booking
- Tour booking
- Admin panel for managing:
  - Bookings
  - Users
  - Flights
  - Hotels
  - Tours
  - Contact messages
- Responsive design for all devices
- Real-time updates using Firebase
- Secure payment integration with UPI

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Database: Firebase Firestore
- Authentication: Firebase Auth
- Payment Gateway: UPI

## Prerequisites

- A Firebase account
- A UPI merchant account
- Modern web browser with JavaScript enabled

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd travaling-website
```

2. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Get your Firebase configuration

3. Update Firebase configuration:
   - Open `js/config.js`
   - Replace the placeholder values with your Firebase configuration:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

4. Set up UPI payment gateway:
   - Sign up for a UPI merchant account
   - Get your merchant credentials
   - Update the payment integration code in `js/main.js`

5. Create an admin user:
   - Sign up a new user through the website
   - In Firebase Console, go to Firestore
   - Find the user document in the 'users' collection
   - Add `isAdmin: true` to the user document

6. Run the website:
   - Use a local server (e.g., Live Server in VS Code)
   - Open `index.html` in your browser

## Project Structure

```
travaling-website/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── auth.js
│   └── main.js
├── admin/
│   ├── index.html
│   ├── css/
│   │   └── admin.css
│   └── js/
│       └── admin.js
└── README.md
```

## Security Considerations

- All sensitive data is stored in Firebase
- Admin access is restricted to authorized users
- Payment information is handled securely through UPI
- User authentication is managed by Firebase Auth

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@travelease.com or create an issue in the repository.

<!-- readme-seo: bannysukumar -->

## Open source

This repository is open source and maintained by [Banny Sukumar](https://github.com/Bannysukumar). Travaling Website is published so other developers can study the code and contribute.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Banny Sukumar. See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to help.
