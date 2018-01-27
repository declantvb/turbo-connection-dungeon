const PLAYER_RADIUS = 10;
const PICKUP_RADIUS = 10;
const PLAYER_MOVE_SCALE = 15;
const ROOM_LEFT = 110;
const ROOM_RIGHT = 110;
const ROOM_TOP = 100;
const ROOM_BOTTOM = 90;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 700;

if (typeof module != 'undefined') {
    module.exports.simulate = simulate;
    module.exports.serverSimulate = serverSimulate;
}

function serverSimulate(level, state) {
    if (level && state.pickups.length < 2) {
        let rand = Math.floor(Math.random() * level.spawners.length);
        let spawner = level.spawners[rand];
        state.pickups.push({
            x: spawner.x,
            y: spawner.y
        });
    }    
}

function simulate(level, state) {
    for (const key in state.players) {
        const player = state.players[key];

        let newX = player.x + player.vX * PLAYER_MOVE_SCALE;
        let newY = player.y + player.vY * PLAYER_MOVE_SCALE;

        //bounds
        newX = Math.max(ROOM_LEFT, Math.min(newX, SCREEN_WIDTH - ROOM_RIGHT));
        newY = Math.max(ROOM_TOP, Math.min(newY, SCREEN_HEIGHT - ROOM_BOTTOM));

        if (!player.pickup) {
            for (let index = 0; index < state.pickups.length; index++) {
                const element = state.pickups[index];
                let distX = player.x - element.x;
                let distY = player.y - element.y;
                let dist = Math.sqrt(distX * distX + distY * distY);
                if (dist < PLAYER_RADIUS + PICKUP_RADIUS) {
                    player.pickup = element;
                    state.pickups.splice(index, 1);
                    index++;
                    break;
                }
            }
        }

        player.x = newX;
        player.y = newY;
    }

    state.frameCount++;
}