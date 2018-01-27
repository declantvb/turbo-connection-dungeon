function interp(a, b, t){
  return a * t + b * (1-t);
}

function length(x, y) {
  return Math.sqrt(x * x + y * y);
}

function normalised(x, y) {
  var length = length(x, y);
  return { x: x / length, y: y / length };
}