const TYPE_SNAKE = 1;
function createSnake(x, y, headsize, segments, speed) {
    let headPoint = createCircle(x,y, headsize);
    headPoint.ot = TYPE_SNAKE;
    headPoint.hp = 10;
    // gamepad control? 
    // headPoint._u = (delta) => updateSnake(headPoint, STICK_RIGHT_HORIZONTAL, STICK_RIGHT_VERTICAL, delta);
    headPoint._u = (delta) => updateSnake(headPoint, delta, speed || 50);
    let currentpoint = headPoint;
    for(let i = 1; i <= segments; i++) {
        let size = headsize - i*(headsize/segments);
        currentpoint = chainPoint(currentpoint, createCircle(x-400,y-i*headsize, size), size);
    }
    // target point spin speed
    headPoint.tSpin = rand(30,60) * (randInt(0,1) == 1 ? 1 : -1);

    gameObjects.push(headPoint);
    return headPoint;
}


function updateSnake(head, delta, speed) {
    let targetPoint = createPoint(player.x, player.y);
    targetPoint.x += sin(toRad(gameTime*head.tSpin)) * head.r*1.5;
    targetPoint.y += cos(toRad(gameTime*head.tSpin)) * head.r*1.5;
    let targetVector = getStandardVector(pointDifferenceVector(head, targetPoint));
    head.x += targetVector.x * speed * delta;
    head.y += targetVector.y * speed * delta;
    fixChainDistances(head);
}

/* GAMEPAD controlled snake...?
function updateSnake(head, stick_horizontal, stick_vertical, delta) {
    let gamepadVector = getGamepadStickVector(stick_horizontal, stick_vertical);
    if(gamepadVector && vectorLength(gamepadVector) > 0.1) {
        head.x += gamepadVector.x * 200 * delta;
        head.y += gamepadVector.y * 200 * delta;
    }
    fixChainDistances(head);
}
*/