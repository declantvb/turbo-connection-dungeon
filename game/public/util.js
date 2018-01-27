function interp(from, to, t){
  return to * t + from * (1-t);
}

function interpObj(from, to, t) {
  if (t === undefined) throw "Bugger off!"
  console.dir(from);
  return {
    x: interp(from.x, to.x, t),
    y: interp(from.y, to.y, t)
  }
}

function length(x, y) {
  return Math.sqrt(x * x + y * y);
}

function normalised(x, y) {
  var length = length(x, y);
  return { x: x / length, y: y / length };
}