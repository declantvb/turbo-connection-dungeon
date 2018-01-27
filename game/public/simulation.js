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

var entityIndex = 1;
function serverSimulate(level, state) {
    let pickupKeys = _.keys(state.pickups);
    if (level && pickupKeys.length < 2) {
        let rand = Math.floor(Math.random() * level.spawners.length);
        let spawner = level.spawners[rand];
        console.log("making");
        state.pickups[(entityIndex++).toString()] = {
            x: spawner.x,
            y: spawner.y
        };
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
            for (var pickupKey in state.pickups) {
                const element = state.pickups[pickupKey];
                let distX = player.x - element.x;
                let distY = player.y - element.y;
                let dist = Math.sqrt(distX * distX + distY * distY);
                if (dist < PLAYER_RADIUS + PICKUP_RADIUS) {
                    player.pickup = element;
                    delete state.pickups[pickupKey];
                    break;
                }
            }
        }

        player.x = newX;
        player.y = newY;
    }
    state.boss.moving = false;
    state.frameCount++;
}