// DOM Elements
const flightsGrid = document.getElementById('flightsGrid');
const hotelsGrid = document.getElementById('hotelsGrid');
const toursGrid = document.getElementById('toursGrid');
const destinationsGrid = document.getElementById('destinationsGrid');
const dealsGrid = document.getElementById('dealsGrid');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const searchResultsSection = document.getElementById('searchResults');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const bookingDetails = document.getElementById('bookingDetails');
const tabBtns = document.querySelectorAll('.tab-btn');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const ratingFilter = document.getElementById('ratingFilter');
const sortFilter = document.getElementById('sortFilter');
const searchBox = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-btn');
const contactForm = document.getElementById('contactForm');

// Payment Processing
const stripe = Stripe('your_publishable_key');
const web3 = new Web3(Web3.givenProvider);

// Payment Modal Elements
const paymentModal = document.getElementById('paymentModal');
const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
const upiPaymentForm = document.getElementById('upiPaymentForm');
const cryptoPaymentForm = document.getElementById('cryptoPaymentForm');
const invoiceModal = document.getElementById('invoiceModal');

// Sample data (replace with Firebase data in production)
const sampleFlights = [
    {
        id: 1,
        from: 'New York',
        to: 'London',
        price: 599,
        date: '2024-06-15',
        airline: 'Airways Express',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    // Add more sample flights
];

const sampleHotels = [
    {
        id: 1,
        name: 'Luxury Resort',
        location: 'Maldives',
        price: 299,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    // Add more sample hotels
];

const sampleTours = [
    {
        id: 1,
        name: 'Paris City Tour',
        duration: '3 days',
        price: 499,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    // Add more sample tours
];

const featuredDestinations = [
    {
        id: 1,
        name: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        description: 'The City of Light'
    },
    {
        id: 2,
        name: 'Bali, Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        description: 'Paradise Island'
    },
    // Add more destinations
];

const trendingDeals = [
    {
        id: 1,
        title: 'Summer Special',
        description: '20% off on all flights to Europe',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        discount: '20% OFF',
        validUntil: '2024-08-31'
    },
    // Add more deals
];

// Reviews Data
const reviews = [
    {
        id: 1,
        destination: 'Paris, France',
        rating: 4.8,
        user: {
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        content: 'Amazing experience! The city of lights never disappoints.',
        date: '2024-02-15'
    },
    // Add more reviews
];

// Load travel options
async function loadTravelOptions() {
    try {
        // In production, fetch from Firebase
        displayFlights(sampleFlights);
        displayHotels(sampleHotels);
        displayTours(sampleTours);
    } catch (error) {
        console.error('Error loading travel options:', error);
    }
}

// Display flights
function displayFlights(flights) {
    flightsGrid.innerHTML = flights.map(flight => `
        <div class="card">
            <img src="${flight.image}" alt="${flight.from} to ${flight.to}">
            <div class="card-content">
                <h3>${flight.from} to ${flight.to}</h3>
                <p>Airline: ${flight.airline}</p>
                <p>Date: ${flight.date}</p>
                <p>Price: $${flight.price}</p>
                <button class="btn" onclick="bookFlight(${flight.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Display hotels
function displayHotels(hotels) {
    hotelsGrid.innerHTML = hotels.map(hotel => `
        <div class="card">
            <img src="${hotel.image}" alt="${hotel.name}">
            <div class="card-content">
                <h3>${hotel.name}</h3>
                <p>Location: ${hotel.location}</p>
                <p>Rating: ${hotel.rating}/5</p>
                <p>Price: $${hotel.price}/night</p>
                <button class="btn" onclick="bookHotel(${hotel.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Display tours
function displayTours(tours) {
    toursGrid.innerHTML = tours.map(tour => `
        <div class="card">
            <img src="${tour.image}" alt="${tour.name}">
            <div class="card-content">
                <h3>${tour.name}</h3>
                <p>Duration: ${tour.duration}</p>
                <p>Rating: ${tour.rating}/5</p>
                <p>Price: $${tour.price}</p>
                <button class="btn" onclick="bookTour(${tour.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Booking functions
async function bookFlight(flightId) {
    if (!auth.currentUser) {
        alert('Please login to book a flight');
        return;
    }

    try {
        // In production, create booking in Firebase
        const booking = {
            userId: auth.currentUser.uid,
            flightId: flightId,
            bookingDate: new Date(),
            status: 'pending'
        };

        await db.collection('bookings').add(booking);
        alert('Flight booked successfully!');
    } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed: ' + error.message);
    }
}

async function bookHotel(hotelId) {
    if (!auth.currentUser) {
        alert('Please login to book a hotel');
        return;
    }

    try {
        // In production, create booking in Firebase
        const booking = {
            userId: auth.currentUser.uid,
            hotelId: hotelId,
            bookingDate: new Date(),
            status: 'pending'
        };

        await db.collection('bookings').add(booking);
        alert('Hotel booked successfully!');
    } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed: ' + error.message);
    }
}

async function bookTour(tourId) {
    if (!auth.currentUser) {
        alert('Please login to book a tour');
        return;
    }

    try {
        // In production, create booking in Firebase
        const booking = {
            userId: auth.currentUser.uid,
            tourId: tourId,
            bookingDate: new Date(),
            status: 'pending'
        };

        await db.collection('bookings').add(booking);
        alert('Tour booked successfully!');
    } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed: ' + error.message);
    }
}

// Search functionality
searchBtn.addEventListener('click', () => {
    const searchTerm = searchBox.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', searchTerm);
});

// Contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const message = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date()
    };

    try {
        await db.collection('messages').add(message);
        alert('Message sent successfully!');
        contactForm.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message: ' + error.message);
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadTravelOptions();
    loadFeaturedDestinations();
    loadTrendingDeals();
    loadReviews();
    setupEventListeners();
    
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is running in standalone mode');
    }

    // Navigation elements
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.querySelector('#loginModal');
    const signupModal = document.querySelector('#signupModal');

    // Add event listeners only if elements exist
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Form submissions
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your search logic here
        });
    }

    // Initialize any third-party libraries here
    initializeMap();
    setupMetaMask();
});

// Setup Event Listeners
function setupEventListeners() {
    // Tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Price range
    priceRange.addEventListener('input', (e) => {
        priceValue.textContent = `$${e.target.value}`;
        filterResults();
    });

    // Rating filter
    ratingFilter.addEventListener('change', filterResults);

    // Sort filter
    sortFilter.addEventListener('change', filterResults);

    // Booking form
    bookingForm.addEventListener('submit', handleBookingSubmit);
}

// Load Featured Destinations
function loadFeaturedDestinations() {
    destinationsGrid.innerHTML = featuredDestinations.map(dest => `
        <div class="destination-card" onclick="searchDestination('${dest.name}')">
            <img src="${dest.image}" alt="${dest.name}">
            <div class="destination-info">
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
            </div>
        </div>
    `).join('');
}

// Load Trending Deals
function loadTrendingDeals() {
    dealsGrid.innerHTML = trendingDeals.map(deal => `
        <div class="deal-card">
            <div class="deal-badge">${deal.discount}</div>
            <img src="${deal.image}" alt="${deal.title}">
            <div class="card-content">
                <h3>${deal.title}</h3>
                <p>${deal.description}</p>
                <p>Valid until: ${new Date(deal.validUntil).toLocaleDateString()}</p>
                <button class="btn" onclick="applyDeal(${deal.id})">Apply Deal</button>
            </div>
        </div>
    `).join('');
}

// Search Functionality
async function searchTravel() {
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

    if (!destination || !date || !guests) {
        alert('Please fill in all search fields');
        return;
    }

    try {
        // Show search results section
        searchResultsSection.style.display = 'block';
        
        // In production, fetch from Firebase based on activeTab
        const results = await fetchSearchResults(activeTab, destination, date, guests);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        alert('Search failed: ' + error.message);
    }
}

// Filter Results
function filterResults() {
    const price = parseInt(priceRange.value);
    const rating = ratingFilter.value;
    const sortBy = sortFilter.value;
    
    // Implement filtering logic here
    // This would typically filter the current search results
    // based on the selected criteria
}

// Handle Booking
function initiateBooking(item) {
    if (!auth.currentUser) {
        alert('Please login to make a booking');
        return;
    }

    // Show booking modal with item details
    bookingDetails.innerHTML = `
        <p><strong>Item:</strong> ${item.name}</p>
        <p><strong>Price:</strong> $${item.price}</p>
        <p><strong>Date:</strong> ${item.date}</p>
    `;
    bookingModal.style.display = 'block';
}

// Handle Booking Submit
async function handleBookingSubmit(e) {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const bookingData = {
        userId: auth.currentUser.uid,
        ...Object.fromEntries(formData),
        bookingDate: new Date(),
        status: 'pending'
    };

    try {
        await db.collection('bookings').add(bookingData);
        alert('Booking successful!');
        bookingModal.style.display = 'none';
        bookingForm.reset();
    } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed: ' + error.message);
    }
}

// Utility Functions
function searchDestination(destination) {
    document.getElementById('destination').value = destination;
    searchTravel();
}

function applyDeal(dealId) {
    // Implement deal application logic
    console.log('Applying deal:', dealId);
}

// Mock function for fetching search results
async function fetchSearchResults(type, destination, date, guests) {
    // In production, this would fetch from Firebase
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    name: `${type} to ${destination}`,
                    price: Math.floor(Math.random() * 1000) + 100,
                    date: date,
                    rating: (Math.random() * 2 + 3).toFixed(1)
                },
                // Add more mock results
            ]);
        }, 1000);
    });
}

// Display Search Results
function displaySearchResults(results) {
    searchResultsGrid.innerHTML = results.map(item => `
        <div class="card">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Date: ${item.date}</p>
                <p>Rating: ${item.rating}/5</p>
                <button class="btn" onclick="initiateBooking(${JSON.stringify(item)})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Load Reviews
function loadReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    reviewsGrid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <img src="${review.user.avatar}" alt="${review.user.name}" class="review-avatar">
                <div class="review-info">
                    <h3>${review.user.name}</h3>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
            </div>
            <div class="review-content">
                <h4>${review.destination}</h4>
                <p>${review.content}</p>
                <small>${new Date(review.date).toLocaleDateString()}</small>
            </div>
        </div>
    `).join('');
}

// Generate Stars for Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Payment Processing
async function processUPIPayment() {
    const upiId = document.getElementById('upiId').value;
    const amount = document.getElementById('upiAmount').value;
    
    if (!upiId) {
        alert('Please enter a valid UPI ID');
        return;
    }
    
    try {
        // Show loading state
        paymentModal.classList.add('loading');
        
        // In production, integrate with actual UPI payment gateway
        await simulatePayment('upi', amount);
        
        // Show success and generate invoice
        showInvoice({
            method: 'UPI',
            amount: amount,
            transactionId: generateTransactionId()
        });
    } catch (error) {
        console.error('UPI payment error:', error);
        alert('Payment failed: ' + error.message);
    } finally {
        paymentModal.classList.remove('loading');
    }
}

async function processCryptoPayment() {
    const cryptoType = document.getElementById('cryptoType').value;
    const amount = document.getElementById('cryptoAmount').value;
    
    try {
        // Show loading state
        paymentModal.classList.add('loading');
        
        // In production, integrate with actual crypto payment gateway
        await simulatePayment('crypto', amount);
        
        // Show success and generate invoice
        showInvoice({
            method: cryptoType.toUpperCase(),
            amount: amount,
            transactionId: generateTransactionId()
        });
    } catch (error) {
        console.error('Crypto payment error:', error);
        alert('Payment failed: ' + error.message);
    } finally {
        paymentModal.classList.remove('loading');
    }
}

// Simulate Payment (replace with actual payment processing)
async function simulatePayment(method, amount) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                method,
                amount
            });
        }, 2000);
    });
}

// Generate Transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now().toString().slice(-8);
}

// Show Invoice
function showInvoice(paymentDetails) {
    const bookingInfo = document.getElementById('bookingInfo');
    const paymentInfo = document.getElementById('paymentInfo');
    const totalAmount = document.getElementById('totalAmount');
    const invoiceNumber = document.getElementById('invoiceNumber');
    
    // Generate invoice number
    invoiceNumber.textContent = 'INV' + Date.now().toString().slice(-8);
    
    // Populate booking info
    bookingInfo.innerHTML = `
        <p><strong>Booking ID:</strong> ${generateTransactionId()}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Status:</strong> Confirmed</p>
    `;
    
    // Populate payment info
    paymentInfo.innerHTML = `
        <p><strong>Method:</strong> ${paymentDetails.method}</p>
        <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
        <p><strong>Amount:</strong> $${paymentDetails.amount}</p>
    `;
    
    // Set total amount
    totalAmount.textContent = `$${paymentDetails.amount}`;
    
    // Show invoice modal
    paymentModal.style.display = 'none';
    invoiceModal.style.display = 'block';
}

// Download Invoice
function downloadInvoice() {
    // In production, generate and download PDF invoice
    alert('Invoice download feature will be implemented in production');
}

// Payment Method Selection
paymentMethodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        paymentMethodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const method = btn.dataset.method;
        if (method === 'upi') {
            upiPaymentForm.style.display = 'block';
            cryptoPaymentForm.style.display = 'none';
        } else {
            upiPaymentForm.style.display = 'none';
            cryptoPaymentForm.style.display = 'block';
        }
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
    mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        mobileMenuToggle.querySelector('i').classList.remove('fa-times');
    }
});

// Map initialization function
function initializeMap() {
    if (typeof google !== 'undefined' && google.maps) {
        // Your Google Maps initialization code
    } else {
        console.warn('Google Maps API not loaded');
    }
}

// MetaMask setup function
function setupMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('disconnect', () => {
            console.log('MetaMask disconnected');
        });
    } else {
        console.warn('MetaMask not detected');
    }
} 