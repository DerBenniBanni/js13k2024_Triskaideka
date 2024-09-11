const SMOKE_RATE_ONE_HP = 0.1;
const PLAYER_MAX_HEIGHT = BASEHEIGHT * 8;
function createPlayer(x,y,rotationAngle) {
    let player = {
        // position
        x,
        y,
        // rotation in degrees
        a:rotationAngle,
        // rotationspeed in degree per second
        as:180,
        // current speed
        dx:0,
        dy:0,
        dv:createPoint(0,0), // speed vector
        dva:0, // speed angle
        dvl:0, // speed length
        // camera target
        t:{x,y},
        // fire rate in time between shots
        fr:0.5/gameData[GAMEDATA_SHIP_FIRERATE],
        l:gameData[GAMEDATA_SHIP_WEAPON],
        // last fire triggered (seconds)
        lf:0,
        // hitpoints
        h:10,
        mh:10,
        alive:true,
        // collision
        cr:10, // collision circle-radius
        ct:0, // timeout from enemy-collision
        // last smoke particle generated (seconds)
        ls:0
    };
    player._r = ()=>renderPlayer(player);
    player._u = (delta)=>updatePlayer(player, STICK_LEFT_HORIZONTAL, STICK_LEFT_VERTICAL, delta);
    player.t.p = player;
    camera.t = player.t;
    return player;
}

function renderPlayer(player) {
    if(!player.alive) {
        return;
    }
    let tip = [0,-25];
    let points = [
        -2,-12,
        -6,-11,
        -5,-9,
        -3,-8,
        -4,-5,
        -14,4, //-8,
        -13,7, //-5,
        -5,2,
        -6,9,
        -3,9,
        -2,8
    ];
    let length = points.length;
    saveContext();
    translateContext(player.x, player.y);
    rotateContext(player.a+90);

    beginPath();
    fillStyle(COLOR_BLACK);
    strokeStyle(COLOR_WHITE);
    moveTo(tip[0], tip[1]);
    for(let i = 0; i<length-1; i+=2) {
        lineTo(points[i], points[i+1]);
    }
    for(let i = length-2; i>=0; i-=2) {
        lineTo(-points[i], points[i+1]);
    }
    lineTo(tip[0], tip[1]);
    fill();
    stroke();

    restoreContext();


}


