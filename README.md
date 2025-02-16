# Live Location Tracking (GPS)

## Project Overview
A full-stack application that tracks the user's current location using the browser's Geolocation API, converts the coordinates to a human-readable address using the OpenCage Data API, and displays the location on a Google Map. The location data is also stored in a MongoDB database and logged in a local text file for analysis.

## Technologies Used
### Frontend
- **axios**: For making HTTP requests to the backend API

### Backend
- **cors**: Enables Cross-Origin Resource Sharing
- **dotenv**: Loads environment variables from .env file
- **express**: Web framework for Node.js
- **mongoose**: Object Data Modeling library for MongoDB

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LiveLocationTracking.git
   ```
2. Navigate to the project directory:
   ```bash
   cd LiveLocationTracking
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd backend
   npm install
   ```
4. Create a `.env` file in the root directory as well as in backend folder and      include your API keys and port:

   ```env
   OPENCAGE_API_KEY=your_opencage_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   PORT=5000
   ```
5. Install nodemon globally (optional but recommended for development):
   ```bash
   npm install -g nodemon
   ```
## Usage

1. Click the **"Get Current Location"** button on the frontend.
2. Allow location access when prompted by your browser.
3. The application will display your latitude and longitude.
4. Reverse geocoding will retrieve and display your full address and formatted address.
5. A Google Map will load dynamically, marking your current location.
6. Your location data will be saved in MongoDB and appended to the `locations.txt` file.

## Working
1. Start the backend server:
   ```bash
   cd backend
   nodemon server.js
   ```
2. Open the frontend in your browser by opening `frontend/index.html`

## Important Notes

- **Billing for Google Maps API:**  
  Ensure billing is enabled for your Google Cloud project; otherwise, you might encounter a `BillingNotEnabledMapError`.

- **API Keys:**  
  Your API keys are stored in the `.env` file. Do not expose these keys publicly.


## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Demo Video
[Watch the demo video](livelocationtrackingDemo.mp4)
