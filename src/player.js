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
        // camera target
        t:{x,y},
        // fire rate in time between shots
        fr:0.1,
        // last fire triggered (seconds)
        lf:0,
    };
    player._r = ()=>renderPlayer(player);
    player._u = (delta)=>updatePlayer(player, STICK_LEFT_HORIZONTAL, STICK_LEFT_VERTICAL, delta);
    player.t.p = player;
    camera.t = player.t;
    return player;
}

function renderPlayer(player) {
    saveContext(ctx);
    translateContext(ctx, player.x, player.y);
    rotateContext(ctx, player.a);

    beginPath(ctx);
    strokeStyle(ctx, COLOR_WHITE);
    moveTo(ctx, 0, -10);
    lineTo(ctx, 20, 0);
    lineTo(ctx, 0, 10);
    stroke(ctx);

    restoreContext(ctx);

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
            gameObjects.push(createParticleExhaust(player.x, player.y, -thrustDirectionVector.x * 400, -thrustDirectionVector.y * 400, 1));
        } else {
            player.dx *= 0.99;
        }
    }

    if(player.dy < 5) {
        player.dy += 1 * delta;
    }
    
    player.x += player.dx;
    player.y += player.dy;
    // Ground collision
    if(player.y > GROUND_HEIGHT) {
        if(player.dy > 0.5) {
            addGameObject(createParticleSplash(player.x, player.y, 1));
        }
        player.y = GROUND_HEIGHT-1;
        player.dy = 0;
        player.a = 270;
    }
    let v = createAngleVector(player.a);
    // fire triggered?
    player.lf += delta;
    if((getGamepadButtonPressed(GAMEPAD_A) || keyActive(KEY_ACTION_FIRE)) && player.lf >= player.fr) {
        gameObjects.push(createParticleLaser(player.x, player.y, v.x * 1200, v.y * 1200, 2));
        player.lf= 0;
    }
    if(getGamepadButtonPressed(GAMEPAD_B)) {
        cameraShake(0.25);
    }
    // set camera target position (100 pixel ahead)
    let t = sumVectors(player, multiplyVector(v, 100));
    player.t.x = t.x;
    player.t.y = t.y;
}