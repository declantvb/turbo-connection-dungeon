const PLAYER_RADIUS = 10;
const PLAYER_MOVE_SCALE = 15;
const ROOM_LEFT = 110;
const ROOM_RIGHT = 110;
const ROOM_TOP = 100;
const ROOM_BOTTOM = 90;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 700;

if(typeof module != 'undefined') module.exports.simulate = simulate;

function simulate(state) {
    for (const key in state.players) {
        const player = state.players[key];

        let newX = player.x + player.vX * PLAYER_MOVE_SCALE;
        let newY = player.y + player.vY * PLAYER_MOVE_SCALE;
    
        //bounds
        newX = Math.max(ROOM_LEFT, Math.min(newX, SCREEN_WIDTH - ROOM_RIGHT));
        newY = Math.max(ROOM_TOP, Math.min(newY, SCREEN_HEIGHT - ROOM_BOTTOM));

        // states.pickups.forEach(element => {
        //     let distX = player.x - element.x
        //     if (Math.sqrt() {
            
        //     }
        // });
    
        player.x = newX;
        player.y = newY;
    }

    state.frameCount++;
}