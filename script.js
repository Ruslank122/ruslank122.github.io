
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

const ctx = document.getElementById('chart1');
const ctx2 = document.getElementById('chart2');
const ctx3 = document.getElementById('chart3');
const ctx4 = document.getElementById('chart4');

Chart.defaults.color = "#444444";
Chart.defaults.font.family = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
var tempGraph = new Chart(ctx, {
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
      label: 'Temperature, deg. C',
      data: [],
      borderWidth: 1
    }]
  },
  options: {
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
      data: [],
      borderWidth: 1
    },
    {
      label: 'Max. speed, m/s',
      data: [],
      borderWidth: 1
    }]
  },
  options: {
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
var voltGraph = new Chart(ctx4, {
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


let sampleData = new Map();

const measurementsRef = ref(database, '/station1/measurements/' + currentDate + "/")
get(measurementsRef).then((snapshot) => 
{
    if(snapshot.exists())
    {
        console.log(snapshot.val());
        snapshot.forEach(element => {
            //console.log(element.val()["uploadPath"], element.val());
            if(element.val() !== null && !sampleData.has(element.val()["uploadPath"])){
                sampleData.set(element.val()["uploadPath"], element.val());
            }
        });
        
        setInterval(() => {printData(sampleData);}, 30000);
    }
    printData(sampleData);
    onChildAdded(measurementsRef, snapshot =>
      {
      const data = snapshot.val();
      //console.log("Child added");
    //console.log(data);
    //console.log(snapshot.key);
      if(data !== null && !sampleData.has(data["uploadPath"])){
        sampleData.set(data["uploadPath"], data);
        printData(sampleData);
      }
      
       }
    );
});

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

function printData(samples)
{

  var timings = calculateSunriseSunset();
  var r = document.querySelector(':root');
  var labelColor;
  var cardColor;
  if(Date.now() < timings.sunrise + 1800000 || Date.now() > timings.sunset - 1800000)
  {
    document.querySelector(".main-body").style.background = getComputedStyle(r).getPropertyValue("--bg-color-night");
    document.querySelector(".main-body").style.color = getComputedStyle(r).getPropertyValue("--font-night");
    //Chart.defaults.backgroundColor = '#FFFFFF16';
    labelColor = Chart.defaults.color = getComputedStyle(r).getPropertyValue("--font-night");
    cardColor = getComputedStyle(r).getPropertyValue("--card-bg-night");
  }
  else if(Date.now() > timings.sunrise + 1800000 && Date.now() < timings.sunset - 1800000)
  {
    document.querySelector(".main-body").style.background = getComputedStyle(r).getPropertyValue("--bg-color-day");
    document.querySelector(".main-body").style.color = getComputedStyle(r).getPropertyValue("--font-day");
    //Chart.defaults.backgroundColor = '#00000016';
    labelColor = Chart.defaults.color = getComputedStyle(r).getPropertyValue("--font-day");
    cardColor = getComputedStyle(r).getPropertyValue("--card-bg");
  }
  else
  {
    document.querySelector(".main-body").style.background = getComputedStyle(r).getPropertyValue("--bg-color-set");
    document.querySelector(".main-body").style.color = getComputedStyle(r).getPropertyValue("--font-day");
    //Chart.defaults.backgroundColor = '#00000016';
    labelColor = Chart.defaults.color = getComputedStyle(r).getPropertyValue("--font-day");
    cardColor = getComputedStyle(r).getPropertyValue("--card-bg");
  }

  document.querySelectorAll(".card").forEach(element => {
      element.style.backgroundColor = cardColor;
  });

  var dataExists = sampleData.size != 0;

  document.querySelectorAll(".loading-div, .loading-error").forEach(element => {
    element.style.display = (dataExists) ? "none" : "block";
  });
  document.getElementById("current-data-div").style.display = (dataExists) ? "flex" : "none"

   //console.log(samples);
   
   if(!dataExists)
    return;

   var latestDataKey = [...samples.keys()].at(-1);
   var data = [...samples.values()].at(-1);

   //console.log(latestDataKey, data);

//DI=T−.55∗(1−.01∗RH)∗(T−14.5)
   var heatIndex = data.avgTemp - 0.55 * (1 - 0.01 * data.humidity) * (data.avgTemp - 14.5);

   //console.log(heatIndex);

   var date = latestDataKey.split('/')[1];
   var time = latestDataKey.split('/')[2];
   
   var dateLastUpdate = new Date(`${date}T${time}Z`);

   var diff = timeDiffMinutesFromNow(dateLastUpdate);
  
   const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });

   var rainLastHour = 0;
   var DP = [];
   var DPHumidity = [];
   var DPVoltage = [];
   var DPWindAvg = [], DPWindMax = [];
   samples.forEach(element => {
    var dateR = element["uploadPath"].split('/')[1];
    var timeR = element["uploadPath"].split('/')[2];
    //console.log(dateR, timeR);
    var dateLastUpdateR = new Date(`${dateR}T${timeR}Z`);

    DP.push({"x": dateLastUpdateR, "y": element["avgTemp"]});
    DPHumidity.push({"x": dateLastUpdateR, "y": element["humidity"]});
    DPVoltage.push({"x": dateLastUpdateR, "y": element["batteryV"]});
    DPWindAvg.push({"x": dateLastUpdateR, "y": element["avgWindS"]});
    DPWindMax.push({"x": dateLastUpdateR, "y": element["maxWindS"]});

    if(timeDiffMinutesFromNow(dateLastUpdateR) <= 60)
        rainLastHour += element["totalRain"];
   });

// Update HTML elements with live data
  document.getElementById("heat-index-val").textContent = `${heatIndex.toFixed(1)} - ${getHeatIndexLabel(heatIndex)}`;
  document.getElementById("wind-val").textContent = `${getWindDirection(data.windD)} ${data.avgWindS.toFixed(2)} m/s`;
  document.getElementById("wind-speed-max-val").textContent = `max. ${data.maxWindS.toFixed(2)}`;

  document.getElementById("temperature-val").textContent = `${data.avgTemp.toFixed(1)}°C`;
  document.getElementById("temperature-max-val").textContent = `max. ${data.maxTemp.toFixed(1)}`;
  document.getElementById("humidity-val").textContent = `${data.humidity.toFixed(0)}%`;

  if(data.pressure != null)
  {
    document.getElementById("pressure-val").textContent = `${data.pressure.toFixed(1)} hPa`;
  }
  else
  {
    document.getElementById("pressure-val").textContent = `-`;
  }
  document.getElementById("precipitation-val").childNodes[0].nodeValue = `${data.totalRain.toFixed(1)}mm`;
  document.getElementById("precipitation-hour-val").textContent = `${rainLastHour.toFixed(1)} last hour`;
  document.getElementById("last-updated-val").textContent = rtf.format(-diff, 'minute');
  
  tempGraph.data.datasets[0].data = DP;
  humidityGraph.data.datasets[0].data = DPHumidity;
  voltGraph.data.datasets[0].data = DPVoltage;
  windGraph.data.datasets[0].data = DPWindAvg;
  windGraph.data.datasets[1].data = DPWindMax;

  tempGraph.options.scales.x.ticks.color = tempGraph.options.scales.x.grid.color = tempGraph.options.scales.y.ticks.color = tempGraph.options.scales.y.grid.color = labelColor;
  humidityGraph.options.scales.x.ticks.color = humidityGraph.options.scales.x.grid.color = humidityGraph.options.scales.y.ticks.color = humidityGraph.options.scales.y.grid.color = labelColor;
  voltGraph.options.scales.x.ticks.color =   voltGraph.options.scales.x.grid.color =   voltGraph.options.scales.y.ticks.color =   voltGraph.options.scales.y.grid.color = labelColor;
  windGraph.options.scales.x.ticks.color = windGraph.options.scales.x.grid.color = windGraph.options.scales.y.ticks.color = windGraph.options.scales.y.grid.color = labelColor;

  
  tempGraph.update("none");
  humidityGraph.update("none");
  voltGraph.update("none");
  windGraph.update("none");

}


