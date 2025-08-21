// register.js
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

import { auth } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function () {
   const registerForm = document.querySelector('form');

   registerForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission behavior

      var regName = document.getElementById('name').value;
      var regEmail = document.getElementById('email').value;
      var regPassword = document.getElementById('password').value;

      // Validate if all fields are filled
      if (!regName || !regEmail || !regPassword) {
         alert('Please fill in all fields.');
         return;
      }

      // Create user with email and password
      createUserWithEmailAndPassword(auth, regEmail, regPassword)
         .then((userCredential) => {
            var user = userCredential.user;
            // Save user's name to the Realtime Database
            saveUserData(user.uid, regEmail, regName)
               .then(() => {
                  alert('Registration successful! You have successfully registered.');
                  // Optionally, you can perform additional actions here
               })
               .catch((error) => {
                  console.error('Error saving user data:', error.message);
               });
         })
         .catch((error) => {
            var errorMessage = error.message;
            alert(errorMessage);
      });
   });

   function saveUserData(userId, userEmail, userName) {
      console.log("Saving user data:", userId, userEmail, userName);
      const db = getDatabase();
      const dbRef = ref(db, `users/parents/${userId}`);
      return set(dbRef, {
         name: userName,
         email: userEmail,
         // Add more fields as needed
      });
   }
});
