const PLAYER_RADIUS = 30;
const PICKUP_RADIUS = 30;
const BOSS_RADIUS = 80;
const BULLET_RADIUS = 20;
const PLAYER_MOVE_SCALE = 15;
const THROW_POWER = 40;
const THROW_DEGRADATION = 0.8;
const PICKUP_DAMAGE = 5;
const BULLET_SPEED = 30;
const ROOM_LEFT = 110;
const ROOM_RIGHT = 110;
const ROOM_TOP = 100;
const ROOM_BOTTOM = 90;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 700;
var BOSS_DIFFICULTY = 100;
var BOSS_TELL_TIME = 0.8 * BOSS_DIFFICULTY;
var BOSS_ATTACK_TIME = 0.2 * BOSS_DIFFICULTY;

function changeDifficulty(newDiff) {
    BOSS_DIFFICULTY = newDiff;
    BOSS_TELL_TIME = 0.8 * BOSS_DIFFICULTY;
    BOSS_ATTACK_TIME = 0.2 * BOSS_DIFFICULTY;
}

if (typeof module != 'undefined') {

    normalised = require('./util.js').normalised;
    length = require('./util.js').length;

    module.exports.simulate = simulate;
    module.exports.serverSimulate = serverSimulate;
}

var nextEntityIndex = 1;
function serverSimulate(level, state) {

    if (level.spawners) spawnCrystal(state, level);

    if (state.boss) bossDoesWhatBossDoes(state, level);
}

function spawnCrystal(state, level) {
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
}

function simulate(level, state) {
    for (const key in state.players) {
        const player = state.players[key];

        if (player.health < 100) {
            player.pickup = null;
            continue;
        }

        let free = player.pickup != null ? 0 : 1
        let newX = player.x + player.vX * PLAYER_MOVE_SCALE * free;
        let newY = player.y + player.vY * PLAYER_MOVE_SCALE * free;

        //bounds
        newX = Math.max(level.playArea.x, Math.min(newX, level.playArea.width));
        newY = Math.max(level.playArea.y, Math.min(newY, level.playArea.height));

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

        for (var playerKey in state.players) {
            if (playerKey == key) continue;
            const element = state.players[playerKey];
            if (element.health == 100) continue;
            let distX = player.x - element.x;
            let distY = player.y - element.y;
            let dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < PLAYER_RADIUS + PLAYER_RADIUS) {
                element.health += 5;
                console.log('healing ' + element.health);
            }
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
            if(pickup.despawn == 0){
                delete state.pickups[key];
            }else if (v <= 6 && !pickup.despawn) {
                pickup.despawn = 10;              
            }else if(pickup.despawn){
                pickup.despawn--;
            }
            
        }

        let distX = pickup.x - state.boss.x;
        let distY = pickup.y - state.boss.y;
        let dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < BOSS_RADIUS + PICKUP_RADIUS) {
            state.boss.health -= PICKUP_DAMAGE;
            changeDifficulty(state.boss.health);
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
            if (player.health >= 100 && length(bullet.x - player.x, bullet.y - player.y) < PLAYER_RADIUS + BULLET_RADIUS) {
                if (player.health == 100) {
                    bullet.ttl = 5;
                    bullet.velocity.x *= 0.2;
                    bullet.velocity.y *= 0.2;
                }
                player.health = 0;
            }
        }
    }

    state.frameCount++;
}

function bossDoesWhatBossDoes(state, level) {
    var boss = state.boss;
    if (!boss.hasOwnProperty('state')) {
        boss.state = 'idle';
        boss.stateTime = 100;
    }
    boss.stateTime -= 1;
    if (boss.stateTime === 0) {
        toggleBossState(state, level);
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

function toggleBossState(state, level) {
    var boss = state.boss;
    if (boss.state === 'idle') {
        boss.state = 'attacking';
        targetSomeone(state);
    } else if (boss.state === 'attacking') {
        boss.target = null;
        boss.state = 'moving';
        state.boss.roar = true;
        console.log('roar');
        getBossV(state, level);
    } else if (boss.state === 'moving') {
        boss.state = 'attacking';
        targetSomeone(state);
        state.boss.roar = false;
    }
    console.log('Boss is ' + boss.state);
    boss.stateTime = BOSS_DIFFICULTY;
}

function getBossV(state, level) {
    var boss = state.boss;
    var xMax = 900;
    var xMin = 300;
    var yMax = 500;
    var yMin = 200;
    var targetX = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    var targetY = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;

    var bananaSpawners = level.spawners;
    var topLeftBanana = bananaSpawners[0];
    var topRightBanana = bananaSpawners[1];
    var bottomLeftBanana = bananaSpawners[2];
    var bottomRightBanana = bananaSpawners[3];

    if (targetX <= topLeftBanana.x && targetY <= topLeftBanana.y) {
        targetX = xMin;
        targetY = yMin;
    }
    if (targetX >= topRightBanana.x && targetY <= topRightBanana.y) {
        targetX = xMax;
        targetY = yMin;
    }
    if (targetX <= bottomLeftBanana.x && targetY >= bottomLeftBanana.y) {
        targetX = xMin;
        targetY = yMax;
    }
    if (targetX >= bottomRightBanana.x && targetY >= bottomRightBanana.y) {
        targetX = xMax;
        targetY = yMax;
    }

    var currentX = boss.x;
    var currentY = boss.y;
    boss.xV = (targetX - currentX) / BOSS_DIFFICULTY;
    boss.yV = (targetY - currentY) / BOSS_DIFFICULTY;
}

function targetSomeone(state) {
    let keys = _.filter(_.keys(state.players), function (x) { return state.players[x].health >= 100 });
    if (keys.length == 0) return;
    let rand = Math.floor(Math.random() * keys.length);
    let player = state.players[keys[rand]];
    state.boss.target = {
        id: keys[rand],
        x: player.x,
        y: player.y
    };
}

var bossCooldown = 0;
function fightMeBro(state) {
    let boss = state.boss;
    if (!boss.target) return;

    // Follow slightly
    let player = state.players[boss.target.id];
    if (player) {
        let dX = player.x - boss.target.x;
        let dY = player.y - boss.target.y;
        ({ dx, dy } = normalised(dX, dY));
        boss.target.x += dX / 20;
        boss.target.y += dY / 20;
    }

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
        bossCooldown = BOSS_DIFFICULTY / 5;
        nextEntityIndex++;
    }
    bossCooldown--;
}