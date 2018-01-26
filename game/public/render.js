
function render(oldState, newState, t) {
  updatePlayers(lastLocalState.players, localState.players, t);
}


var playerObjs = {};
function updatePlayers(oldPlayers, newPlayers, t) {

  var keys = _.difference(_.keys(newPlayers), _.keys(playerObjs));
  for (var i in keys) {
    playerObjs[keys[i]] = {
      character: new Character()
    };
  }

  // Update player graphics
  for (var key in oldPlayers) {
    var np = newPlayers[key];
    var op = oldPlayers[key];
    if (!(np && op)) continue;
    var x = (np.pX * t) + (op.pX * (1 - t));
    var y = (np.pY * t) + (op.pY * (1 - t));
    playerObjs[key].character.move(x, y);
  }
}