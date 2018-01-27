const PLAYER_RADIUS = 30;
const PICKUP_RADIUS = 30;
const BOSS_RADIUS = 80;
const BULLET_RADIUS = 20;
const PLAYER_MOVE_SCALE = 15;
const THROW_POWER = 40;
const THROW_DEGRADATION = 0.8;
const PICKUP_DAMAGE = 5;
const BOSS_TELL_TIME = 75;
const BOSS_ATTACK_TIME = 25;
const BULLET_SPEED = 30;
const BULLET_DAMAGE = 20;
const ROOM_LEFT = 110;
const ROOM_RIGHT = 110;
const ROOM_TOP = 100;
const ROOM_BOTTOM = 90;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 700;

if (typeof module != 'undefined') {
    
    normalised = require('./util.js').normalised;
    length = require('./util.js').length;

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
            y: spawner.y
        };

        nextEntityIndex++;
    }

    bossDoesWhatBossDoes(state);
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

        // Player picking up weapon thing
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

        // Player throwing weapon thing
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

    // Update all weapon things
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
            state.boss.health -= PICKUP_DAMAGE;
            delete state.pickups[key];
        }
    }

    // Update all weapon things
    for (const key in state.bullets) {
        const bullet = state.bullets[key];

        if (bullet.velocity) {
            var factor = bullet.ttl ? 1 : 1.05;
            bullet.velocity.x *= factor;
            bullet.velocity.y *= factor;

            bullet.x += bullet.velocity.x;
            bullet.y += bullet.velocity.y;
        }

        if (bullet.ttl) {
            bullet.ttl--;
            if (bullet.ttl <= 0) {
                delete state.bullets[key];
            }
            continue;
        }

        for (var playerKey in state.players) {
            const player = state.players[playerKey];
            if (length(bullet.x - player.x, bullet.y - player.y) < PLAYER_RADIUS + BULLET_RADIUS) {
                console.log(playerKey + ' hit');
                player.health -= BULLET_DAMAGE;
                bullet.ttl = 5;
                bullet.velocity.x *= 0.2;
                bullet.velocity.y *= 0.2;
            }
        }
    }

    state.frameCount++;
}

function bossDoesWhatBossDoes(state) {
    var boss = state.boss;
    if (!boss.hasOwnProperty('state')) {
        boss.state = 'idle';
        boss.stateTime = 100;
    }
    boss.stateTime -= 1;
    if (boss.stateTime === 0) {
        toggleBossState(state);
    }
    if (boss.state === 'moving') {
        shakeItBaby(boss)
    }
    if (boss.state === 'attacking') {
        fightMeBro(state)
    }
}

function shakeItBaby(boss) {
    boss.x += boss.xV;
    boss.y += boss.yV;
}

function toggleBossState(state) {
    var boss = state.boss;
    if (boss.state === 'idle') {
        boss.state = 'attacking';
        targetSomeone(state);
    } else if (boss.state === 'attacking') {
        boss.target = null;
        boss.state = 'moving';
        getBossV(state);
    } else if (boss.state === 'moving') {
        boss.state = 'attacking';
        targetSomeone(state);
    }
    console.log('Boss is ' + boss.state);
    boss.stateTime = 100;
}

function getBossV(state) {
    var boss = state.boss;
    var xMax = 900;
    var xMin = 300;
    var yMax = 500;
    var yMin = 200;
    var targetX = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    var targetY = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
    var currentX = boss.x;
    var currentY = boss.y;
    boss.xV = (targetX - currentX) / 100;
    boss.yV = (targetY - currentY) / 100;
}

function targetSomeone(state) {
    let keys = _.keys(state.players);
    if (keys.length == 0) return;
    let rand = Math.floor(Math.random() * keys.length);
    let player = state.players[keys[rand]];
    state.boss.target = {
        x: player.x,
        y: player.y
    };
}

var bossCooldown = 0;
function fightMeBro(state) {
    let boss = state.boss;
    if (!boss.target) return;
    if (boss.stateTime < BOSS_TELL_TIME && boss.stateTime > BOSS_ATTACK_TIME && bossCooldown <= 0) {
        let { x, y } = normalised(boss.target.x - boss.x, boss.target.y - boss.y);
        state.bullets[nextEntityIndex] = {
            x: boss.x,
            y: boss.y,
            velocity: {
                x: x * BULLET_SPEED,
                y: y * BULLET_SPEED
            }
        };
        bossCooldown = 5;
        nextEntityIndex++;
    }
    bossCooldown--;
}