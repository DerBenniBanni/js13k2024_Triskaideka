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
    /*
    saveContext(ctx);
    translateContext(ctx, player.t.x, player.t.y);
    beginPath(ctx);
    strokeStyle(ctx,COLOR_WHITE);
    circle(ctx,0,0,3);
    stroke(ctx);
*/
    restoreContext(ctx);

}

function updatePlayer(player, stick_horizontal, stick_vertical, delta) {
    // directional steering
    /*
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
    */
    // rotational steering
    let stickHorizontal = getGamepadStickValue(STICK_LEFT_HORIZONTAL);
    if(abs(stickHorizontal) > 0.1) {
        player.a += stickHorizontal * delta * player.as;
    }
    let stickVertical = getGamepadStickValue(STICK_LEFT_VERTICAL);
    if(stickVertical < -0.1) {
        let thrustDirectionVector = createStandardVector(player.a);
        let thrust = multiplyVector(thrustDirectionVector, -stickVertical * 7 * delta);
        console.log(stickVertical, thrust);
        player.dx += thrust.x;
        player.dy += thrust.y;
        gameObjects.push(createParticleExhaust(player.x, player.y, -thrustDirectionVector.x * 400, -thrustDirectionVector.y * 400, 1));
    } else {
        player.dx *= 0.99;
        player.dy *= 0.99;
    }

    if(player.dy < 1) {
        player.dy += 1 * delta;
    }
    player.x += player.dx;
    player.y += player.dy;
    if(player.y > GROUND_HEIGHT) {
        player.y = GROUND_HEIGHT-1;
        player.dy = 0;
        player.a = 270;
    }
    let v = createStandardVector(player.a);
    player.lf += delta;
    if(getGamepadButtonPressed(GAMEPAD_A) && player.lf >= player.fr) {
        gameObjects.push(createParticleLaser(player.x, player.y, v.x * 1200, v.y * 1200, 2));
        player.lf= 0;
    }
    if(getGamepadButtonPressed(GAMEPAD_B)) {
        camera.et = 0.25;
    }
    let t = sumVectors(player, multiplyVector(v, 100));
    player.t.x = t.x;
    player.t.y = t.y;
}