import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Check authentication state
const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is authenticated, proceed with loading child information
        loadChildInformation();
    } else {
        // User is not authenticated, redirect to login page
        redirectToLogin();
    }
});

function loadChildInformation() {
    const queryParams = new URLSearchParams(window.location.search);
    const childName = queryParams.get('childName');

    const childInfoContainer = document.getElementById('childInfo');

    if (childName) {
        const dbRef = ref(getDatabase(), 'users/childs');

        get(dbRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const childData = snapshot.val();
                    let matchingChild = null;

                    // Iterate through child nodes to find the matching name
                    Object.keys(childData).forEach((childKey) => {
                        const child = childData[childKey];
                        if (child.name === childName) {
                            matchingChild = child;
                        }
                    });

                    if (matchingChild) {
                        // Use Bootstrap card component for a stylish look
                        childInfoContainer.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${matchingChild.name}</h5>
                                    <p class="card-text">Email: ${matchingChild.email}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        childInfoContainer.innerHTML = '<p>No matching child found</p>';
                    }
                } else {
                    childInfoContainer.innerHTML = '<p>No child nodes found</p>';
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                childInfoContainer.innerHTML = `<p>Error fetching child information: ${error.message}</p>`;
            });
    } else {
        childInfoContainer.innerHTML = '<p>No child name provided</p>';
    }
}

function redirectToLogin() {
    // Redirect to login.html
    window.location.href = 'login.html';
}
