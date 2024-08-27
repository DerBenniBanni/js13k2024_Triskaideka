const GROUND_HEIGHT = BASEHEIGHT - 50;

const GAMEOBJECT_TYPE_SNAKE = 1;
const GAMEOBJECT_TYPE_LASER = 2;
const GAMEOBJECT_TYPE_ENEMY = 3;


function addGameObject(gameObject) {
    gameObjects.push(gameObject);
}

function getGameObjectsByType(type) {
    return gameObjects.filter(gameObject => gameObject.ot && gameObject.ot == type);
}


function render() {
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
    gameObjects
        .filter(gameObject=>gameObject._r)
        .forEach(gameObject => gameObject._r());
    player._r();
    renderGround();
}

function renderGround() {
    saveContext();
    translateContext(camera.x-BASEWIDTH/2, GROUND_HEIGHT);
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
    fillStyle('#ccf6');
    fillRect(0,0,BASEWIDTH, BASEHEIGHT);
    let y = 0;
    [5,4,3,1].forEach(lineWidth => {
        beginPath();
        ctx.lineWidth = lineWidth;
        strokeStyle(COLOR_WHITE);
        moveTo(0, y);
        lineTo(BASEWIDTH, y);
        stroke();
        y += lineWidth * 2;
    });
    restoreContext();
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
    let lasers = getGameObjectsByType(GAMEOBJECT_TYPE_LASER);
    let snakes = getGameObjectsByType(GAMEOBJECT_TYPE_SNAKE);
    let enemies = getGameObjectsByType(GAMEOBJECT_TYPE_ENEMY);
    lasers.forEach(laser => {
        snakes.forEach(snake => {
             //TODO: check every chain of the snake
            if(pointDistance(laser, snake) <= snake.r) {
                laser.ttl = -1
                snake.hp -= 1;
                for(let i = 0; i < rand(3,7); i++) {
                    addGameObject(createParticleDebris(laser.x, laser.y));
                }
                playAudio(AUDIO_SFX_HIT);
                if(snake.hp == 0) {
                    snake.ttl = -1;
                    explodeSnake(snake);
                    playAudio(AUDIO_SFX_EXPLOSION);
                }
            }
        });
        enemies.forEach(enemy => {
            if(pointDistance(laser, enemy) <= enemy.r) {
                laser.ttl = -1
                enemy.hp -= 1;
                for(let i = 0; i < rand(2,5); i++) {
                    addGameObject(createParticleDebris(laser.x, laser.y));
                }
                playAudio(AUDIO_SFX_HIT);
                if(enemy.hp == 0) {
                    enemy.ttl = -1;
                    explodeEnemy(enemy);
                    playAudio(AUDIO_SFX_EXPLOSION);
                }
            }
        });
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