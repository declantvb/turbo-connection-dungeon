const PLAYER_RADIUS = 10;
const PLAYER_MOVE_SCALE = 5;
const ROOM_WIDTH = 1200;
const ROOM_HEIGHT = 700;

module.exports.simulate = function(state) {
    for (const key in state.players) {
        const player = state.players[key];

        let newX = player.pX + player.vX * PLAYER_MOVE_SCALE;
        let newY = player.pY + player.vY * PLAYER_MOVE_SCALE;
    
        //bounds
        newX = Math.max(0, Math.min(newX, ROOM_WIDTH));
        newY = Math.max(0, Math.min(newY, ROOM_HEIGHT));
    
        player.pX = newX;
        player.pY = newY;
    }

    state.frameCount++;
}