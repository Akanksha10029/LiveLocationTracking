document.addEventListener('DOMContentLoaded', () => {
    const locationButton = document.getElementById('locationButton');
    locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    function showPosition(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
    
        // Use fetch to get country and locality
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
            const country = data.countryName;
            const locality = data.locality;
            const date = new Date().toISOString();

            // Use fetch to send location and additional data to the backend
            return fetch('http://127.0.0.1:5000/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    latitude: lat, 
                    longitude: lon, 
                    country, 
                    locality, 
                    date
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            alert(`Latitude: ${data.latitude}, Longitude: ${data.longitude}, Country: ${data.country}, Locality: ${data.locality}, Date: ${data.date}`);
        })
        .catch(error => console.error('Error:', error));
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }
});
