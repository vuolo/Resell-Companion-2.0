// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const superagent = window.parent.require('superagent');
const fs = window.parent.require('fs');
const admZip = window.parent.require('adm-zip');
const path = window.parent.require('path');
const fetch = window.parent.require('node-fetch');

var exec = window.parent.require('child_process');
/**
* Function to execute exe
* @param {string} fileName The name of the executable file to run.
* @param {string[]} params List of string arguments.
* @param {string} path Current working directory of the child process.
*/
function execute(fileName, params, path) {
  let promise = new Promise((resolve, reject) => {
    exec.execFile(fileName,  params, { cwd: path }, (err, data) =>  {
      if (err) reject(err);
      else resolve(data);
    });

  });
  return promise;
}

// variables
var devices = [];
var refreshDeviceTimer = 0;

const spoofApp = new Vue({
  el: "#Rewrite___Spoof",
  data: {
    companionSettings: window.parent.companionSettings,
    devices: devices
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    getTextWidth: window.parent.getTextWidth,
    tryTranslate: window.parent.tryTranslate,
    getThemeColor: window.parent.getThemeColor,
    handleActiveClick: function(e, deviceIndex) {
      if (e.ctrlKey) switchActiveDevice(deviceIndex)
      else if (e.shiftKey) setMultipleActiveDevices(deviceIndex)
      else setActiveDevice(deviceIndex)
    },
    setAllDevicesActive: setAllDevicesActive,
    startSpoof: function() {
      for (let dev of devices) {
        if (dev.active && dev.type != "test") {
          locationPerform(dev, setLocation);
          dev.isSpoofing = true;
        }
      }
    },
    stopSpoof: function() {
      for (let dev of devices) {
        if (dev.active && dev.type != "test") {
          locationPerform(dev, stopLocation);
          dev.isSpoofing = false;
        }
      }
    }
  }
});

refreshDevices();

setInterval(function(){ if (window.parent.borderApp.pages[window.parent.borderApp.activePageIndex].name == 'Spoof')  { refreshDevices(); } }, 1000);

