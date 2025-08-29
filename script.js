
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, onValue, onChildAdded } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAl165K-3gZIzVz5iMqqeIcGIqNCgQsN9c",
    authDomain: "meteo-station-33510.firebaseapp.com",
    databaseURL: "https://meteo-station-33510-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "meteo-station-33510",
    storageBucket: "meteo-station-33510.firebasestorage.app",
    messagingSenderId: "97164739897",
    appId: "1:97164739897:web:ec85a92619a40dcbf6d4e8"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const date = new Date();
const currentDate = date.toISOString().split('T')[0];


const measurementsRef = ref(database, '/measurements/' + currentDate + "/")
onChildAdded(measurementsRef, snapshot =>
{
    const data = snapshot.val();
    console.log(data);
    console.log(snapshot.key);
    printData(snapshot.key, snapshot.data);
  
}
);

function printData(key, data)
{
      // Update HTML elements with live data
  document.getElementById("heat-index-val").textContent = `${data.heatIndex} - ${data.heatDesc}`;
  document.getElementById("wind-speed-val").textContent = `${data.windSpeed} m/s`;
  document.getElementById("wind-speed-max-val").textContent = `max. ${data.windSpeedMax}`;
  document.getElementById("wind-direction-val").textContent = data.windDirection;

  document.getElementById("temperature-val").textContent = data.temperature;
  document.getElementById("temperature-max-val").textContent = `max. ${data.temperatureMax}`;
  document.getElementById("humidity-val").textContent = data.humidity;

  document.getElementById("pressure-val").textContent = data.pressure;
  document.getElementById("precipitation-val").textContent = data.precipitationLast10Min;
  document.getElementById("precipitation-hour-val").textContent = `${data.precipitationLastHour} last hour`;
  document.getElementById("last-updated-val").textContent = data.lastUpdated;
}


