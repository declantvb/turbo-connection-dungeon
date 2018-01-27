function interp(from, to, t){
  return to * t + from * (1-t);
}

function interpObj(from, to, t) {
  if (t === undefined) throw "Bugger off!"
  return {
    x: interp(from.x, to.x, t),
    y: interp(from.y, to.y, t)
  }
}

function length(x, y) {
  return Math.sqrt(x * x + y * y);
}

function normalised(x, y) {
  var l = length(x, y);
  return { x: x / l, y: y / l };
}

if (typeof module != 'undefined') {
  module.exports.length = length;
  module.exports.normalised = normalised;
}