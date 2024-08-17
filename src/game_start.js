let gameObjects = [];

let player = createPlayer(800,450);

const headPoint = createCircle(500,400, 40);
let currentpoint = headPoint;
for(let y = 50; y < BASEHEIGHT; y += 30) {
    currentpoint = chainPoint(currentpoint, createCircle(100,y, 40 - y/30), 20);
}
/*
const headPoint2 = createCircle(500,400, 40);
currentpoint = headPoint2;
for(let y = 50; y < BASEHEIGHT; y += 20) {
    currentpoint = chainPoint(currentpoint, createCircle(900,y, 40 - y/30), 20);
}
*/



let gameTime = 0;




function render() {
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
/*
    [headPoint].forEach(head => {
        renderChain(head);
    })
        */
    headPoint._r();

    //renderPlayer(player);
    player._r();
    gameObjects
        .filter(gameObject=>gameObject._r)
        .forEach(gameObject => gameObject._r());
}

function update() {
    let delta = getDelta();
    getGamepadState();
    gameTime += delta;
    
    updateSnake(headPoint, STICK_RIGHT_HORIZONTAL, STICK_RIGHT_VERTICAL, delta);
    //updateSnake(headPoint2, STICK_LEFT_HORIZONTAL, STICK_LEFT_VERTICAL, delta);
    //updatePlayer(player, STICK_LEFT_HORIZONTAL, STICK_LEFT_VERTICAL, delta);
    player._u(delta);
    gameObjects.forEach(gameObject => {
        if(gameObject._u) {
            gameObject._u(delta);
        }
    });
    gameObjects = gameObjects.filter(gameObject => gameObject.ttl === undefined || gameObject.ttl > 0);
}

function updateSnake(head, stick_horizontal, stick_vertical, delta) {
    let gamepadVector = getGamepadStickVector(stick_horizontal, stick_vertical);
    if(gamepadVector && vectorLength(gamepadVector) > 0.1) {
        head.x += gamepadVector.x * 200 * delta;
        head.y += gamepadVector.y * 200 * delta;
    }
    fixChainDistances(head);
}

function loop() {
    update()
    render();
    requestAnimationFrame(loop);
}

getDelta();
loop();


