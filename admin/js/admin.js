// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links li');
const logoutBtn = document.getElementById('logoutBtn');
const addFlightModal = document.getElementById('addFlightModal');
const userDetailsModal = document.getElementById('userDetailsModal');
const addFlightForm = document.getElementById('addFlightForm');

// Charts
let revenueChart, bookingChart, reportChart;

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    setupEventListeners();
    loadDashboardData();
});

// Check Admin Authentication
async function checkAdminAuth() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists || !userDoc.data().isAdmin) {
            window.location.href = '../index.html';
            return;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '../index.html';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.id === 'logoutBtn') {
                handleLogout();
                return;
            }
            const section = link.dataset.section;
            showSection(section);
        });
    });

    // Add Flight Form
    addFlightForm.addEventListener('submit', handleAddFlight);

    // Filters
    document.getElementById('bookingStatus').addEventListener('change', filterBookings);
    document.getElementById('bookingDate').addEventListener('change', filterBookings);
    document.getElementById('userSearch').addEventListener('input', filterUsers);
    document.getElementById('userStatus').addEventListener('change', filterUsers);
}

// Show Section
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Load section-specific data
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'users':
            loadUsers();
            break;
        case 'flights':
            loadFlights();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        // Load statistics
        const stats = await fetchDashboardStats();
        updateDashboardStats(stats);

        // Initialize charts
        initializeCharts();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function fetchDashboardStats() {
    const bookingsSnapshot = await db.collection('bookings').get();
    const usersSnapshot = await db.collection('users').get();
    
    const totalBookings = bookingsSnapshot.size;
    const totalUsers = usersSnapshot.size;
    let totalRevenue = 0;
    let conversionRate = 0;

    bookingsSnapshot.forEach(doc => {
        totalRevenue += doc.data().amount || 0;
    });

    // Calculate conversion rate (bookings / total users)
    if (totalUsers > 0) {
        conversionRate = (totalBookings / totalUsers) * 100;
    }

    return {
        totalBookings,
        totalUsers,
        totalRevenue,
        conversionRate
    };
}

