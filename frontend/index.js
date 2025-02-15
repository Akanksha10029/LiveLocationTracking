document.addEventListener('DOMContentLoaded', () => {

    const locationButton = document.getElementById('locationButton');
    let lat_long = document.getElementById('lat-long');
    let fullAddress = document.getElementById('full-address');
    let formattedAddress = document.getElementById('formatted-address');

    // reverse geocoding 
    let apiEndpoint = 'https://api.opencagedata.com/geocode/v1/json'; // OpenCage API endpoint
    let opencageApiKey = null; // good practice to store API keys in environment variables and not in code for security reasons and initialize to null

    const getUserCurrentLocation = async (lat, lon) => {
        console.log('Getting user location...');
        // Fetch API key if not already available
        if (!opencageApiKey) {
            try {
                // Fetch API key if not already available
            if (!opencageApiKey) {
                const response = await fetch('http://localhost:5000/api/get-opencage-key');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!data.apiKey) {
                    throw new Error('API key not found in response');
                }
                opencageApiKey = data.apiKey;
                console.log('Successfully fetched API key');
            }

            } catch (error) {
                console.error('Error fetching API key:', error);
                return;
            }
        }
        
        const apiURL = await fetch(`${apiEndpoint}?q=${lat}+${lon}&key=${opencageApiKey}&preety=1`);
        try{
            const response = await apiURL.json();
            console.log(response);
            const {continent, country, state, state_district, city, postcode, county, road_type } = response.results[0].components;
            fullAddress.textContent = `User Address: continent: ${continent}, country: ${country}, state: ${state}, state district: ${state_district}, city: ${city}, PIN Code: ${postcode}, Locality: ${county}, road type: ${road_type}`;
            formattedAddress.textContent = `Formatted Address: ${response.results[0].formatted}`;
        }
        catch(error){
            console.log('error', error);
        }  
    }

    locationButton.addEventListener('click', () => {
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    });

    function showPosition(position) {
            console.log(position);
        
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            lat_long.textContent = `Latitude: ${lat}, Longitude: ${lon}`;

            getUserCurrentLocation(lat, lon);
    }
    
    function showError(error) {
        const messages = {
            1: "User denied the request for Geolocation.",
            2: "Location information is unavailable.",
            3: "The request to get user location timed out.",
            0: "An unknown error occurred."
        };
        
        alert(messages[error.code]);
        console.error("Geolocation Error:", error.message);
    }

        // Fetch API Key for Google Maps
        // fetch('http://127.0.0.1:5000/api/google-maps-key')
        //     .then(response => response.json())
        //     .then(data => {
        //         const googleMapsApiKey = data.apiKey;
        //         loadGoogleMaps(googleMapsApiKey, lat, lon);
        //     })
        //     .catch(error => console.error('Error fetching API key:', error));

    // function loadGoogleMaps(apiKey, lat, lon) {
    //     if (!apiKey || apiKey === "undefined") {
    //         console.error("Google Maps API Key is missing!");
    //         alert("Error: Google Maps API Key is missing!");
    //         return;
    //     }

    //     if (!window.google) {
    //         const script = document.createElement('script');
    //         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    //         script.async = true;
    //         script.defer = true;
    //         document.body.appendChild(script);

    //         // Set initMap function after Google Maps loads
    //         window.initMap = () => initMap(lat, lon);
    //     } else {
    //         initMap(lat, lon);
    //     }
    // }

    // function initMap(lat, lon) {
    //     console.log("Initializing Google Maps...");
    //     const mapDiv = document.getElementById("map");

    //     if (!mapDiv) {
    //         console.error("Map container not found!");
    //         return;
    //     }

    //     const map = new google.maps.Map(mapDiv, {
    //         center: { lat, lng: lon },
    //         zoom: 15,
    //     });

    //     new google.maps.Marker({
    //         position: { lat, lng: lon },
    //         map: map,
    //         title: "You are here!",
    //     });
    // }

  
});
