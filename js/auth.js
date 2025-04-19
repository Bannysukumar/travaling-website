import { auth } from './config.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const closeBtns = document.querySelectorAll('.close');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const logoutBtn = document.getElementById('logoutBtn');
    const googleLoginBtn = document.getElementById('googleLogin');
    const facebookLoginBtn = document.getElementById('facebookLogin');

    // Providers
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    // Show Login Modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    // Switch between Login and Signup
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Close modals when clicking the X
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Logged in:', userCredential.user);
                loginModal.style.display = 'none';
                loginForm.reset();
            } catch (error) {
                console.error('Login error:', error.message);
                alert(error.message);
            }
        });
    }

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            const confirmPassword = signupForm.confirmPassword.value;

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('Signed up:', userCredential.user);
                signupModal.style.display = 'none';
                signupForm.reset();
            } catch (error) {
                console.error('Signup error:', error.message);
                alert(error.message);
            }
        });
    }

    // Google login
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                console.log('Google login successful:', result.user);
                loginModal.style.display = 'none';
            } catch (error) {
                console.error('Google login error:', error.message);
                alert(error.message);
            }
        });
    }

    // Facebook login
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, facebookProvider);
                console.log('Facebook login successful:', result.user);
                loginModal.style.display = 'none';
            } catch (error) {
                console.error('Facebook login error:', error.message);
                alert(error.message);
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log('Logged out successfully');
            } catch (error) {
                console.error('Logout error:', error.message);
                alert(error.message);
            }
        });
    }

    // Auth state observer
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            document.querySelectorAll('.auth-required').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.no-auth-required').forEach(el => el.style.display = 'none');
        } else {
            // User is signed out
            document.querySelectorAll('.auth-required').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.no-auth-required').forEach(el => el.style.display = 'block');
        }
    });
}); 