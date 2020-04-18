"use strict";

import { Bus } from "./Bus.js";

const api = {
  agency: "sf-muni",
  base: "http://webservices.nextbus.com/service/publicXMLFeed?command=",
};

const apiCommands = {
  agencyList: "agencyList",
  routeConfig: "routeConfig",
  routeList: "routeList",
  vehicleLocations: "vehicleLocations",
  singleVehicleLocation: "vehicleLocation",
};

const xhr = new XMLHttpRequest();
const parser = new DOMParser();

export var currentBuses = [];

let busesRenderer = undefined;

export function fetchVehicleData(callback) {
  if (!callback) throw "fetchVehicleCallback cannot be undefined";
  busesRenderer = callback;
  xhr.addEventListener("load", xmlResponseCallback);
  xhr.open(
    "GET",
    `${api.base}${apiCommands.vehicleLocations}&a=${api.agency}&t=0`
  );
  xhr.send();

  setInterval(() => {
    xhr.addEventListener("load", xmlResponseCallback);
    xhr.open(
      "GET",
      `${api.base}${apiCommands.vehicleLocations}&a=${api.agency}&t=0`
    );
    xhr.send();
  }, 15000);
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
  return vehicles;
}

function updateVehicles(vehicles) {
  currentBuses.splice(0, currentBuses.length);
  Array.from(vehicles).map((v) => {
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

// function getVehicleLocation() {
//   getResults(apiCommands.vehicleLocation, api.agency, 1);
// }

// function getResults(
//   command,
//   agency,
//   vehicleId = undefined,
//   time = "0",
//   routeId = undefined
// ) {
//   xhr.open(
//     "GET",
//     `${api.base}${command}&a=${agency}&r=${routeId}&t=${time}&=v${vehicleId}`
//   );
//   xhr.send();
// }

// function getRoutes() {
//   getResults(apiCommands.routeList, api.agency);
// }

// function getRouteInfo() {
//   getResults(apiCommands.routeConfig, api.agency, 1);
//   getVehicles();
// }
