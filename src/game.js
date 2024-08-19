const GROUND_HEIGHT = BASEHEIGHT - 50;


function addGameObject(gameObject) {
    gameObjects.push(gameObject);
}

function getGameObjectsByType(type) {
    return gameObjects.filter(gameObject => gameObject.ot && gameObject.ot == type);
}


function render() {
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
    player._r();
    gameObjects
        .filter(gameObject=>gameObject._r)
        .forEach(gameObject => gameObject._r());
    renderGround();
}

function renderGround() {
    saveContext(ctx);
    translateContext(ctx, camera.x-BASEWIDTH/2, GROUND_HEIGHT);
    let y = 0;
    [5,4,3,1].forEach(lineWidth => {
        beginPath(ctx);
        ctx.lineWidth = lineWidth;
        strokeStyle(ctx, COLOR_WHITE);
        moveTo(ctx, 0, y);
        lineTo(ctx, BASEWIDTH, y);
        stroke(ctx);
        y += lineWidth * 2;
    });
    restoreContext(ctx);
}


function update() {
    let delta = getDelta();
    getGamepadState();
    gameTime += delta;
    
    player._u(delta);
    camera._u(delta);

    // background gradient position
    let maxBgTop = BASEHEIGHT * 9; // the world is 9 screens tall
    let camheight = camera.y - BASEHEIGHT / 2;
    let topPosition = (clamp(maxBgTop + camheight, 0, maxBgTop) / maxBgTop) * -900;
    bgGradientDiv.style.top = topPosition + "vh";

    // collisions
    let lasers = getGameObjectsByType(TYPE_LASER);
    let snakes = getGameObjectsByType(TYPE_SNAKE);
    lasers.forEach(laser => {
        snakes.forEach(snake => {
            if(pointDistance(laser, snake) <= snake.r) {
                laser.ttl = -1
                snake.hp -= 1;
                addGameObject(createParticleDebris(laser.x, laser.y));
                if(snake.hp == 0) {
                    snake.ttl = -1;
                }
            }
        })
    })

    gameObjects.forEach(gameObject => {
        if(gameObject._u) {
            gameObject._u(delta);
        }
    });
    gameObjects = gameObjects.filter(gameObject => gameObject.ttl === undefined || gameObject.ttl > 0);
}




let gameTime = 0;
function gameLoop() {
    update()
    render();
    requestAnimationFrame(gameLoop);
}