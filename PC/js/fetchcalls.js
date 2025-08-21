// Import necessary Firebase modules
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Function to fetch and display child calls
function fetchChildCalls() {
    const queryParams = new URLSearchParams(window.location.search);
    const urlName = queryParams.get('childName');

    const callsContainer = document.getElementById('callsContainer');

    if (urlName) {
        const dbRef = ref(getDatabase(), 'users/childs');

        get(dbRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const childData = snapshot.val();

                    // Iterate through child nodes to find the matching name
                    Object.keys(childData).forEach((childUid) => {
                        const child = childData[childUid];
                        if (child.name === urlName) {
                            // Matching child found, fetch and display calls
                            fetchCalls(childUid);
                            return;
                        }
                    });

                    // If the loop completes and no matching child is found
                    displayNoCalls();
                } else {
                    // No child nodes found
                    displayNoCalls();
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                displayNoCalls(`Error fetching child information: ${error.message}`);
            });
    } else {
        // No child name provided in the URL
        displayNoCalls('No child name provided in the URL');
    }

    function fetchCalls(childUid) {
        const callsRef = ref(getDatabase(), `users/childs/${childUid}/calls`);

        get(callsRef)
            .then((callsSnapshot) => {
                if (callsSnapshot.exists()) {
                    const callsData = callsSnapshot.val();
                    displayCalls(callsData);
                } else {
                    displayNoCalls('No calls found for the child');
                }
            })
            .catch((error) => {
                console.error('Error fetching calls:', error);
                displayNoCalls(`Error fetching calls: ${error.message}`);
            });
    }

    function displayCalls(calls) {
        const callsContainer = document.getElementById('callsContainer');
    
        if (callsContainer && calls) {
            // Clear previous calls
            callsContainer.innerHTML = '';
    
            // Create a list group to display calls with Bootstrap styling
            const listGroup = document.createElement('div');
            listGroup.classList.add('list-group');
    
            // Iterate through each call
            Object.keys(calls).forEach((callId) => {
                const callData = calls[callId];
    
                // Create list item for each call
                const listItem = document.createElement('div');
                
                // Check if the contactName matches a specific condition, and add a custom class
                if (callData.contactName === 'YourCondition') {
                    listItem.classList.add('list-group-item', 'list-group-item-action', 'highlighted');
                } else {
                    listItem.classList.add('list-group-item', 'list-group-item-action');
                }
    
                // Add Bootstrap styles to the list item
                listItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${callData.contactName}</h5>
                        <small>${callData.callTime}</small>
                    </div>
                    <p class="mb-1">${callData.callType}</p>
                    <p class="mb-1">Duration: ${callData.callDurationInSeconds} seconds</p>
                    <small>Caller Phone Number: ${callData.phoneNumber}</small>
                `;
    
                // Append list item to the list group
                listGroup.appendChild(listItem);
            });
    
            // Append the list group to the callsContainer
            callsContainer.appendChild(listGroup);
        }
    }

    function displayNoCalls(message = 'No calls found') {
        callsContainer.innerHTML = `<p>${message}</p>`;
    }
}

// Call the function to fetch and display child calls
fetchChildCalls();
