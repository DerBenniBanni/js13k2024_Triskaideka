const SMOKE_RATE_ONE_HP = 0.1;
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
        fr:0.1,
        // last fire triggered (seconds)
        lf:0,
        // hitpoints
        h:10,
        mh:10,
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
    fillStyle('#000');
    strokeStyle('#fff');
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
    if(playerMode == PLAYER_MODE_DIRECTIONAL) {
        let gamepadVector = getGamepadStickVector(stick_horizontal, stick_vertical);
        if(gamepadVector && vectorLength(gamepadVector) > 0.2) {
            player.a = getVectorAngleDegrees(gamepadVector);
            player.dx += gamepadVector.x * 5 * delta;
            player.dy += gamepadVector.y * 5 * delta;
            gameObjects.push(createParticleExhaust(player.x, player.y, -gamepadVector.x * 400, -gamepadVector.y * 400, 1));
        } else {
            player.dx *= 0.99;
            player.dy *= 0.99;
        }
    } else if(playerMode == PLAYER_MODE_ROTATIONAL) {
        let stickHorizontal = getGamepadStickValue(STICK_LEFT_HORIZONTAL);
        if(keyActive(KEY_ACTION_LEFT)) {
            stickHorizontal = -1;
        }
        if(keyActive(KEY_ACTION_RIGHT)) {
            stickHorizontal = 1;
        }
        if(abs(stickHorizontal) > 0.1) {
            player.a += stickHorizontal * delta * player.as;
        }
        let stickVertical = getGamepadStickValue(STICK_LEFT_VERTICAL);
        if(keyActive(KEY_ACTION_UP)) {
            stickVertical = -1;
        }
        if(stickVertical < -0.1) {
            let thrustDirectionVector = createAngleVector(player.a);
            let thrust = multiplyVector(thrustDirectionVector, -stickVertical * 7 * delta);
            player.dx += thrust.x;
            player.dy += thrust.y;
            gameObjects.push(createParticleExhaust(player.x, player.y, player.dx-thrustDirectionVector.x * 400, player.dy-thrustDirectionVector.y * 400, 1));
            playAudio(AUDIO_SFX_ENGINE, false);
        } else {
            player.dx *= 0.99;
            stopAudio(AUDIO_SFX_ENGINE);
        }
    }

    if(player.dy < 5) {
        player.dy += 1 * delta;
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
    }
    let v = createAngleVector(player.a);
    // fire triggered?
    player.lf += delta;
    player.ls += delta;
    if((getGamepadButtonPressed(GAMEPAD_A) || keyActive(KEY_ACTION_FIRE)) && player.lf >= player.fr) {
        playAudio(AUDIO_SFX_LASER);
        gameObjects.push(createParticleLaser(player.x, player.y, v.x * 1200, v.y * 1200, 2));
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