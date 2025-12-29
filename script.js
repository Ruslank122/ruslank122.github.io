
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

var atArchive = false;

const date = new Date();
const currentDate = date.toISOString().split('T')[0];

const ctx = document.getElementById('chart1');
const ctx2 = document.getElementById('chart2');
const ctx3 = document.getElementById('chart3');
const ctx4 = document.getElementById('chart4');
const ctx5 = document.getElementById('chart5');
const ctx6 = document.getElementById('chart6');

Chart.defaults.color = "#444444";
Chart.defaults.font.family = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
var DP = [];
var DPHumidity = [];
var DPVoltage = [];
var DPWindAvg = [], DPWindMax = [];
var DPHeatIndex = [], DPWindChill = [];
var DPRain10min = [], DPRainTotal = [];

var dataArrays = [DP, DPHumidity, DPVoltage, DPWindAvg, DPWindMax, DPHeatIndex, DPWindChill, DPRain10min, DPRainTotal]

var tempGraph = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature, deg. C',
      data: DP,
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // <— very important
    plugins:
    {
      title:
      {
        display: true,
        text: "Temperature"
      }
    },
    scales: {
    x:
    {
        type: "time",
        bounds: "ticks",
        time:
        {
          displayFormats:
          {
            hour: "HH:mm"
          }
        },
        min: new Date().setUTCHours(0, 0, 0, 0),
        max: new Date().setUTCHours(23, 59, 59, 999)
    },
      y: {
        beginAtZero: false
      }
    }
  }
});
var humidityGraph = new Chart(ctx2, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Humidity, %',
      data: DPHumidity,
      borderWidth: 1
    }]
  },
  options: {
     responsive: true,
    maintainAspectRatio: false, // <— very important
     plugins:
    {
      title:
      {
        display: true,
        text: "Humidity"
      }
    },
    scales: {
    x:
    {
        type: "time",
        bounds: "ticks",
        time:
        {
          displayFormats:
          {
            hour: "HH:mm"
          }
        },
        min: new Date().setUTCHours(0, 0, 0, 0),
        max: new Date().setUTCHours(23, 59, 59, 999)
    },
      y: {
        beginAtZero: false
      }
    }
  }
});
var windGraph = new Chart(ctx3, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Avg. speed, m/s',
      data: DPWindAvg,
      borderWidth: 1
    },
    {
      label: 'Max. speed, m/s',
      data: DPWindMax,
      borderWidth: 1
    }]
  },
  options: {
     responsive: true,
    maintainAspectRatio: false, // <— very important
     plugins:
    {
      title:
      {
        display: true,
        text: "Wind speed"
      }
    },
    scales: {
    x:
    {
        type: "time",
        bounds: "ticks",
        time:
        {
          displayFormats:
          {
            hour: "HH:mm"
          }
        },
        min: new Date().setUTCHours(0, 0, 0, 0),
        max: new Date().setUTCHours(23, 59, 59, 999)
    },
      y: {
        beginAtZero: false
      }
    }
  }
});
var heatIndexGraph = new Chart(ctx4, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
      label: 'Wind chill, °C',
      data: DPWindChill,
      borderWidth: 1
    },
    {
      label: 'Heat index, DI',
      data: DPHeatIndex,
      borderWidth: 1
    }
    ]
  },
  options: {
     responsive: true,
    maintainAspectRatio: false, // <— very important
     plugins:
    {
      title:
      {
        display: true,
        text: "Heat & chill index"
      }
    },
    scales: {
    x:
    {
        type: "time",
        bounds: "ticks",
        time:
        {
          displayFormats:
          {
            hour: "HH:mm"
          }
        },
        min: new Date().setUTCHours(0, 0, 0, 0),
        max: new Date().setUTCHours(23, 59, 59, 999)
    },
      y: {
        beginAtZero: false
      }
    }
  }
});
var precipitationGraph = new Chart(ctx5, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: '10 min. precipitation, mm',
      data: DPRain10min,
      borderWidth: 1
    },
    {
      label: 'Total precipitation, mm',
      data: DPRainTotal,
      borderWidth: 1
    }]
  },
  options: {
     responsive: true,
    maintainAspectRatio: false, // <— very important
     plugins:
    {
      title:
      {
        display: true,
        text: "Precipitation"
      }
    },
    scales: {
    x:
    {
        type: "time",
        bounds: "ticks",
        time:
        {
          displayFormats:
          {
            hour: "HH:mm"
          }
        },
        min: new Date().setUTCHours(0, 0, 0, 0),
        max: new Date().setUTCHours(23, 59, 59, 999)
    },
      y: {
        beginAtZero: true
      }
    }
  }
});
var voltGraph = new Chart(ctx6, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Voltage, v',
      data: DPVoltage,
      borderWidth: 1
    }]
  },
  options: {
     responsive: true,
    maintainAspectRatio: false, // <— very important
     plugins:
    {
      title:
      {
        display: true,
        text: "Battery charge"
      }
    },
    scales: {
    x:
    {
        type: "time",
        bounds: "ticks",
        time:
        {
          displayFormats:
          {
            hour: "HH:mm"
          }
        },
        min: new Date().setUTCHours(0, 0, 0, 0),
        max: new Date().setUTCHours(23, 59, 59, 999)
    },
      y: {
        beginAtZero: false
      }
    }
  }
});