const getDirectories = source =>
fs.readdirSync(source, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

async function downloadDependencies() {

  try {

    // DEPENDENCY URL https://github.com/filsv/iPhoneOSDeviceSupport/raw/master/13.2.zip (replace version with device's base iOS version.)
    var dependencyVersions = [];
    let curDownloadedDependencies;
    if (window.parent.process.platform == "darwin") {
      curDownloadedDependencies = getDirectories("./utils/executables/Spoof Companion OSX/DeveloperImages");
    } else { // win32
      curDownloadedDependencies = getDirectories("./utils/executables/Spoof Companion/DeveloperImages");
    }
    for (var depVersion of curDownloadedDependencies) {
      if (!dependencyVersions.includes(depVersion)) {
        dependencyVersions.push(depVersion);
      }
    }

    for (var dev of devices) {
      var dependencyVersion = dev.display_name.substring(dev.display_name.indexOf("iOS")+4, dev.display_name.length-1);
      dependencyVersion = dependencyVersion.substring(0, dependencyVersion.indexOf(".")+2);

      console.log(dev.display_name);
      console.log(dependencyVersion);

      if (window.parent.process.platform == "darwin") {
        if (!dependencyVersions.includes(dependencyVersion)) {
          dependencyVersions.push(dependencyVersion);
          superagent
          .get(`https://github.com/filsv/iPhoneOSDeviceSupport/raw/master/${dependencyVersion}.zip`)
            .on('error', function(error) {
              console.log(error);
            })
            .pipe(fs.createWriteStream(`./utils/executables/Spoof Companion OSX/DeveloperImages/${dependencyVersion}.zip`))
            .on('finish', function() {
              console.log('finished downloading');
              var zip = new admZip(`./utils/executables/Spoof Companion OSX/DeveloperImages/${dependencyVersion}.zip`);
              console.log('start unzip');
              zip.extractAllTo("./utils/executables/Spoof Companion OSX/DeveloperImages", false, true);
              console.log('finished unzip');
              fs.unlink(`./utils/executables/Spoof Companion OSX/DeveloperImages/${dependencyVersion}.zip`, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
          }
      } else { // win32
        if (!dependencyVersions.includes(dependencyVersion)) {
          dependencyVersions.push(dependencyVersion);
          superagent
          .get(`https://github.com/filsv/iPhoneOSDeviceSupport/raw/master/${dependencyVersion}.zip`)
            .on('error', function(error) {
              console.log(error);
            })
            .pipe(fs.createWriteStream(`./utils/executables/Spoof Companion/DeveloperImages/${dependencyVersion}.zip`))
            .on('finish', function() {
              console.log('finished downloading');
              var zip = new admZip(`./utils/executables/Spoof Companion/DeveloperImages/${dependencyVersion}.zip`);
              console.log('start unzip');
              zip.extractAllTo("./utils/executables/Spoof Companion/DeveloperImages", false, true);
              console.log('finished unzip');
              fs.unlink(`./utils/executables/Spoof Companion/DeveloperImages/${dependencyVersion}.zip`, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
          }
      }
    }

  } catch(error) {
    console.log("DOWNLOAD DEPENDENCY ERROR:");
    console.log(error);
  }

}

// GET: exits Spoof Companion
function closeSpoofCompanion() {
  fetch('http://localhost:13369/exit');
}

// GET: gets current Spoof Companion version
function getSpoofCompanionVersion() {
  fetch('http://localhost:13369/version').then(function(e) {
    return e.text()
  });
}

// GET: returns uninitialized devices array
var isPrompting = false;
function refreshDevices() {
  if (window.parent.process.platform == "darwin" && devices.length == 0) {
    try { // TODO: fix directories
      exec.exec(`"${path.join(window.parent.__dirname, "../../../Spoof Companion OSX/dotnet-2.2")}/dotnet" "${path.join(window.parent.__dirname, "../../../Spoof Companion OSX")}/Spoof Companion.dll"`, { cwd: path.join(window.parent.__dirname, "../../../Spoof Companion OSX") }, (err, data) => {
        if (err) {
          console.log(err);
          // if (!isPrompting) {
          //   isPrompting = true;
          //   var sudo = require('sudo-prompt');
          //   var options = {
          //     name: 'Spoof Companion',
          //     icns: path.join(window.parent.__dirname, "../../../assets/icons/mac/icon.icns")
          //   };
          //   sudo.exec(`installer -pkg "${path.join(window.parent.__dirname, "../../../Spoof Companion OSX")}/dotnet-runtime-2.2.3-osx-x64.pkg" -target /`, options,
          //   function(error, stdout, stderr) {
          //     if (error) {
          //       console.log(error);
          //       isPrompting = false;
          //     } else {
          //       console.log('stdout: ' + stdout);
          //       isPrompting = false;
          //     }
          //   });
          // }
        }
      });
    } catch(err) {
      console.log(err);
    }
  } else if (devices.length == 0) { // win32
    try {
      execute("Spoof Companion.exe", [], path.join(window.parent.__dirname, "../../../utils/executables/Spoof Companion"))
    } catch(err) {
      console.log(err);
    }
  }
  if (isPrompting) {
    return;
  }
  if (refreshDeviceTimer == 0) {
    refreshDeviceTimer = 60;
  }
  fetch('http://localhost:13369/get_devices').then(function(e) {
    return e.json()
  }).then(function(r) {
    if (r.error) {
      console.log(r.error);
      if (r.error.includes("iTunes")) {
        closeSpoofCompanion();
      }
      document.querySelector("#Spoof_modalMessage").innerHTML = r.error;
      document.querySelector("#Spoof_modalCheckOutTitle").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").innerHTML = "👉 Guide: How to setup Spoof on Resell Companion";
      document.querySelector("#Spoof_Modal").style.display = "block";
      while(devices.length > 0) {
        devices.pop();
      }
    } else {
      let foundDevices = r;
      if (devices.length != foundDevices.length) {
        refreshDeviceTimer = 0;
        document.querySelector("#Spoof_Modal").style.display = "none";
        let temp_devices = [];
        for (var i = 0; i < devices.length; i++) {
          temp_devices.push(devices[i]);
        }
        while(devices.length > 0) {
          devices.pop();
        }
        for (var i = 0; i < foundDevices.length; i++) {
          let foundPreviousDeviceIndex = -1;
          for (var j = 0; j < temp_devices.length; j++) {
            if (temp_devices[j].udid == foundDevices[i].udid) {
              foundPreviousDeviceIndex = j;
              break;
            }
          }
          if (foundPreviousDeviceIndex != -1) {
            devices.unshift(
              {
                name: foundDevices[i].name,
                display_name: foundDevices[i].display_name,
                udid: temp_devices[foundPreviousDeviceIndex].udid,
                type: temp_devices[foundPreviousDeviceIndex].type,
                lat: temp_devices[foundPreviousDeviceIndex].lat,
                lng: temp_devices[foundPreviousDeviceIndex].lng,
                locationName: temp_devices[foundPreviousDeviceIndex].locationName,
                active: temp_devices[foundPreviousDeviceIndex].active,
                isSpoofing: temp_devices[foundPreviousDeviceIndex].isSpoofing
              }
            )
          } else {
            devices.unshift(
              {
                name: foundDevices[i].name,
                display_name: foundDevices[i].display_name,
                udid: foundDevices[i].udid,
                type: foundDevices[i].display_name.includes('iPad') ? "tablet" : "phone",
                lat: undefined,
                lng: undefined,
                locationName: "Unspecified Location",
                active: devices.length != 0,
                isSpoofing: false
              }
            )
          }

        }
        let foundActiveDevice = false;
        for (var i = 0; i < devices.length; i++) {
          if (devices[i].active) {
            foundActiveDevice = true;
          }
        }
        if (!foundActiveDevice) {
          if (devices.length > 0) {
            devices[0].active = true;
          }
        }

        downloadDependencies();

      }
    }
  });
}

// POST (body: version): update current Spoof Companion download progress
function getDownloadProgress(version, callback) {
  fetch('http://localhost:13369/get_progress', {
    method: 'POST',
    body: version
  }).then(function(e) {
    return e.json()
  }).then(function(r) {
    if (r.error) {

      console.log(r.error);
      document.querySelector("#Spoof_modalTitle").innerHTML = `Uh oh!`;
      document.querySelector("#Spoof_modalMessage").innerHTML = r.error;
      document.querySelector("#Spoof_modalCheckOutTitle").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").innerHTML = "👉 Guide: How to setup Spoof on Resell Companion";
      document.querySelector("#Spoof_Modal").style.display = "block";
    } else if (r.done) {

      callback();
    } else {
      // setDownloadProgress(r.filename, r.progress);
      setTimeout(function() {
        getDownloadProgress(version, callback);
      }, 250);
    }
  });
}

// POST (headers: 'Content-Type': 'application/json') (body: JSON.stringify({udid: device.udid, lat: lat, lng: lng })): sets the device's location to the current marker
function setLocation(dev, callback) {
  fetch('http://localhost:13369/set_location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({udid: dev.udid, lat: dev.lat, lng: dev.lng })
  }).then(function(e) {
    return e.json()
  }).then(function(r) {
    if (r.error) {
      dev.isSpoofing = false;
      console.log(r.error);
      document.querySelector("#Spoof_modalTitle").innerHTML = `Uh oh! (${dev.name})`;
      if (r.error == "Unable to mount developer image.") {
        document.querySelector("#Spoof_modalMessage").innerHTML = `Make sure your device is unlocked to spoof it's location. (${r.error})`;
      } else {
        document.querySelector("#Spoof_modalMessage").innerHTML = r.error;
      }
      document.querySelector("#Spoof_modalCheckOutTitle").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").innerHTML = "👉 Guide: How to setup Spoof on Resell Companion";
      document.querySelector("#Spoof_Modal").style.display = "block";
      callback();
    } else {

      for (var deviceIndex in devices) {
        if (devices[deviceIndex].udid == dev.udid) {
          devices[deviceIndex].isSpoofing = true;
          // addToStatistics(2, 0);
          // TODO: add to statistics
          break
        }
      }

      callback();
    }
  });
}

// POST (headers: 'Content-Type': 'application/json') (body: JSON.stringify({udid: device.udid })): stops spoof for the device
function stopLocation(dev, callback) {
  fetch('http://localhost:13369/stop_location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({udid: dev.udid })
  }).then(function(e) {
    return e.json()
  }).then(function(r) {
    if (r.error) {
      dev.isSpoofing = true;
      console.log(r.error);
      document.querySelector("#Spoof_modalTitle").innerHTML = `Uh oh! (${dev.name})`;
      if (r.error == "Unable to mount developer image.") {
        document.querySelector("#Spoof_modalMessage").innerHTML = `Make sure your device is unlocked to spoof it's location. (${r.error})`;
      } else {
        document.querySelector("#Spoof_modalMessage").innerHTML = r.error;
      }
      document.querySelector("#Spoof_modalCheckOutTitle").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").innerHTML = "👉 Guide: How to setup Spoof on Resell Companion";
      document.querySelector("#Spoof_Modal").style.display = "block";
      callback();
    } else {

      for (var deviceIndex in devices) {
        if (devices[deviceIndex].udid == dev.udid) {
          devices[deviceIndex].isSpoofing = false;
          break
        }
      }

      callback();
    }
  });
}

// POST (headers: 'Content-Type': 'application/json') (body: JSON.stringify({udid: device.udid })): downloads device's DeveloperImage if not present -> then starts/stops Spoof
function locationPerform(dev, locationMethod) {
  fetch('http://localhost:13369/has_dependencies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({udid: dev.udid})
  }).then(function(e) {
    return e.json()
  }).then(function(r) {
    if (r.error) {

      dev.isSpoofing = false;
      console.log(r.error);
      document.querySelector("#Spoof_modalTitle").innerHTML = `Uh oh! (${dev.name})`;
      document.querySelector("#Spoof_modalMessage").innerHTML = r.error;
      document.querySelector("#Spoof_modalCheckOutTitle").style.display = "block";
      document.querySelector("#Spoof_modalCheckOutText").style.display = "block";
      if (r.error.includes("not supported")) {
        document.querySelector("#Spoof_modalCheckOutText").innerHTML = "👉 Guide: Add unofficial support for your iOS version";
        downloadDependencies();
      } else {
        document.querySelector("#Spoof_modalCheckOutText").innerHTML = "👉 Guide: How to setup Spoof on Resell Companion";
      }
      document.querySelector("#Spoof_Modal").style.display = "block";
    } else if (r.result) {
      window.parent.addStatistic('Spoof', 'Device Locations Spoofed');
      locationMethod(dev, function() {

      });
    } else {
      getDownloadProgress(r.version, function() {
        locationMethod(dev, function() {

        });
      });

    }
  });
}

function addTestDevice() {
  devices.push(
    {
      name: "iPhone 11 Pro",
      type: "tablet",
      lat: undefined,
      lng: undefined,
      locationName: "Unspecified Location",
      active: devices.length == 0,
      isSpoofing: false
    }
  );
}

function setActiveDevice(deviceIndex) {
  for (var i = 0; i < devices.length; i++) {
    if (i == deviceIndex) {
      devices[i].active = true;
      // set map marker to devices[i].lat and devices[i].lng
      try {
        if (devices[i].lat != null && devices[i].lng != null) {
          map.flyTo({ center: [devices[i].lng, devices[i].lat] });
          geocoder.mapMarker.setLngLat([devices[i].lng, devices[i].lat]);
          geocoder.setInput(devices[i].locationName);
        }
      } catch(err) {
        // console.log(err);
      }
    } else {
      devices[i].active = false;
    }
  }
}

function setMultipleActiveDevices(deviceIndex) {
  let startDeviceIndex = -1;
  for (var i = 0; i < devices.length; i++) {
    if (devices[i].active) {
      startDeviceIndex = i;
      break;
    }
  }
  if (startDeviceIndex == -1) {
    setActiveDevice(deviceIndex);
  } else {
    // check if deviceIndex is > than startDeviceIndex (go in order) else, deviceIndex is  < than startDeviceIndex, loop reverse
    let allowSetActive = false;
    if (deviceIndex > startDeviceIndex) {
      for (var i = 0; i < devices.length; i++) {
        if (i == startDeviceIndex) {
          allowSetActive = true;
        } else if (i > deviceIndex) {
          break;
        } else if (allowSetActive) {
          devices[i].active = true;
        }
      }
    } else {
      for (var i = devices.length-1; i >= 0; i--) {
        if (i == startDeviceIndex) {
          allowSetActive = true;
        } else if (i < deviceIndex) {
          break;
        } else if (allowSetActive) {
          devices[i].active = true;
        }
      }
    }
  }
}

function switchActiveDevice(deviceIndex) {
  let atLeastOneActive = false;
  for (var i = 0; i < devices.length; i++) {
    if (deviceIndex != i && devices[i].active) {
      atLeastOneActive = true;
      break;
    }
  }
  for (var i = 0; i < devices.length; i++) {
    if (i == deviceIndex) {
      if (atLeastOneActive) {
        devices[i].active = !devices[i].active;
      } else {
        devices[i].active = true;
      }
      break;
    }
  }
}

function setAllDevicesActive(deviceIndex) {
  for (var i = 0; i < devices.length; i++) {
    devices[i].active = true;
  }
}

mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGFlbHZ1b2xvIiwiYSI6ImNrNmZzc3cxejJjZm8zZ3FqNjZjOXN6cXAifQ.EbysNxqLTcyq34p-n3hstw';
window.map = new mapboxgl.Map({
  container: 'Map_Background',
  style: window.parent.companionSettings.theme == "light" ? 'mapbox://styles/michaelvuolo/ck6ft4ygk15481iliboylq305' : 'mapbox://styles/michaelvuolo/ckbk3j51700aa1js1dxmg9y2x',
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}), 'top-right')

var coordinatesGeocoder = function (query) {
  var matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      },
      place_name: 'Lat: ' + lat + ' Lng: ' + lng,
      place_type: ['coordinate'],
      properties: {},
      type: 'Feature'
    };
  }

  var coord1 = Number(matches[1]);
  var coord2 = Number(matches[2]);
  var geocodes = [];

  if (coord2 < -90 || coord2 > 90) {
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (coord1 < -90 || coord1 > 90) {
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  if (geocodes.length === 0) {
    geocodes.push(coordinateFeature(coord2, coord1));
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  return geocodes;
};

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  localGeocoder: coordinatesGeocoder,
  mapboxgl: mapboxgl,
  marker: true
});

document.getElementById('geocoderSearchBar').appendChild(geocoder.onAdd(map));

geocoder.on('result', location => {
  let lat = location.result.geometry.coordinates[1].toString()
  let lng = location.result.geometry.coordinates[0].toString()

  for (let dev of devices) {
    if (dev.active) {
      dev.locationName = location.result.text ? location.result.text : "Unknown Location";
      dev.lat = lat;
      dev.lng = lng;
      if (dev.type != "test") {
        locationPerform(dev, setLocation);
        dev.isSpoofing = true;
      }
    }
  }
});
