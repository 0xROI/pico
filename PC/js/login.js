// login.js
import { onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { auth } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function () {
   const loginForm = document.querySelector('form');

   // Check authentication state when the page loads
   onAuthStateChanged(auth, (user) => {
      if (user) {
         // User is already authenticated, redirect to dashboard
         redirectToDashboard();
      }
   });

   loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            const user = userCredential.user;
            console.log('User logged in:', user);
            redirectToDashboard();
         })
         .catch((error) => {
            const errorMessage = error.message;
            console.error('Login error:', errorMessage);
            alert(errorMessage);
         });
   });

   // Function to redirect to dashboard.html after successful login
   function redirectToDashboard() {
      // Redirect to dashboard.html after successful login
     window.location.href = "dashboard.html";
   }
});
