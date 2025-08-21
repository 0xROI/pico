// Import necessary Firebase modules
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

class ChildAppManager {
    constructor() {
        // Initialize your class properties here if needed
    }

    fetchChildApps() {
        const queryParams = new URLSearchParams(window.location.search);
        const urlName = queryParams.get('childName');

        const appsContainer = document.getElementById('appsContainer');

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
                                // Matching child found, fetch and display apps
                                this.fetchApps(childUid);
                                return;
                            }
                        });

                        // If the loop completes and no matching child is found
                        this.displayNoApps();
                    } else {
                        // No child nodes found
                        this.displayNoApps();
                    }
                })
                .catch((error) => {
                    console.error('Error fetching child information:', error);
                    this.displayNoApps(`Error fetching child information: ${error.message}`);
                });
        } else {
            // No child name provided in the URL
            this.displayNoApps('No child name provided in the URL');
        }
    }

    fetchApps(childUid) {
        const appsRef = ref(getDatabase(), `users/childs/${childUid}/apps`);

        get(appsRef)
            .then((appsSnapshot) => {
                if (appsSnapshot.exists()) {
                    const appsData = appsSnapshot.val();
                    this.displayApps(appsData, childUid);
                } else {
                    this.displayNoApps('No apps found for the child');
                }
            })
            .catch((error) => {
                console.error('Error fetching apps:', error);
                this.displayNoApps(`Error fetching apps: ${error.message}`);
            });
    }

    displayApps(apps, childUid) {
        const appsContainer = document.getElementById('appsContainer');

        if (appsContainer && apps) {
            // Clear previous apps
            appsContainer.innerHTML = '';

            // Create a list group to display apps with Bootstrap styling
            const listGroup = document.createElement('div');
            listGroup.classList.add('list-group');

            // Iterate through each app
            Object.keys(apps).forEach((appId) => {
                const appData = apps[appId];

                // Create list item for each app
                const listItem = document.createElement('div');

                // Check if the app is blocked and add a custom class and color
                const appClass = appData.blocked ? 'blocked-app' : 'allowed-app';
                const buttonColor = appData.blocked ? 'btn-danger' : 'btn-success';
                listItem.classList.add('list-group-item', 'list-group-item-action', appClass);

                // Add Bootstrap styles to the list item
                listItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <div>
                            <h5 class="mb-1">${appData.appName}</h5>
                            <small>${appData.packageName}</small>
                        </div>
                        <button type="button" class="btn ${buttonColor}" data-child-uid="${childUid}" data-app-id="${appId}" data-blocked="${appData.blocked}">
                            ${appData.blocked ? 'Unblock' : 'Block'}
                        </button>
                    </div>
                `;

                // Append list item to the list group
                listGroup.appendChild(listItem);
            });

            // Append the list group to the appsContainer
            appsContainer.appendChild(listGroup);

            // Delegate event listener to a higher-level container
            appsContainer.addEventListener('click', (event) => {
                const button = event.target.closest('button');
                if (button) {
                    const childUid = button.dataset.childUid;
                    const appId = button.dataset.appId;
                    const blocked = button.dataset.blocked === 'true';

                    console.log('Button Clicked:', { childUid, appId, blocked });

                    this.toggleAppBlockedStatus(childUid, appId, !blocked, button);
                }
            });
        }
    }

    toggleAppBlockedStatus(childUid, appId, newBlockedStatus, toggleButton) {
        // Update only the 'blocked' field for the specified app in the database
        const appRef = ref(getDatabase(), `users/childs/${childUid}/apps/${appId}/blocked`);
        set(appRef, newBlockedStatus)
            .then(() => {
                // Update the button text and color based on the new blocked status
                toggleButton.innerText = newBlockedStatus ? 'Unblock' : 'Block';
                toggleButton.classList.remove(newBlockedStatus ? 'btn-success' : 'btn-danger');
                toggleButton.classList.add(newBlockedStatus ? 'btn-danger' : 'btn-success');
            })
            .catch((error) => {
                console.error('Error updating blocked status:', error);
            });
    }

    displayNoApps(message = 'No apps found') {
        const appsContainer = document.getElementById('appsContainer');
        if (appsContainer) {
            appsContainer.innerHTML = `<p>${message}</p>`;
        }
    }
}

// Create an instance of the ChildAppManager class and call the fetchChildApps method
const childAppManager = new ChildAppManager();
childAppManager.fetchChildApps();
