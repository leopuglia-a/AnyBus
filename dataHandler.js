"use strict";

import { Bus } from "./Bus.js";

const api = {
  agency: "sf-muni",
  base: "http://webservices.nextbus.com/service/publicXMLFeed?command="
};

// Commands accepted by API, for future use
const apiCommands = {
  agencyList: "agencyList",
  routeConfig: "routeConfig",
  routeList: "routeList",
  vehicleLocations: "vehicleLocations",
  singleVehicleLocation: "vehicleLocation"
};

const xhr = new XMLHttpRequest();
const parser = new DOMParser();

export var currentBuses = [];
// Allow to specify a callback for fetchVe hicleData
let busesRenderer = undefined;

export function fetchVehicleData(callback) {
  console.log("fetchVehicleData");
  if (!callback) throw "fetchVehicleCallback cannot be undefined";
  busesRenderer = callback;
  xhr.addEventListener("load", xmlResponseCallback);
  xhr.open(
    "GET",
    `${api.base}${apiCommands.vehicleLocations}&a=${api.agency}&t=0`
  );
  xhr.send();
}

function xmlResponseCallback() {
  const body = this.responseText;
  const vehicles = extractVehiclesFromXML(body);
  updateVehicles(vehicles);
  busesRenderer(currentBuses);
}

export function extractVehiclesFromXML(xmlStr) {
  const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
  const vehicles = xmlDoc.getElementsByTagName("vehicle");
  console.log(vehicles);
  return vehicles;
}

// Clear vehicles before creating updated ones
function updateVehicles(vehicles) {
  currentBuses.splice(0, currentBuses.length);
  Array.from(vehicles).map(v => {
    currentBuses.push(
      new Bus(
        v.getAttribute("id"),
        v.getAttribute("routeTag"),
        v.getAttribute("dirTag"),
        v.getAttribute("lat"),
        v.getAttribute("lon"),
        v.getAttribute("secsSinceReport"),
        v.getAttribute("predictable"),
        v.getAttribute("heading"),
        v.getAttribute("speedKmHr")
      )
    );
  });
}
