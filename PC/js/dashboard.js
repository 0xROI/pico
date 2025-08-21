// dashboard.js
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { auth } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const container = document.querySelector('.container');

    // Check authentication state when the page loads
    onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Check if the user is on the registration page
        const isRegistrationPage = window.location.pathname.includes('register.html');

        // Redirect to login.html only if the user is not on the registration page
        if (!isRegistrationPage) {
            redirectToLogin();
        }
    } else {
        // Show the body and container for authenticated users
        body.style.display = 'block';
        container.style.display = 'block';
        displayParentInformation(user);
        displayChildInformation(user);
    }
});

    function redirectToLogin() {
        // Redirect to login.html
       window.location.href = "login.html";
    }

    function displayParentInformation(user) {
      const parentInfoContainer = document.getElementById('parentInformation');
      const userId = user.uid;
  
      // Assuming 'name' and 'email' are stored under 'users/parents/{userId}'
      const parentRef = ref(getDatabase(), `users/parents/${userId}`);
  
      get(parentRef)
          .then((snapshot) => {
              if (snapshot.exists()) {
                  const parentData = snapshot.val();
                  parentInfoContainer.innerHTML = `
                      <div class="mb-3">
                          <p><strong>Organization Name:</strong><b> ${parentData.name} </b></p>
                          <p><strong>Admin Email:</strong> ${parentData.email}</p>
                      </div>
                  `;
              } else {
                  parentInfoContainer.innerHTML = '<p>No Organization information found</p>';
              }
          })
          .catch((error) => {
              console.error("Error fetching parent information:", error);
              parentInfoContainer.innerHTML = `<p>Error fetching parent information: ${error.message}</p>`;
          });
  }

  // ... (previous code)

  function displayChildInformation(user) {
   const userEmail = user.email;
   const childInformationContainer = document.getElementById('childInformation');
   const dbRef = ref(getDatabase(), 'users/childs');

   get(dbRef)
       .then((snapshot) => {
           if (snapshot.exists()) {
               const childData = snapshot.val();
               let childCount = 0;

               Object.keys(childData).forEach((childKey) => {
                   const child = childData[childKey];
                   if (child.parentEmail === userEmail) {
                       childCount++;
                       const childCard = document.createElement('div');
                       childCard.classList.add('card', 'mb-3', 'child-card');
                       childCard.style.maxWidth = '540px';
                       childCard.innerHTML = `
                           <div class="row no-gutters">
                               <div class="col-md-4">
                                   <img src="imgs/avtr.jpg" class="card-img" alt="Avatar">
                               </div>
                               <div class="col-md-8">
                                   <div class="card-body">
                                       <h5 class="card-title">Target ${childCount}</h5>
                                       <p class="card-text">Name: ${child.name}</p>
                                       <p class="card-text">Email: ${child.email}</p>
                                       <button class="btn btn-primary view-activity-btn" data-child-name="${child.name}">View Activity</button>
                                   </div>
                               </div>
                           </div>
                       `;
                       childInformationContainer.appendChild(childCard);
                   }
               });

               if (childCount === 0) {
                   childInformationContainer.innerHTML += '<p>No target set yet</p>';
               }
           } else {
               childInformationContainer.innerHTML += '<p>No target set yet</p>';
           }
       })
       .catch((error) => {
           console.error("Error fetching child information:", error);
           childInformationContainer.innerHTML += `<p>Error fetching child information: ${error.message}</p>`;
       });
}


// Use event delegation to handle button clicks
document.getElementById('childInformation').addEventListener('click', function (event) {
   const target = event.target;
   if (target.classList.contains('view-activity-btn')) {
       const childName = target.getAttribute('data-child-name');
       openChildWindow(childName);
   }
});

// Function to open child activity window
function openChildWindow(childName) {
   // Open childactivity.html in a new window with the childName parameter
   const encodedChildName = encodeURIComponent(childName);
   window.open(`childactivity.html?childName=${encodedChildName}`, '_blank');
}

// ... (remaining code)


// Add the following function to your script to handle the "View Activity" button click
function viewActivity(childName) {
   // Implement the logic to view activity for the specified child
   alert(`Viewing activity for ${childName}`);
}

// Add an event listener for the logout button
document.getElementById('logoutBtn').addEventListener('click', function () {
   // Call the logout function when the button is clicked
   logout();
});

function logout() {
   auth.signOut()
       .then(() => {
           // Redirect to login.html after successful logout
           redirectToLogin();
       })
       .catch((error) => {
           console.error('Logout error:', error);
       });
}



});