function updateDashboardStats(stats) {
    document.getElementById('totalBookings').textContent = stats.totalBookings;
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalRevenue').textContent = `$${stats.totalRevenue.toLocaleString()}`;
    document.getElementById('conversionRate').textContent = `${stats.conversionRate.toFixed(1)}%`;
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Booking Chart
    const bookingCtx = document.getElementById('bookingChart').getContext('2d');
    bookingChart = new Chart(bookingCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Bookings',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Booking Management
async function loadBookings() {
    try {
        const bookingsSnapshot = await db.collection('bookings').get();
        const bookingsTable = document.getElementById('bookingsTable');
        
        bookingsTable.innerHTML = bookingsSnapshot.docs.map(doc => {
            const booking = doc.data();
            return `
                <tr>
                    <td>${doc.id}</td>
                    <td>${booking.userName}</td>
                    <td>${booking.type}</td>
                    <td>$${booking.amount}</td>
                    <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                    <td>${new Date(booking.date).toLocaleDateString()}</td>
                    <td class="action-buttons">
                        <button class="action-btn view-btn" onclick="viewBooking('${doc.id}')">View</button>
                        <button class="action-btn edit-btn" onclick="updateBookingStatus('${doc.id}')">Update</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

function filterBookings() {
    const status = document.getElementById('bookingStatus').value;
    const date = document.getElementById('bookingDate').value;
    
    // Implement filtering logic
    console.log('Filtering bookings:', { status, date });
}

// User Management
async function loadUsers() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const usersTable = document.getElementById('usersTable');
        
        usersTable.innerHTML = usersSnapshot.docs.map(doc => {
            const user = doc.data();
            return `
                <tr>
                    <td>${doc.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
                    <td>${user.bookings?.length || 0}</td>
                    <td class="action-buttons">
                        <button class="action-btn view-btn" onclick="viewUser('${doc.id}')">View</button>
                        <button class="action-btn edit-btn" onclick="toggleUserStatus('${doc.id}')">Toggle Status</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const status = document.getElementById('userStatus').value;
    
    // Implement filtering logic
    console.log('Filtering users:', { searchTerm, status });
}

// Travel Package Management
async function loadFlights() {
    try {
        const flightsSnapshot = await db.collection('flights').get();
        const flightsTable = document.getElementById('flightsTable');
        
        flightsTable.innerHTML = flightsSnapshot.docs.map(doc => {
            const flight = doc.data();
            return `
                <tr>
                    <td>${doc.id}</td>
                    <td>${flight.from}</td>
                    <td>${flight.to}</td>
                    <td>$${flight.price}</td>
                    <td><span class="status-badge status-${flight.status.toLowerCase()}">${flight.status}</span></td>
                    <td class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editFlight('${doc.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteFlight('${doc.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading flights:', error);
    }
}

async function handleAddFlight(e) {
    e.preventDefault();
    const formData = new FormData(addFlightForm);
    const flightData = {
        from: formData.get('from'),
        to: formData.get('to'),
        price: parseFloat(formData.get('price')),
        date: formData.get('date'),
        airline: formData.get('airline'),
        status: 'active',
        createdAt: new Date()
    };

    try {
        await db.collection('flights').add(flightData);
        alert('Flight added successfully!');
        addFlightModal.style.display = 'none';
        addFlightForm.reset();
        loadFlights();
    } catch (error) {
        console.error('Error adding flight:', error);
        alert('Failed to add flight: ' + error.message);
    }
}

// Reports & Analytics
async function loadReports() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;

    try {
        const reportData = await generateReportData(reportType, startDate, endDate);
        displayReport(reportData);
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

async function generateReportData(type, startDate, endDate) {
    // Implement report data generation based on type
    switch (type) {
        case 'bookings':
            return await generateBookingsReport(startDate, endDate);
        case 'revenue':
            return await generateRevenueReport(startDate, endDate);
        case 'users':
            return await generateUserActivityReport(startDate, endDate);
        default:
            throw new Error('Invalid report type');
    }
}

function displayReport(data) {
    const reportSummary = document.querySelector('.report-summary');
    const reportTable = document.querySelector('.report-table');
    
    // Update summary
    reportSummary.innerHTML = `
        <div class="summary-card">
            <h4>Total ${data.type}</h4>
            <p>${data.total}</p>
        </div>
        <div class="summary-card">
            <h4>Average</h4>
            <p>${data.average}</p>
        </div>
        <div class="summary-card">
            <h4>Growth</h4>
            <p>${data.growth}%</p>
        </div>
    `;

    // Update chart
    if (reportChart) {
        reportChart.destroy();
    }
    
    const ctx = document.getElementById('reportChart').getContext('2d');
    reportChart = new Chart(ctx, {
        type: data.chartType,
        data: data.chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Update table
    reportTable.innerHTML = data.tableHTML;
}

// Utility Functions
function showAddFlightModal() {
    addFlightModal.style.display = 'block';
}

function showUserDetailsModal(userId) {
    userDetailsModal.style.display = 'block';
    loadUserDetails(userId);
}

async function loadUserDetails(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const user = userDoc.data();
        
        document.getElementById('userDetails').innerHTML = `
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>Email: ${user.email}</p>
                <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Status: <span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></p>
            </div>
        `;

        // Load user's booking history
        const bookingsSnapshot = await db.collection('bookings')
            .where('userId', '==', userId)
            .get();

        document.getElementById('userBookings').innerHTML = bookingsSnapshot.docs.map(doc => {
            const booking = doc.data();
            return `
                <div class="booking-item">
                    <p><strong>Booking ID:</strong> ${doc.id}</p>
                    <p><strong>Type:</strong> ${booking.type}</p>
                    <p><strong>Amount:</strong> $${booking.amount}</p>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading user details:', error);
    }
}

// Logout Function
async function handleLogout() {
    try {
        await auth.signOut();
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Export Functions
function exportBookings() {
    // Implement booking export functionality
    console.log('Exporting bookings...');
}

function generateReport() {
    loadReports();
} 