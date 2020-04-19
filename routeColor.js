export const COLORS = [
  "#ff0000",
  "#f20000",
  "#ffbfbf",
  "#8c6246",
  "#ff8800",
  "#ffcc00",
  "#665200",
  "#fbffbf",
  "#ccff00",
  "#4f8c46",
  "#00ff66",
  "#00ffee",
  "#004d47",
  "#00ccff",
  "#004d73",
  "#0088ff",
  "#0044ff",
  "#001b66",
  "#d9bfff",
  "#ee00ff",
  "#804073",
  "#ff0088",
  "#7f0022"
];

var index = 0;
export function getNextColorForRoute() {
  if (index == COLORS.length) {
    index = 0;
  }
  return COLORS[index++];
}
