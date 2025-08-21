// logout.js
import { signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { auth } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function () {
   const logoutBtn = document.getElementById('logoutBtn');

   logoutBtn.addEventListener('click', function () {
      signOut(auth)
         .then(() => {
            console.log('User signed out');
            redirectToLogin();
         })
         .catch((error) => {
            console.error('Logout error:', error.message);
         });
   });

   // Function to redirect to login.html after logout
   function redirectToLogin() {
      // Redirect to login.html after logout
     window.location.href = "login.html";
   }
});
