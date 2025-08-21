import { getDatabase, ref, get, orderByChild } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

function fetchChildMessages() {
    const queryParams = new URLSearchParams(window.location.search);
    const urlName = queryParams.get('childName');

    const messagesContainer = document.getElementById('messagesContainer');

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
                            // Matching child found, fetch and display messages
                            fetchMessages(childUid);
                            return;
                        }
                    });

                    // If the loop completes and no matching child is found
                    displayNoMessages();
                } else {
                    // No child nodes found
                    displayNoMessages();
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                displayNoMessages(`Error fetching child information: ${error.message}`);
            });
    } else {
        // No child name provided in the URL
        displayNoMessages('No child name provided in the URL');
    }

    function fetchMessages(childUid) {
        const messagesRef = ref(getDatabase(), `users/childs/${childUid}/messages`);

        get(messagesRef)
            .then((messagesSnapshot) => {
                if (messagesSnapshot.exists()) {
                    const messagesData = messagesSnapshot.val();
                    displayMessages(messagesData);
                } else {
                    displayNoMessages('No messages found for the child');
                }
            })
            .catch((error) => {
                console.error('Error fetching messages:', error);
                displayNoMessages(`Error fetching messages: ${error.message}`);
            });
    }

    function displayMessages(messages) {
        const messagesContainer = document.getElementById('messagesContainer');
    
        if (messagesContainer && messages) {
            // Clear previous messages
            messagesContainer.innerHTML = '';
    
            // Create a list group to display messages with Bootstrap styling
            const listGroup = document.createElement('div');
            listGroup.classList.add('list-group');
    
            // Iterate through each message
            Object.keys(messages).forEach((messageId) => {
                const messageData = messages[messageId];
    
                // Create list item for each message
                const listItem = document.createElement('div');
                
                // Check if the contactName matches a specific condition, and add a custom class
                if (messageData.contactName === 'YourCondition') {
                    listItem.classList.add('list-group-item', 'list-group-item-action', 'highlighted');
                } else {
                    listItem.classList.add('list-group-item', 'list-group-item-action');
                }
    
                // Add Bootstrap styles to the list item
                listItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${messageData.contactName}</h5>
                        <small>${messageData.timeReceived}</small>
                    </div>
                    <p class="mb-1">${messageData.messageBody}</p>
                    <small>Sender Phone Number: ${messageData.senderPhoneNumber}</small>
                `;
    
                // Append list item to the list group
                listGroup.appendChild(listItem);
            });
    
            // Append the list group to the messagesContainer
            messagesContainer.appendChild(listGroup);
        }
    }
    function displayNoMessages(message = 'No messages found') {
        messagesContainer.innerHTML = `<p>${message}</p>`;
    }
}

// Call the function to fetch and display child messages
fetchChildMessages();