const graphs = [tempGraph, humidityGraph, windGraph, heatIndexGraph, precipitationGraph, voltGraph];

const heatIndexThresholds =
{
    22: "Light",
    24: "Moderate",
    26: "Medium",
    28: "Severe",
    30: "Extreme"
}
function getHeatIndexLabel(temp) {
    // Sort keys in ascending order
    const thresholds = Object.keys(heatIndexThresholds)
        .map(Number)
        .sort((a, b) => a - b);

    let label = "None";

    for (const t of thresholds) {
        if (temp < t) break;
        label = heatIndexThresholds[t];
    }

    return label;
}
const windDirections = [
    "N",       // 0
    "NE",  // 45
    "E",        // 90
    "SE",  // 135
    "S",       // 180
    "SW",  // 225
    "W",        // 270
    "NW"   // 315
];
function getWindDirection(angle) {
    
    // Each sector is 45°, offset by 22.5° to center
    const index = Math.round(angle / 45) % 8;

    return windDirections[index];
}
var r = document.querySelector(':root');
var labelColor;
var cardColor;

document.querySelector(".main-body").style.background = getComputedStyle(r).getPropertyValue("--bg-color-night");
document.querySelector(".main-body").style.color = getComputedStyle(r).getPropertyValue("--font-night");
//Chart.defaults.backgroundColor = '#FFFFFF16';
labelColor = Chart.defaults.color = getComputedStyle(r).getPropertyValue("--font-night");
cardColor = getComputedStyle(r).getPropertyValue("--card-bg-night");
document.querySelectorAll(".card").forEach(element => {
    element.style.backgroundColor = cardColor;
});

var todaySampleData = new Map();

const measurementsRef = ref(database, '/station1/measurements/' + currentDate + "/")

var todayData = await fetchDataForDate(currentDate);
//console.log(`${typeof(todayData)} ${Object.entries(todayData)}`);

todaySampleData = daySnapshotToMap(todayData);
printData(todaySampleData, currentDate);

onChildAdded(measurementsRef, snapshot =>
{
  const data = snapshot.val();
  //console.log("Child added");
  //console.log(data);
  //console.log(snapshot.key);
  if(data !== null && !todaySampleData.has(snapshot.key)){
    todaySampleData.set(snapshot.key, data);
    printData(todaySampleData, currentDate);
    }
  }
);

function calculateSunriseSunset()
{

  //taken from wikipedia formulas, no idea behind the math here!
  //Also let's take the numbers from wikipedia where the latitude/longitude is at Nahariya coast line, which is quite close to here but doesn't expose the actual position

  var n = (Date.now() / 86400000) + 0.0008 + 2440587.5 - 2451545;
  //console.log(n);

  var J = Math.floor(n) - 35/360; //longitude is about +35 deg

  var M = (357.5291 + 0.98560028 * J) % 360.0;
  var M_rad = M * Math.PI / 180;

  var C = 1.9148*Math.sin(M_rad) + 0.02*Math.sin(2*M_rad) + 0.0003*Math.sin(3*M_rad);

  var gamma = (M + C + 180 + 102.9372) % 360.0;
  var gamma_rad = gamma * Math.PI / 180;

  var J_transit = 2451545 + J + 0.0053*Math.sin(M_rad) - 0.0069*Math.sin(2*gamma_rad);

  var sin_delta = Math.sin(gamma_rad) * Math.sin(23.4397 * Math.PI / 180);
  var cos_delta = Math.cos(Math.asin(sin_delta));

  var cos_omega_0 = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(33 * Math.PI / 180) * sin_delta) / (Math.cos(33 * Math.PI / 180) * cos_delta);
  var hi = Math.acos(cos_omega_0);

  var JRise = J_transit - hi / (2 * Math.PI);
  var JSet = J_transit + hi / (2 * Math.PI);

  var dateRise = (JRise - 0.0008 - 2440587.5) * 86400000;
  var dateSet = (JSet - 0.0008 - 2440587.5) * 86400000;

  //console.log(`Sunrise: ${JRise}/${new Date(dateRise)}, sunset: ${JSet}/${new Date(dateSet)}`);

  return {sunrise: new Date(dateRise), sunset: new Date(dateSet)};

}

