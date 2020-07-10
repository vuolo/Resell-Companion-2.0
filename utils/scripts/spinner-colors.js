// automatically rotate all loading circle colors

const loadingColors = [
  "#FFA74E", // orange
  "#FD3535", // red
  "#CE8CE5", // purple
  "#5BB6BB" // blue
];
let curColorIndex = 1;

setInterval(function() {
  for (var path of document.querySelectorAll(".spinner .path")) {
    path.style.stroke = loadingColors[curColorIndex];
    curColorIndex++;
    if (curColorIndex >= loadingColors.length) curColorIndex = 0;
  }
}, 1500);
