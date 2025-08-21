// Import necessary Firebase modules
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Function to fetch and display child location
function fetchChildLocation() {
    const queryParams = new URLSearchParams(window.location.search);
    const urlName = queryParams.get('childName');

    const locationContainer = document.getElementById('childLocationContainer');

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
                            // Matching child found, fetch and display location
                            fetchLocation(childUid);
                            return;
                        }
                    });

                    // If the loop completes and no matching child is found
                    displayNoLocation();
                } else {
                    // No child nodes found
                    displayNoLocation();
                }
            })
            .catch((error) => {
                console.error('Error fetching child information:', error);
                displayNoLocation(`Error fetching child information: ${error.message}`);
            });
    } else {
        // No child name provided in the URL
        displayNoLocation('No child name provided in the URL');
    }

    function fetchLocation(childUid) {
        const locationRef = ref(getDatabase(), `users/childs/${childUid}/location`);

        get(locationRef)
            .then((locationSnapshot) => {
                if (locationSnapshot.exists()) {
                    const locationData = locationSnapshot.val();
                    displayLocation(locationData);
                } else {
                    displayNoLocation('No location found for the child');
                }
            })
            .catch((error) => {
                console.error('Error fetching location:', error);
                displayNoLocation(`Error fetching location: ${error.message}`);
            });
    }

    function displayLocation(location) {
        const locationContainer = document.getElementById('childLocationContainer');

        if (locationContainer && location) {
            // Clear previous location
            locationContainer.innerHTML = '';

            // Create a container to display location with Bootstrap styling
            const locationDiv = document.createElement('div');
            locationDiv.classList.add('location-container');

            // Use reverse geocoding to get the location name based on latitude and longitude
            reverseGeocode(location.latitude, location.longitude)
                .then((locationName) => {
                   /* // Display the location name
                    const locationNameElement = document.createElement('p');
                    locationNameElement.textContent = locationName;
                    locationDiv.appendChild(locationNameElement);

                    // Display latitude and longitude
                    const latitudeElement = document.createElement('p');
                    latitudeElement.textContent = `Latitude: ${location.latitude}`;
                    locationDiv.appendChild(latitudeElement);

                    const longitudeElement = document.createElement('p');
                    longitudeElement.textContent = `Longitude: ${location.longitude}`;
                    locationDiv.appendChild(longitudeElement);
*/
                    // Add Google Maps link
                    const mapsLink = document.createElement('a');
                    mapsLink.href = `https://www.google.com/maps/place/${location.latitude},${location.longitude}`;
                    mapsLink.textContent = 'View Live on Maps';
                    mapsLink.target = '_blank';
                    mapsLink.rel = 'noopener noreferrer';
                    locationDiv.appendChild(mapsLink);
                    
                    // Add embedded Google Map using /place/ format
                    const mapIframe = document.createElement('iframe');
                    mapIframe.width = "100%";
                    mapIframe.height = "600";
                    mapIframe.style.border = "0";
                    mapIframe.loading = "lazy";
                    mapIframe.referrerPolicy = "no-referrer-when-downgrade";
                    mapIframe.src = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`;
                    locationDiv.appendChild(mapIframe);

                    // Append the location container to the locationContainer
                    locationContainer.appendChild(locationDiv);

                })
                .catch((error) => {
                    console.error('Error reverse geocoding:', error);
                    displayNoLocation('Error getting location name');
                });
        }
    }

    function displayNoLocation(message = 'No location found') {
        locationContainer.innerHTML = `<p>${message}</p>`;
    }

    // Function for reverse geocoding using the OpenCage Geocoding API
    async function reverseGeocode(latitude, longitude) {
        const apiKey = 'd236e65c409742658eb6381cfbc85bb8'; // Replace with your actual API key
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Extract the formatted address from the first result
                return data.results[0].formatted;
            } else {
                throw new Error('No results or invalid response from the geocoding service');
            }
        } catch (error) {
            throw new Error(`Error during reverse geocoding: ${error.message}`);
        }
    }
}

// Call the function to fetch and display child location
fetchChildLocation();
