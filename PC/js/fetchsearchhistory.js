// Import necessary Firebase modules
import { getDatabase, ref, get, push, onValue, set, remove } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlName = queryParams.get('childName');
    const searchQueryInput = document.getElementById('searchQueryInput');
    const addToListButton = document.getElementById('addToListButton');
    const searchHistoryContainer = document.getElementById('searchHistoryContainer');

    if (urlName) {
        let childUid; // Define childUid here

        const dbRef = ref(getDatabase(), 'users/childs');

        get(dbRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const childData = snapshot.val();

                    // Iterate through child nodes to find the matching name
                    Object.keys(childData).forEach((uid) => {
                        const child = childData[uid];
                        if (child.name === urlName) {
                            // Matching child found
                            childUid = uid;
                            fetchHistory(childUid);
                            return;
                        }
                    });

                    // If the loop completes and no matching child is found
                    if (!childUid) {
                        displayNoHistory('No child information found');
                    }

                    // Add event listener for the "Add to List" button
                    addToListButton.addEventListener('click', () => {
                        const query = searchQueryInput.value.trim();

                        if (query) {
                            // If the search query is not empty, add it to the flat search history list in Firebase
                            const searchHistoryRef = ref(getDatabase(), `users/childs/${childUid}/searchHistory`);

                            // Push the new search entry to Firebase as a flat list
                            push(searchHistoryRef, query);

                            // Clear the input field after adding to the list
                            searchQueryInput.value = '';
                        }
                    });

                    // Subscribe to changes in search history and update the UI accordingly
                    const searchHistoryRef = ref(getDatabase(), `users/childs/${childUid}/searchHistory`);
                    onValue(searchHistoryRef, (snapshot) => {
                        const searchHistoryData = snapshot.val();
                        displaySearchHistory(searchHistoryData);
                    });
                } else {
                    // No child nodes found
                    displayNoHistory('No child information found');
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                displayNoHistory(`Error fetching child information: ${error.message}`);
            });

        function fetchHistory(childUid) {
            const searchHistoryRef = ref(getDatabase(), `users/childs/${childUid}/searchHistory`);

            get(searchHistoryRef)
                .then((searchHistorySnapshot) => {
                    if (searchHistorySnapshot.exists()) {
                        const searchHistoryData = searchHistorySnapshot.val();
                        displaySearchHistory(searchHistoryData);
                    } else {
                        displayNoHistory('No search history found for the child');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching search history:', error);
                    displayNoHistory(`Error fetching search history: ${error.message}`);
                });
        }

        function displaySearchHistory(searchHistory) {
            if (searchHistoryContainer && searchHistory) {
                // Clear previous search history
                searchHistoryContainer.innerHTML = '';

                // Create a list group to display search history with Bootstrap styling
                const listGroup = document.createElement('div');
                listGroup.classList.add('list-group');

                // Convert searchHistory to an array if it's not already
                const searchArray = Array.isArray(searchHistory) ? searchHistory : Object.entries(searchHistory || {});

                // Iterate through each search entry
                searchArray.forEach(([key, searchQuery]) => {
                    // Create list item for each search query
                    const listItem = document.createElement('div');
                    listItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between');

                    // Add Bootstrap styles to the list item
                    listItem.textContent = searchQuery;

                    // Create a remove button for each query
                    const removeButton = document.createElement('button');
                    removeButton.classList.add('btn', 'btn-danger', 'ml-2');
                    removeButton.textContent = 'Remove';
                    removeButton.addEventListener('click', () => handleRemoveQuery(childUid, key));

                    // Append remove button to the list item
                    listItem.appendChild(removeButton);

                    // Append list item to the list group
                    listGroup.appendChild(listItem);
                });

                // Append the list group to the searchHistoryContainer
                searchHistoryContainer.appendChild(listGroup);
            }
        }

        function handleRemoveQuery(childUid, queryKey) {
            const searchHistoryRef = ref(getDatabase(), `users/childs/${childUid}/searchHistory/${queryKey}`);

            // Remove the queryKey directly from the search history in Firebase
            remove(searchHistoryRef)
                .then(() => {
                    // Optional: You can add additional actions after successful removal if needed

                    console.log('Query removed successfully');
                })
                .catch((error) => {
                    console.error('Error removing search query:', error);
                });
        }

        function displayNoHistory(message = 'No search history found') {
            // Display a message when no search history is found
            if (searchHistoryContainer) {
                searchHistoryContainer.innerHTML = `<p>${message}</p>`;
            }
        }
    } else {
        // No child name provided in the URL
        displayNoHistory('No child name provided in the URL');
    }
});
