// Import necessary Firebase modules
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Function to fetch and display child contacts
function fetchChildContacts() {
    const queryParams = new URLSearchParams(window.location.search);
    const urlName = queryParams.get('childName');

    const contactsContainer = document.getElementById('contactsContainer');

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
                            // Matching child found, fetch and display contacts
                            fetchContacts(childUid);
                            return;
                        }
                    });

                    // If the loop completes and no matching child is found
                    displayNoContacts();
                } else {
                    // No child nodes found
                    displayNoContacts();
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                displayNoContacts(`Error fetching child information: ${error.message}`);
            });
    } else {
        // No child name provided in the URL
        displayNoContacts('No child name provided in the URL');
    }

    function fetchContacts(childUid) {
        const contactsRef = ref(getDatabase(), `users/childs/${childUid}/contacts`);

        get(contactsRef)
            .then((contactsSnapshot) => {
                if (contactsSnapshot.exists()) {
                    const contactsData = contactsSnapshot.val();
                    displayContacts(contactsData);
                } else {
                    displayNoContacts('No contacts found for the child');
                }
            })
            .catch((error) => {
                console.error('Error fetching contacts:', error);
                displayNoContacts(`Error fetching contacts: ${error.message}`);
            });
    }

    function displayContacts(contacts) {
        const contactsContainer = document.getElementById('contactsContainer');
    
        if (contactsContainer && contacts) {
            // Clear previous contacts
            contactsContainer.innerHTML = '';
    
            // Create a list group to display contacts with Bootstrap styling
            const listGroup = document.createElement('div');
            listGroup.classList.add('list-group');
    
            // Iterate through each contact
            Object.keys(contacts).forEach((contactId) => {
                const contactData = contacts[contactId];
    
                // Create list item for each contact
                const listItem = document.createElement('div');
                
                // Check if the contactName matches a specific condition, and add a custom class
                if (contactData.contactName === 'YourCondition') {
                    listItem.classList.add('list-group-item', 'list-group-item-action', 'highlighted');
                } else {
                    listItem.classList.add('list-group-item', 'list-group-item-action');
                }
    
                // Add Bootstrap styles to the list item
                listItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${contactData.contactName}</h5>
                        <small>${contactData.contactType}</small>
                    </div>
                    <p class="mb-1">Phone Number: ${contactData.phoneNumber}</p>
                    <small>Email: ${contactData.email}</small>
                `;
    
                // Append list item to the list group
                listGroup.appendChild(listItem);
            });
    
            // Append the list group to the contactsContainer
            contactsContainer.appendChild(listGroup);
        }
    }

    function displayNoContacts(message = 'No contacts found') {
        contactsContainer.innerHTML = `<p>${message}</p>`;
    }
}

// Call the function to fetch and display child contacts
fetchChildContacts();