function timeDiffMinutesFromNow(dateThen)
{
    var dateNow = new Date();

    var diff = ((dateNow - dateThen) / 1000 / 60).toFixed(0);
 
    //console.log(diff);

    return diff;
}
function clearGraphData()
{
  dataArrays.forEach(element =>
  {
    element.length = 0;
  });
}
function addDataToGraphs(value, currentTime)
{ 
    //console.log(value, currentTime);
    DP.push({"x": currentTime, "y": value["avgTemp"]});
    DPHumidity.push({"x": currentTime, "y": value["humidity"]});
    DPVoltage.push({"x": currentTime, "y": value["batteryV"]});
    DPWindAvg.push({"x": currentTime, "y": value["avgWindS"]});
    DPWindMax.push({"x": currentTime, "y": value["maxWindS"]});
    
    DPRain10min.push({"x": currentTime, "y": value["totalRain"]});
    DPRainTotal.push({"x": currentTime, "y": value["totalRainDay"]});

    var wc = calculateWindChill(value["avgTemp"], value["avgWindS"]);
    var hi = calculateHeatIndex(value["avgTemp"], value["humidity"]);
    if(wc < 10)
      DPWindChill.push({"x": currentTime, "y": wc});
    if(hi >= 22)
      DPHeatIndex.push({"x": currentTime, "y": hi});
}
function renderGraphs(date)
{
  //console.log(`helo the date is ${date}`);
  for(let i = 0; i < graphs.length; i++)
  {
    graphs[i].options.scales.x.min = new Date(`${date}T00:00:00Z`);
    graphs[i].options.scales.x.max = new Date(`${date}T23:59:59Z`);
    graphs[i].options.scales.x.ticks.color = graphs[i].options.scales.x.grid.color = graphs[i].options.scales.y.ticks.color = graphs[i].options.scales.y.grid.color = labelColor;
    graphs[i].update("none");
  }
}
function printData(samples, date)
{
  var dataExists = samples.size != 0;

  document.querySelectorAll(".loading-div, .loading-error").forEach(element => {
    element.style.display = (dataExists) ? "none" : "block";
  });
  document.getElementById("current-data-div").style.display = (dataExists) ? "flex" : "none"

   //console.log(samples);
   
  if(!dataExists || atArchive)
    return;

  var latestDataKey = [...samples.keys()].at(-1);
  var data = [...samples.values()].at(-1);

  var dateLastUpdate = new Date(`${date}T${latestDataKey}Z`);
  var rainLastHour = 0, rainLastDay = 0;

  clearGraphData();
  
  samples.forEach((value, key) => {
      
    var dateCurrentItem = new Date(`${date}T${key}Z`);
    //onsole.log(dateCurrentItem);
    var diff = timeDiffMinutesFromNow(dateLastUpdate);

    if(timeDiffMinutesFromNow(dateCurrentItem) <= 60)
      rainLastHour += value["totalRain"];

    rainLastDay += value["totalRain"]
    value["totalRainDay"] = rainLastDay;

    addDataToGraphs(value, dateCurrentItem);
     
  });

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });
  var heatIndex = calculateHeatIndex(data.avgTemp, data.humidity)
  var windChill = calculateWindChill(data.avgTemp, data.avgWindS);

// Update HTML elements with live data
  document.getElementById("heat-index-val").textContent = `${heatIndex.toFixed(1)} - ${getHeatIndexLabel(heatIndex)}`;
  document.getElementById("wind-val").textContent = `${getWindDirection(data.windD)} ${data.avgWindS.toFixed(2)} m/s`;
  document.getElementById("wind-speed-max-val").textContent = `max. ${data.maxWindS.toFixed(2)}`;

  document.getElementById("temperature-val").textContent = `${data.avgTemp.toFixed(1)}°C`;
  document.getElementById("temperature-max-val").textContent = `max. ${data.maxTemp.toFixed(1)}`;
 

  if(data.pressure != null)
  {
    document.getElementById("pressure-val").textContent = `${data.pressure.toFixed(1)} hPa`;
  }
  else
  {
    document.getElementById("pressure-val").textContent = `-`;
  }
  if(data.humidity != null)
  {
     document.getElementById("humidity-val").textContent = `${data.humidity.toFixed(0)}%`;
  }
  else
  {
      document.getElementById("humidity-val").textContent = `-`;
  }
  document.getElementById("precipitation-val").childNodes[0].nodeValue = `${data.totalRain.toFixed(1)}mm`;
  document.getElementById("precipitation-hour-val").textContent = `${rainLastHour.toFixed(1)} last hour`;
  document.getElementById("last-updated-val").textContent = dateLastUpdate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  
  renderGraphs(date);

}

const archiveFetchBtn = document.querySelector("#fetch-archive");
archiveFetchBtn.addEventListener("click", () =>
{
  const datePicker = document.getElementById("archive-date");
  fetchArchive(datePicker.value);
});

