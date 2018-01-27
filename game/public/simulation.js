const PLAYER_RADIUS = 30;
const PICKUP_RADIUS = 40;
const BOSS_RADIUS = 80;
const PLAYER_MOVE_SCALE = 15;
const THROW_POWER = 40;
const THROW_DEGRADATION = 0.8;
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

var nextEntityIndex = 1;
function serverSimulate(level, state) {
    let pickupKeys = _.keys(state.pickups);
    if (level && pickupKeys.length < 2) {
        let rand = Math.floor(Math.random() * Math.floor(level.spawners.length));
        let spawner = level.spawners[rand];

        for (var pickupKey in state.pickups) {
            const element = state.pickups[pickupKey];
            let distX = spawner.x - element.x;
            let distY = spawner.y - element.y;
            let dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < PICKUP_RADIUS + PICKUP_RADIUS) {
                return;
            }
        }

        for (var playerKey in state.players) {
            const element = state.players[playerKey];
            let distX = spawner.x - element.x;
            let distY = spawner.y - element.y;
            let dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < PLAYER_RADIUS + PICKUP_RADIUS) {
                return;
            }
        }

        state.pickups[nextEntityIndex] = {
            key: nextEntityIndex,
            x: spawner.x,
            y: spawner.y,
            damage: 10
        };

        nextEntityIndex++;
    }
}

function simulate(level, state) {
    for (const key in state.players) {
        const player = state.players[key];
        let free = player.pickup != null ? 0 : 1
        let newX = player.x + player.vX * PLAYER_MOVE_SCALE * free;
        let newY = player.y + player.vY * PLAYER_MOVE_SCALE * free;

        //bounds
        newX = Math.max(ROOM_LEFT, Math.min(newX, SCREEN_WIDTH - ROOM_RIGHT));
        newY = Math.max(ROOM_TOP, Math.min(newY, SCREEN_HEIGHT - ROOM_BOTTOM));

        if (!player.pickup) {
            for (var pickupKey in state.pickups) {
                const element = state.pickups[pickupKey];
                let distX = player.x - element.x;
                let distY = player.y - element.y;
                let dist = Math.sqrt(distX * distX + distY * distY);
                if (dist < PLAYER_RADIUS + PICKUP_RADIUS && element.lastPlayer != key) {
                    player.pickup = element;
                    delete state.pickups[pickupKey];
                    break;
                }
            }
        }

        if (player.inputThrow) {
            if (player.pickup) {
                var thing = player.pickup;
                thing.lastPlayer = key;
                thing.x = player.x;
                thing.y = player.y;
                thing.velocity = {
                    x: player.inputThrow.dX * THROW_POWER,
                    y: player.inputThrow.dY * THROW_POWER
                };

                state.pickups[thing.key] = thing;
                player.pickup = null;
            }
            player.inputThrow = null;
        }

        player.x = newX;
        player.y = newY;
    }

    for (const key in state.pickups) {
        const pickup = state.pickups[key];

        if (pickup.velocity) {
            pickup.x += pickup.velocity.x;
            pickup.y += pickup.velocity.y;

            pickup.velocity.x *= THROW_DEGRADATION;
            pickup.velocity.y *= THROW_DEGRADATION;

            let v = Math.sqrt(pickup.velocity.x * pickup.velocity.x + pickup.velocity.y * pickup.velocity.y);
            if (v <= 0.01) {
                delete state.pickups[key];
            }
        }

        let distX = pickup.x - state.boss.x;
        let distY = pickup.y - state.boss.y;
        let dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < BOSS_RADIUS + PICKUP_RADIUS) {
            state.boss.health -= pickup.damage;
            console.log(`boss hit! ${state.boss.health}/100`);
            delete state.pickups[key];
        }        
    }

    bossDoesWhatBossDoes(state);
    state.boss.moving = false;
    state.frameCount++;
}

function bossDoesWhatBossDoes(state){
    var boss = state.boss;
    if(!boss.state){
        boss.state = 'idle';
        boss.stateTime = 100;

    }
    

    boss.stateTime--;
    if(boss.stateTime === 0){
        toggleBossState(boss);
    }
}

function toggleBossState(boss){
    if(boss.state === 'idle'){
        boss.state = 'moving';
    }else if(boss.state === 'moving'){
        boss.state = 'idle';
    }
    boss.stateTime = 100;
}