"use strict";

import { Map } from "./Map.js";
import { fetchVehicleData } from "./main.js";
import { routeColor } from "./routeColor.js";

const files = [
  "sfmaps/arteries.json",
  "sfmaps/freeways.json",
  "sfmaps/neighborhoods.json",
  "sfmaps/streets.json",
];

const width = 960;
const height = 900;

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
var sfo;
var index = 0;
var route_color = ["red", "yellow", "black", "green"];
const MAX_COLORS = 4;

files.forEach(function (fileName) {
  q.defer(d3.json, fileName);
});

q.awaitAll(makeMap);

function getNextColorForRoute() {
  if (index == MAX_COLORS) {
    index = 0;
  }
  return route_color[index++];
}

function drawBuses(buses) {
  // {String: [Bus]}: Key represents the routeTag, and the value is a list of buses that belong to the route.
  let busesLocations = {};
  let routeColor = {};
  buses.forEach((b) => {
    if (!(b.routeTag in busesLocations)) {
      busesLocations[b.routeTag] = [];
      routeColor[b.routeTag] = getNextColorForRoute();
    }
    busesLocations[b.routeTag].push(b);
  });

  console.log("busesLocation type:", typeof busesLocations);
  console.log("busesLocation data:", busesLocations);

  for (const routeTag of busesLocations) {
    console.log(routeTag, busesLocations[routeTag]);
    let color = routeColor[routeTag];
    const coordinates = [];

    busesLocations[routeTag].forEach((d) => {
      coordinates.push([d.lon, d.lat]);
    });

    // console.log(busesLocations);
    svg
      .selectAll("circle")
      .data(coordinates)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return projection(d)[0];
      })
      .attr("cy", function (d) {
        return projection(d)[1];
      })
      .attr("r", "2px")
      .attr("fill", color);
  }
}

function makeMap(error, data) {
  if (error) throw error;

  fetchVehicleData(drawBuses);

  sfo = new Map(data[0], data[1], data[2], data[3]);

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

  // g.append("circle")
  //   .attr("cx", 100)
  //   .attr("cy", 100)
  //   .attr("r", 3)
  //   .attr("stroke", "black")
  //   .attr("fill", "red");
}