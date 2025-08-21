// Import necessary Firebase modules
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Function to fetch and display child app usage
function fetchChildAppUsage() {
    const queryParams = new URLSearchParams(window.location.search);
    const urlName = queryParams.get('childName');

    const appUsageContainer = document.getElementById('appUsageContainer');

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
                            // Matching child found, fetch and display app usage
                            fetchAppUsage(childUid);
                            return main;
                        }
                    });

                    // If the loop completes and no matching child is found
                    displayNoAppUsage();
                } else {
                    // No child nodes found
                    displayNoAppUsage();
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                displayNoAppUsage(`Error fetching child information: ${error.message}`);
            });
    } else {
        // No child name provided in the URL
        displayNoAppUsage('No child name provided in the URL');
    }

    function fetchAppUsage(childUid) {
        const appUsageRef = ref(getDatabase(), `users/childs/${childUid}/appUsage`);

        get(appUsageRef)
            .then((appUsageSnapshot) => {
                if (appUsageSnapshot.exists()) {
                    const appUsageData = appUsageSnapshot.val();
                    displayAppUsage(appUsageData);
                } else {
                    displayNoAppUsage('No app usage data found for the child');
                }
            })
            .catch((error) => {
                console.error('Error fetching app usage data:', error);
                displayNoAppUsage(`Error fetching app usage data: ${error.message}`);
            });
    }

    function displayAppUsage(appUsage) {
        if (appUsageContainer && appUsage) {
            // Clear previous app usage
            appUsageContainer.innerHTML = '';

            // Create a list group to display app usage with Bootstrap styling
            const listGroup = document.createElement('div');
            listGroup.classList.add('list-group');

            // Iterate through each app usage
            Object.keys(appUsage).forEach((appId) => {
                const usageData = appUsage[appId];

                // Create list item for each app usage
                const listItem = document.createElement('div');
                listItem.classList.add('list-group-item', 'list-group-item-action');

                // Add Bootstrap styles to the list item
                listItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${appId}</h5>
                        <small>${usageData}</small>
                    </div>
                `;

                // Append list item to the list group
                listGroup.appendChild(listItem);
            });

            // Append the list group to the appUsageContainer
            appUsageContainer.appendChild(listGroup);
        }
    }

    function displayNoAppUsage(message = 'No app usage data found') {
        appUsageContainer.innerHTML = `<p>${message}</p>`;
    }
}

// Call the function to fetch and display child app usage
fetchChildAppUsage();
