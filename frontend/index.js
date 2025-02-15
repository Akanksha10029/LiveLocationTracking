document.addEventListener('DOMContentLoaded', () => {

    const locationButton = document.getElementById('locationButton');
    let lat_long = document.getElementById('lat-long');
    let fullAddress = document.getElementById('full-address');
    let formattedAddress = document.getElementById('formatted-address');

    // reverse geocoding 
    let apiEndpoint = 'https://api.opencagedata.com/geocode/v1/json'; // OpenCage API endpoint
    let opencageApiKey = null; // good practice to store API keys in environment variables and not in code for security reasons and initialize to null
    let googleMapsApiKey = null; 

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
        
        try{
            const apiURL = await fetch(`${apiEndpoint}?q=${lat}+${lon}&key=${opencageApiKey}&pretty=1`);
            const response = await apiURL.json();
            console.log('OpenCage Response:', response);

            const {continent, country, state, state_district, city, postcode, county, road_type } = response.results[0].components;
            fullAddress.textContent = `User Address: continent: ${continent}, country: ${country}, state: ${state}, state district: ${state_district}, city: ${city}, PIN Code: ${postcode}, Locality: ${county}, road type: ${road_type}`;
            formattedAddress.textContent = `Formatted Address: ${response.results[0].formatted}`;
        }
        catch(error){
            console.log('error', error);
        }  
    }
    // When user clicks "Get Current Location" button 
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

            // After we have the coords, fetch the Google Maps key and load the map
            fetchGoogleMapsKeyAndInit(lat, lon);
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

    // Fetch Google Maps Key, then inject <script> with callback
    function fetchGoogleMapsKeyAndInit(lat, lon) {
        // Only fetch if we haven't already
        if (googleMapsApiKey) {
        // Already have the key, just init the map
        loadGoogleMaps(googleMapsApiKey, lat, lon);
        } else {
        fetch('http://localhost:5000/api/google-maps-key')
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
            })
            .then(data => {
            if (!data.apiKey) {
                throw new Error('Google Maps API Key is missing in response');
            }
            googleMapsApiKey = data.apiKey;
            loadGoogleMaps(googleMapsApiKey, lat, lon);
            })
            .catch(error => console.error('Error fetching Google Maps key:', error));
        }
    }

    // Dynamically create the <script> tag and pass the init callback
    function loadGoogleMaps(apiKey, lat, lon) {
        // If Google Maps is already loaded, just call init
        // Use optional chaining to check if google maps is already loaded
        if (window.google?.maps) {
            initMap(lat, lon);
            return;
        }

        // Otherwise, create the script tag
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapFromScript`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // We define a global function that Google Maps calls on load
        window.initMapFromScript = () => initMap(lat, lon);
    }

    // Initialize the map with the user's coordinates
    function initMap(lat, lon) {
        console.log('Initializing Google Maps...');
        const mapDiv = document.getElementById('map');

        if (!mapDiv) {
        console.error('Map container not found!');
        return;
        }

        const userLatLng = { lat, lng: lon };

        const map = new google.maps.Map(mapDiv, {
        center: userLatLng,
        zoom: 15,
        });

        /// Use the new AdvancedMarkerElement as recommended
        const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: userLatLng,
        title: 'You are here!',
        });
    }
        
  
});
