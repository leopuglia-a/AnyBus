"use strict";

import { Map } from "./Map.js";
import { fetchVehicleData } from "./dataHandler.js";
import { getNextColorForRoute } from "./routeColor.js";

const files = [
  "sfmaps/arteries.json",
  "sfmaps/freeways.json",
  "sfmaps/neighborhoods.json",
  "sfmaps/streets.json"
];

// d3 configuration and initialization.

const width = 960;
const height = 900;
var routeColor = {};

const projection = d3
  .geoMercator()
  .scale(300000)
  .center([-122.433701, 37.767683])
  .translate([width / 2, height / 2]);

const geoGen = d3.geoPath().projection(projection);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const g = svg.append("g");
const q = d3.queue();

// Get coordinates for map rendering
files.forEach(function(fileName) {
  q.defer(d3.json, fileName);
});
// Map rendering
q.awaitAll(makeMap);

// Buses rendering, data from NextBus api
function drawBuses(buses) {
  // {String: [Bus]}: Key represents the routeTag, and the value is a list of buses that belong to the route.
  let busesLocations = {};

  buses.forEach(b => {
    if (!(b.routeTag in routeColor)) {
      routeColor[b.routeTag] = getNextColorForRoute();
    }
    b.color = routeColor[b.routeTag];
  });

  // bind buses to circle in map
  const circle = svg.selectAll("circle").data(buses, function(b) {
    return b.busId;
  });

  // draw buses as point
  circle
    .enter()
    .append("circle")
    .attr("cx", function(b) {
      return projection([b.lon, b.lat])[0];
    })
    .attr("cy", function(b) {
      return projection([b.lon, b.lat])[1];
    })
    .attr("r", "3px")
    .attr("fill", function(b) {
      return b.color;
    });

  // update on map, TODO improvement on circle updates
  circle
    .exit()
    .transition()
    .attr("r", 0)
    .remove();
}

// Map rendering
function makeMap(error, data) {
  if (error) throw error;

  fetchVehicleData(drawBuses);

  // array data[] contains datas from SF map
  const sfo = new Map(data[0], data[1], data[2], data[3]);

  g.append("g")
    .selectAll("path")
    .data(sfo.neighborhoods.features)
    .enter()
    .append("path")
    .attr("class", "neighborhood")
    .attr("d", geoGen);

  g.append("g")
    .selectAll("path")
    .data(sfo.streets.features)
    .enter()
    .append("path")
    .attr("class", "streets")
    .attr("d", geoGen);

  g.append("g")
    .selectAll("path")
    .data(sfo.arteries.features)
    .enter()
    .append("path")
    .attr("class", "arteries")
    .attr("d", geoGen);

  g.append("g")
    .selectAll("path")
    .data(sfo.freeways.features)
    .enter()
    .append("path")
    .attr("class", "freeways")
    .attr("d", geoGen);

  // Update buses periodically
  setInterval(() => {
    fetchVehicleData(drawBuses);
  }, 15000);
}