const PLAYER_MODE_DIRECTIONAL = 1;
const PLAYER_MODE_ROTATIONAL = 2;
let playerMode = PLAYER_MODE_ROTATIONAL;
function updatePlayer(player, stick_horizontal, stick_vertical, delta) {
    player.ct -= delta;
    let gravity = 1;
    let maxDy = 10;
    if(player.h <= 0) {
        player.a -= 360 * delta;
        stopAudio(AUDIO_SFX_ENGINE);
        gravity = 3;
        maxDy = 30;
    } else if(player.y < -PLAYER_MAX_HEIGHT+GROUND_HEIGHT) {
        player.a += 180 * delta;
        gravity = 5;
        maxDy = 50;
    } else {
        let gamepadVector = getGamepadStickVector(stick_horizontal, stick_vertical);
        playerMode = gamepadVector && vectorLength(gamepadVector) > 0.2 ? PLAYER_MODE_DIRECTIONAL : PLAYER_MODE_ROTATIONAL;
        if(playerMode == PLAYER_MODE_DIRECTIONAL) {
        
            let targetAngle = getVectorAngleDegrees(gamepadVector)+360;
            let diffAngle = (targetAngle - player.a  + 180) % 360 - 180;
            let turnspeed = 360; // angle per second
            let maxTurn = turnspeed * delta;
            if(diffAngle < 0) {
                player.a += diffAngle < -maxTurn ? -maxTurn : diffAngle;
            } else if(diffAngle > 0) {
                player.a += diffAngle > maxTurn ? maxTurn : diffAngle;
            }
            player.a = normalizeAngle(player.a);

        } else if(playerMode == PLAYER_MODE_ROTATIONAL) {
            let stickHorizontal = getGamepadStickValue(STICK_LEFT_HORIZONTAL);
            if(keyActive(KEY_ACTION_LEFT) || getGamepadButtonPressed(GAMEPAD_LEFT)) {
                stickHorizontal = -1;
            }
            if(keyActive(KEY_ACTION_RIGHT) || getGamepadButtonPressed(GAMEPAD_RIGHT)) {
                stickHorizontal = 1;
            }
            if(abs(stickHorizontal) > 0.1) {
                player.a += stickHorizontal * delta * player.as;
            }
            
        }
        let thrustInput = 0;
        if(keyActive(KEY_ACTION_UP)|| getGamepadButtonPressed(GAMEPAD_UP)|| getGamepadButtonPressed(GAMEPAD_THRUST)) {
            thrustInput = -1;
        }
        if(thrustInput < -0.1) {
            let thrustDirectionVector = createAngleVector(player.a + rand(-10,10));
            let thrust = multiplyVector(thrustDirectionVector, -thrustInput * 7 * delta);
            player.dx += thrust.x;
            player.dy += thrust.y;
            gameObjects.push(createParticleExhaust(player.x, player.y, player.dx-thrustDirectionVector.x * 400, player.dy-thrustDirectionVector.y * 400, 1));
            playAudio(AUDIO_SFX_ENGINE, false);
        } else {
            player.dx *= 0.995;
            stopAudio(AUDIO_SFX_ENGINE);
        }
    }

    if(player.dy < maxDy) {
        player.dy += gravity * delta;
    }
    
    player.x += player.dx;
    player.y += player.dy;
    
    // Ground collision
    if(player.y > GROUND_HEIGHT-8) {
        if(player.dy > 0.5) {
            addGameObject(createParticleSplash(player.x, player.y, 1));
            camera.et = 0.25;
        }
        player.y = GROUND_HEIGHT-8.1;
        player.dy = 0;
        player.a = 270;
        player.dx = 0;
        if(player.h <= 0 && player.alive) {
            player.alive = false;
            playAudio(AUDIO_SFX_EXPLOSION);
            addGameObject(createParticleExplosion(player.x, player.y,COLOR_RGB_YELLOW));
            for(let i = 0; i < 40; i++) {
                addGameObject(createParticleDebris(player.x, player.y, 3, -300));
            }
            msgDiv.classList.remove('hidden');
            msgDiv.innerText = levels[currentLevel].failure;
            player.lf = -2;
        }
    }
    
    
    let v = createAngleVector(player.a); // vector, the player is facing to
    // fire triggered?
    player.lf += delta;
    player.ls += delta;
    let firePressed = getGamepadButtonPressed(GAMEPAD_A) || keyActive(KEY_ACTION_FIRE);
    if(firePressed && player.lf >= player.fr && player.alive && !player.won) {
        playAudio(AUDIO_SFX_LASER);
        if(player.l == 1 || player.l == 3 && player.alive) {
            gameObjects.push(createParticleLaser(player.x, player.y, v.x * 1200, v.y * 1200, 2));
        }
        if(player.l == 2) {
            let v1 = createAngleVector(player.a-2);
            let v2 = createAngleVector(player.a+2);
            gameObjects.push(createParticleLaser(player.x, player.y, v1.x * 1200, v1.y * 1200, 2));
            gameObjects.push(createParticleLaser(player.x, player.y, v2.x * 1200, v2.y * 1200, 2));
        } else if(player.l == 3) {
            let v1 = createAngleVector(player.a-5);
            let v2 = createAngleVector(player.a+5);
            gameObjects.push(createParticleLaser(player.x, player.y, v.x * 1200, v.y * 1200, 2));
            gameObjects.push(createParticleLaser(player.x, player.y, v1.x * 1200, v1.y * 1200, 2));
            gameObjects.push(createParticleLaser(player.x, player.y, v2.x * 1200, v2.y * 1200, 2));
        }
        player.lf= 0;
    }
    if(getGamepadButtonPressed(GAMEPAD_B)) {
        cameraShake(0.25);
    }
    // smoke
    if(player.h < player.mh && SMOKE_RATE_ONE_HP * player.h < player.ls) {
        gameObjects.push(createParticleSmoke(player.x, player.y));
        player.ls = 0;
    }
    // wrap
    let wrapDiffX = 0;
    if(player.x < leftMostEnemy - WRAP_DISTANCE * 1.1) {
        wrapDiffX = (rightMostEnemy + WRAP_DISTANCE) - player.x;
    }
    if(player.x > rightMostEnemy + WRAP_DISTANCE * 1.1) {
        wrapDiffX = -(player.x - (leftMostEnemy - WRAP_DISTANCE));
    }
    if(wrapDiffX != 0) {
        player.x += wrapDiffX;
        camera.x += wrapDiffX;
    }
    // set camera target position (100 pixel ahead)
    let t = sumVectors(player, multiplyVector(v, 100));
    player.t.x = t.x;
    player.t.y = t.y;
    // update player speed vector
    player.dv.x = player.dx;
    player.dv.y = player.dy;
    player.dva = getVectorAngleDegrees(player.dv);
    player.dvl = vectorLength(player.dv);
}