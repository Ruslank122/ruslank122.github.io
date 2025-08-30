
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, get, onChildAdded } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
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

const ctx = document.getElementById('charts');

var hello = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature, deg. C',
      data: [],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
    x:
    {
        type: "linear",
    },
      y: {
        beginAtZero: false
      }
    }
  }
});

const heatIndexThresholds =
{
    22: "Light",
    24: "Mild",
    26: "Medium",
    28: "Severe",
    30: "Extreme"
}
function getHeatIndexLabel(temp) {
    // Sort keys in ascending order
    const thresholds = Object.keys(heatIndexThresholds)
        .map(Number)
        .sort((a, b) => a - b);

    let label = "Unknown";

    for (const t of thresholds) {
        if (temp < t) break;
        label = heatIndexThresholds[t];
    }

    return label;
}
const windDirections = [
    "North",       // 0
    "North-East",  // 45
    "East",        // 90
    "South-East",  // 135
    "South",       // 180
    "South-West",  // 225
    "West",        // 270
    "North-West"   // 315
];
function getWindDirection(angle) {
    // Normalize angle 0–360
    angle = ((angle % 360) + 360) % 360;

    // Each sector is 45°, offset by 22.5° to center
    const index = Math.round(angle / 45) % 8;

    return windDirections[index];
}


let sampleData = new Map();

const measurementsRef = ref(database, '/station1/measurements/' + currentDate + "/")
get(measurementsRef).then((snapshot) => 
{
    if(snapshot.exists())
    {
        snapshot.forEach(element => {
            //console.log(element.val()["uploadPath"], element.val());
            if(element.val() !== null && !sampleData.has(element.val()["uploadPath"])){
                sampleData.set(element.val()["uploadPath"], element.val());
            }
        });
        printData(sampleData);
        setInterval(() => {printData(sampleData);}, 30000);
    }
});

onChildAdded(measurementsRef, snapshot =>
{
    const data = snapshot.val();
    //console.log(data);
    //console.log(snapshot.key);
    if(data !== null && !sampleData.has(data["uploadPath"])){
        sampleData.set(data["uploadPath"], data);
    }
    printData(sampleData);
}
);

function timeDiffMinutesFromNow(dateThen)
{
    var dateNow = new Date();

    var diff = ((dateNow - dateThen) / 1000 / 60).toFixed(0);
 
    console.log(diff);

    return diff;
}

function printData(samples)
{

   console.log(samples);
   
   var latestDataKey = [...samples.keys()].at(-1);
   var data = [...samples.values()].at(-1);

   console.log(latestDataKey, data);

//DI=T−.55∗(1−.01∗RH)∗(T−14.5)
   var heatIndex = data.avgTemp - 0.55 * (1 - 0.01 * data.humidity) * (data.avgTemp - 14.5);

   console.log(heatIndex);

   var date = latestDataKey.split('/')[1];
   var time = latestDataKey.split('/')[2];
   
   var dateLastUpdate = new Date(`${date}T${time}Z`);

   var diff = timeDiffMinutesFromNow(dateLastUpdate);
  
   const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });

   var rainLastHour = 0;
   var labels = [];
   var DP = [];
   samples.forEach(element => {
    var dateR = element["uploadPath"].split('/')[1];
    var timeR = element["uploadPath"].split('/')[2];
    console.log(dateR, timeR);
    var dateLastUpdateR = new Date(`${dateR}T${timeR}Z`);

    labels.push(dateLastUpdateR.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

    let x = dateLastUpdateR.getHours() * 60 + dateLastUpdateR.getMinutes();
    DP.push({"x": x, "y": element["avgTemp"]});

    if(timeDiffMinutesFromNow(dateLastUpdateR) <= 60)
        rainLastHour += element["totalRain"];
   });

// Update HTML elements with live data
  document.getElementById("heat-index-val").textContent = `${heatIndex.toFixed(1)} - ${getHeatIndexLabel(heatIndex)}`;
  document.getElementById("wind-speed-val").textContent = `${data.avgWindS.toFixed(2)} m/s`;
  document.getElementById("wind-speed-max-val").textContent = `max. ${data.maxWindS.toFixed(2)}`;
  document.getElementById("wind-direction-val").textContent = getWindDirection(data.windD);

  document.getElementById("temperature-val").textContent = `${data.avgTemp.toFixed(1)}°C`;
  document.getElementById("temperature-max-val").textContent = `max. ${data.maxTemp.toFixed(1)}`;
  document.getElementById("humidity-val").textContent = `${data.humidity.toFixed(0)}%`;

  document.getElementById("pressure-val").textContent = `${data.pressure.toFixed(1)} hPa`;
  document.getElementById("precipitation-val").childNodes[0].nodeValue = `${data.totalRain.toFixed(1)}mm`;
  document.getElementById("precipitation-hour-val").textContent = `${rainLastHour.toFixed(1)} last hour`;
  document.getElementById("last-updated-val").textContent = rtf.format(-diff, 'minute');
  
  hello.data.labels = labels;

  hello.data.datasets = [
    {
        label: "Temperature, deg. C",
        data: DP,
        borderWidth: 1
    }
  ];
  hello.update("none");
}