const tabButtons = document.querySelectorAll(".button[data-tab]");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab; // gets the value of data-tab
    switchTab(tab);
  });
});

function switchTab(tab) {
  document.querySelectorAll("section").forEach(s => {
    s.style.display = s.id === tab ? "flex" : "none";
  });
}
function calculateWindChill(temp, wind)
{
  wind *= 3.6; //it's in km/h while I supply m/s
  return 13.12 + 0.6215* temp - 11.37*Math.pow(wind, 0.16) + 0.3965* temp * Math.pow(wind,0.16)
}
function calculateHeatIndex(temp, humidity)
{
  //DI=T−.55∗(1−.01∗RH)∗(T−14.5)
  return temp - 0.55 * (1 - 0.01 * humidity) * (temp - 14.5);
}
function daySnapshotToMap(dailySnapshot)
{
  var tempMap = new Map(Object.entries(dailySnapshot));
  
  //console.log(tempMap);
  return tempMap;
}
//Async, Date should be in yyyy-mm-dd format, like ISO 8601
function fetchDataForDate(date)
{
  const measurementsRef = ref(database, '/station1/measurements/' + date + "/")
 return get(measurementsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Snapshot exists!");
        return snapshot.val(); // return actual data object
      } 
      else {
        console.log("No snapshot exists!");
        return null; // no data for that date
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    });
}
function renderArchiveData(samples, date)
{
  var dataExists = samples != null && samples.size != 0;

  document.querySelectorAll(".loading-div, .loading-error").forEach(element => {
    element.style.display = (dataExists) ? "none" : "block";
  });
  document.querySelectorAll("#graphs > .card, #archive-data-div").forEach(element => 
  {
     element.style.display = (dataExists) ? "flex" : "none";
  });
  document.getElementById("current-data-div").style.display = (dataExists) ? "flex" : "none";

  console.log(samples, dataExists, samples.size);
  
  if(!dataExists)
  {
      document.getElementById("archive-data").textContent = `Error getting data for: ${new Date(`${date}T00:00:00Z`).toLocaleDateString()}`;
      return;
  }  
  clearGraphData();

  var minTemp = {value: 255, time: null}, maxTemp = {value: -255, time: null};
  var minHumidity = {value: 100, time: null}, maxHumidity = {value: 0, time: null};

  var rainLastDay = 0;
   
  samples.forEach((value, key) =>
  {
    var dateCurrentItem = new Date(`${date}T${key}Z`);

    rainLastDay += value["totalRain"]
    value["totalRainDay"] = rainLastDay;

    addDataToGraphs(value, dateCurrentItem);

    if(value.avgTemp < minTemp.value)
    {
      minTemp.value = value.avgTemp;
      minTemp.time = dateCurrentItem;
    }
    if(value.avgTemp > maxTemp.value)
    {
      maxTemp.value = value.avgTemp;
      maxTemp.time = dateCurrentItem;
    }
    if(value.humidity < minHumidity.value)
    {
      minHumidity.value = value.humidity;
      minHumidity.time = dateCurrentItem;
    }
    if(value.humidity > maxHumidity.value)
    {
      maxHumidity.value = value.humidity;
      maxHumidity.time = dateCurrentItem; 
    }
  });

// Update HTML elements with archive data
  document.getElementById("archive-data").textContent = `Archived data for ${new Date(`${date}T00:00:00Z`).toLocaleDateString()}`;

  document.getElementById("archive-temperature-val-max").childNodes[2].nodeValue = `${maxTemp.value.toFixed(1)}°C`;
  document.getElementById("archive-temperature-time-max").textContent = ` at ${maxTemp.time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`;

  document.getElementById("archive-temperature-val-min").childNodes[2].nodeValue = `${minTemp.value.toFixed(1)}°C`;
  document.getElementById("archive-temperature-time-min").textContent = ` at ${minTemp.time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`;

  document.getElementById("archive-humidity-val-max").childNodes[2].nodeValue = `${maxHumidity.value.toFixed(0)}%`;
  document.getElementById("archive-humidity-time-max").textContent = ` at ${maxHumidity.time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`;

  document.getElementById("archive-humidity-val-min").childNodes[2].nodeValue = `${minHumidity.value.toFixed(0)}%`;
  document.getElementById("archive-humidity-time-min").textContent = ` at ${minHumidity.time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`;

  document.getElementById("archive-precipitation-val").childNodes[0].nodeValue = `${rainLastDay.toFixed(1)}mm`;
  
  renderGraphs(date);
  
}
async function fetchArchive(date)
{
  //console.log(date);

  var archiveData = await fetchDataForDate(date);
  try
  {
    var snapshot = daySnapshotToMap(archiveData);
    renderArchiveData(snapshot, date);
  }
  catch (error)
  {
    console.log("Error during rendering archive data");
    console.log(error);
  }
}

