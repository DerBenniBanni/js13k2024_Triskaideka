const GROUND_HEIGHT = BASEHEIGHT - 50;

const GAMEOBJECT_TYPE_SNAKE = 1;
const GAMEOBJECT_TYPE_LASER = 2;
const GAMEOBJECT_TYPE_ENEMY = 3;
const GAMEOBJECT_TYPE_BUTTON = 4;

const STATE_LOADING = 0;
const STATE_MENU = 1;
const STATE_ACTION = 2;

let gameObjects = [];
let gameState = STATE_MENU;


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
    if(gameState == STATE_MENU) {

    } else if(gameState == STATE_ACTION) {
        player._r();
        renderGround();
    }
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
    camera._u(delta);

    // background gradient position
    let maxBgTop = BASEHEIGHT * 9; // the world is 9 screens tall
    let camheight = camera.y - BASEHEIGHT / 2;
    let topPosition = (clamp(maxBgTop + camheight, 0, maxBgTop) / maxBgTop) * -900;
    bgGradientDiv.style.top = topPosition + "vh";
    if(gameState == STATE_MENU) {
        let buttons = getGameObjectsByType(GAMEOBJECT_TYPE_BUTTON);
        let activeButton = buttons.find(b=>b.a);
        let actionPressed = getGamepadButtonPressed(GAMEPAD_A) || keyActive(KEY_ACTION_FIRE);
        if(!menuActionWasReleased && !actionPressed) {
            menuActionWasReleased = true;
        }
        if(activeButton && menuActionWasReleased && actionPressed) {
            activeButton.c();
        }
    } else if(gameState == STATE_ACTION) {
        player._u(delta);
        

        // collisions
        let lasers = getGameObjectsByType(GAMEOBJECT_TYPE_LASER);
        let snakes = getGameObjectsByType(GAMEOBJECT_TYPE_SNAKE);
        let enemies = getGameObjectsByType(GAMEOBJECT_TYPE_ENEMY);
        if(snakes.length + enemies.length == 0) {
            loadGameMenu();
            return;
        }
        enemies.forEach(enemy => {
            let hit = pointDistance(enemy, player) <= enemy.r + player.cr;
            if(hit && player.ct <= 0) {
                player.h -= 1;
                enemy.hp -= 1;
                player.ct = 0.5;
                cameraShake(0.25);
                addGameObject(createParticleExplosion((enemy.x + player.x)/2, (enemy.y + player.y)/2, COLOR_RGB_YELLOW))
            }
        })
        lasers.forEach(laser => {
            snakes.forEach(snake => {
                if(laser.ttl < 0) {
                    return;
                }
                let hit = pointDistance(laser, snake) <= snake.r;
                let currentSegment = snake;
                while(currentSegment.c && !hit) {
                    currentSegment = currentSegment.c;
                    hit = pointDistance(laser, currentSegment) <= currentSegment.r;
                }
                if(hit) {
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
                    for(let i = 0; i < rand(2,4); i++) {
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
        });
    }

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

function clearObjects() {
    gameObjects = [];
}

let menuActionWasReleased = false;
function loadGameMenu() {
    menuActionWasReleased = false;
    clearObjects();
    camera.x = BASEWIDTH/2;
    camera.y = BASEHEIGHT/2;
    camera.t = null;
    gameState = STATE_MENU;
    addGameObject(createTriskaideka(BASEWIDTH/2,70, 0.8));
    addGameObject(createButton(BASEWIDTH/2,500,300,40,"START MISSION",loadGameAction));
}
let player = null;

function loadGameAction() {
    clearObjects();
    gameState = STATE_ACTION;
    player = createPlayer(BASEWIDTH/2,GROUND_HEIGHT-3, -90);

    for(let i = 0; i < 50; i++) {
        addGameObject(createParticleDust(rand(0, BASEWIDTH),rand(0, BASEHEIGHT)));
    }
    
    addGameObject(createSnake(400,200, 20, 13, 20));
    addGameObject(createSnake(600,600, 15, 26, 30));
    addGameObject(createSnake(1900,400, 30, 20, 25));

    [ENEMY_WING_A, ENEMY_WING_B, ENEMY_WING_C, ENEMY_WING_D, ENEMY_WING_E].forEach((wing,i) => {
        let x = 100 + i*50;
        [ENEMY_HULL_A, ENEMY_HULL_B, ENEMY_HULL_C].forEach((hull,j) => {
            let y = 200 + j*150;
            [ENEMY_COCKPIT_A, ENEMY_COCKPIT_B, ENEMY_COCKPIT_C].forEach((cockpit, k) => {
                let y1 = y + k*50;
                addGameObject(createEnemy(x,y1,[wing, hull, cockpit]));
            });
        });
    });
}