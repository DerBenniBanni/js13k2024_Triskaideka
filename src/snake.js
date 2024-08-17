
function createSnake() {
    let headPoint = createCircle(500,400, 40);
    headPoint._u = (delta) => updateSnake(headPoint, STICK_RIGHT_HORIZONTAL, STICK_RIGHT_VERTICAL, delta);
    let currentpoint = headPoint;
    for(let y = 50; y < BASEHEIGHT; y += 30) {
        currentpoint = chainPoint(currentpoint, createCircle(100,y, 40 - y/30), 20);
    }

    gameObjects.push(headPoint);
    return headPoint;
}


function updateSnake(head, stick_horizontal, stick_vertical, delta) {
    let gamepadVector = getGamepadStickVector(stick_horizontal, stick_vertical);
    if(gamepadVector && vectorLength(gamepadVector) > 0.1) {
        head.x += gamepadVector.x * 200 * delta;
        head.y += gamepadVector.y * 200 * delta;
    }
    fixChainDistances(head);
}