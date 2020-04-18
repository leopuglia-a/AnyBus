"use strict";

export class Bus {
  constructor(
    id,
    routeTag,
    dirTag,
    lat,
    lon,
    secsSinceReport,
    predictable,
    heading,
    speedKmHr
  ) {
    this.id = id;
    this.routeTag = routeTag;
    this.dirTag = dirTag;
    this.lat = lat;
    this.lon = lon;
    this.secsSinceReport = secsSinceReport;
    this.predictable = predictable;
    this.heading = heading;
    this.speedKmHr = speedKmHr;
  }
}
