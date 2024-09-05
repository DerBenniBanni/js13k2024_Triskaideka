const GROUND_HEIGHT = BASEHEIGHT - 50;

const GAMEOBJECT_TYPE_SNAKE = 1;
const GAMEOBJECT_TYPE_LASER = 2;
const GAMEOBJECT_TYPE_ENEMY = 3;
const GAMEOBJECT_TYPE_BUTTON = 4;
const GAMEOBJECT_TYPE_SQUID = 5;
const GAMEOBJECT_TYPE_TENTACLE = 6;
const GAMEOBJECT_TYPE_ENEMY_BULLET = 7;

const STATE_LOADING = 0;
const STATE_MENU = 1;
const STATE_ACTION = 2;

let gameObjects = [];
let gameState = STATE_MENU;


const GAMEDATA_POINTS = 0;
const GAMEDATA_XP = 1;
const GAMEDATA_SHIP_WEAPON = 2;
const shipWeaponMaxValue = 3;
const GAMEDATA_SHIP_FIRERATE = 3;
const shipFirerateMaxValue = 5; // shots per second
const gameData = {}
gameData[GAMEDATA_POINTS] = 0;
gameData[GAMEDATA_XP] = 0;
gameData[GAMEDATA_SHIP_WEAPON] = 1;
gameData[GAMEDATA_SHIP_FIRERATE] = 1;

const msgDiv = document.querySelector('.msg');
let currentLevel = 0;
const levels = [
    // first level, how it will end....
    {
        e:40, // enemies
        sn:2, // snakes
        sq:2, //squids
        p: { // player modifications
            fr:0.1,
            l:3,
            y:600,
            dy:-2,
            h:1
        },
        hideUpdates: true, // show upgrade-buttons?
        m:"LAUNCH",
        end:"Yep, that's me!\nYou are probably wondering, how I ended up in this situation.\nIt all began 13 days ago, when the first scouts of the aliens now known as 'Triskaideka' entered earths atmosphere.\nThe arrival of them triggered a global mass hysteria:\n\nTRISKAIDEKA-PHOBIA"
            + "\n\nAs my experimental Jet, the A.I.R.W.O.L.F.\n(Advanced Intercept Rocket, Worlds Only and Last hope for Future)\nis the only capable craft to defend earth, so I am now flying countless missions against the intruders."
            + "\n\nBut lets have a look at all the events from the beginning...",
        adv:true // advance level even if failed
    },
    {
        e:5,
        m:"Day 1 - start mission"
    }
]

function addGameObject(gameObject) {
    gameObjects.push(gameObject);
    return gameObject;
}

function getGameObjectsByType(type) {
    return gameObjects.filter(gameObject => gameObject.ot && gameObject.ot == type);
}

const waterCanvas = createSpriteBuffer(BASEWIDTH, BASEHEIGHT);


function render() {
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
    gameObjects
        .filter(gameObject=>gameObject._r)
        .forEach(gameObject => gameObject._r());
    if(gameState == STATE_MENU) {

    } else if(gameState == STATE_ACTION) {
        player._r();
        renderGround();
        let [groundX,groundY] = getCameraView({x:0, y:GROUND_HEIGHT});
        if(groundY < BASEHEIGHT) {
            waterCanvas.ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT); 
            waterCanvas.ctx.save();
            waterCanvas.ctx.scale(1,-1)
            waterCanvas.ctx.drawImage(canvas, 0,0, BASEWIDTH, BASEHEIGHT, 0,BASEHEIGHT-groundY+3, BASEWIDTH,-BASEHEIGHT);
            waterCanvas.ctx.restore();
            ctx.globalAlpha = 0.5;
            ctx.drawImage(waterCanvas.c, 0, groundY, BASEWIDTH, BASEHEIGHT/3);
            ctx.globalAlpha = 1;
        }
    }
}

function renderGround() {
    saveContext();
    translateContext(camera.x-BASEWIDTH/2, GROUND_HEIGHT);
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
    fillStyle('#0056');
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
            menuActionWasReleased = false;
            activeButton.c();
        }
        let downPressed = keyActive(KEY_ACTION_DOWN);
        let upPressed = keyActive(KEY_ACTION_UP);
        if(!menuDirectionWasReleased && !downPressed && !upPressed) {
            menuDirectionWasReleased = true;
        }
        if(activeButton && activeButton.l[DIRECTION_DOWN] && downPressed && menuDirectionWasReleased) {
            activeButton.l[DIRECTION_DOWN].a = true;
            activeButton.a =false;
            menuDirectionWasReleased = false;
        }
        if(activeButton && activeButton.l[DIRECTION_UP] && upPressed && menuDirectionWasReleased) {
            activeButton.l[DIRECTION_UP].a = true;
            activeButton.a =false;
            menuDirectionWasReleased = false;
        }
        
    } else if(gameState == STATE_ACTION) {
        player._u(delta);
        

        // collisions
        let lasers = getGameObjectsByType(GAMEOBJECT_TYPE_LASER);
        let bullets = getGameObjectsByType(GAMEOBJECT_TYPE_ENEMY_BULLET);
        let snakes = getGameObjectsByType(GAMEOBJECT_TYPE_SNAKE);
        let enemies = getGameObjectsByType(GAMEOBJECT_TYPE_ENEMY);
        let squids = getGameObjectsByType(GAMEOBJECT_TYPE_SQUID);
        if(snakes.length + enemies.length + squids.length == 0) {
            loadGameMenu();
            return;
        }
        if(player.alive) {
            enemies.forEach(enemy => {
                let hit = pointDistance(enemy, player) <= enemy.r + player.cr;
                if(hit && player.ct <= 0) {
                    player.h -= 1;
                    enemy.hp -= 1;
                    player.ct = 0.5;
                    cameraShake(0.25);
                    addGameObject(createParticleExplosion((enemy.x + player.x)/2, (enemy.y + player.y)/2, COLOR_RGB_YELLOW));
                }
            });
            bullets.forEach(bullet => {
                let hit = pointDistance(bullet, player) <= bullet.r + player.cr;
                if(hit) {
                    player.h -= 1;
                    cameraShake(0.25);
                    addGameObject(createParticleExplosion((bullet.x + player.x)/2, (bullet.y + player.y)/2, COLOR_RGB_YELLOW));
                    bullet.ttl = 0;
                }
            });
            snakes.forEach(snake => {
                let hit = pointDistance(player, snake) <= snake.r + player.cr;
                let currentSegment = snake;
                while(currentSegment.c && !hit) {
                    currentSegment = currentSegment.c;
                    hit = pointDistance(player, currentSegment) <= currentSegment.r + player.cr;
                }
                if(hit && player.ct <= 0) {
                    player.h -= 1;
                    snake.hp -= 1;
                    player.ct = 0.5;
                    cameraShake(0.25);
                    addGameObject(createParticleExplosion((currentSegment.x + player.x)/2, (currentSegment.y + player.y)/2, COLOR_RGB_YELLOW));
                }
            });
            squids.forEach(squid => {
                let { hit, currentSegment } = squidCollision(player,  player.cr, squid);
                if(hit && player.ct <= 0) {
                    player.h -= 1;
                    squid.hp -= 1;
                    player.ct = 0.5;
                    cameraShake(0.25);
                    addGameObject(createParticleExplosion((currentSegment.x + player.x)/2, (currentSegment.y + player.y)/2, COLOR_RGB_YELLOW));
                }
            })
        }
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
            squids.forEach(squid => {
                let { hit, currentSegment } = squidCollision(laser,  2, squid);
                if(hit) {
                    laser.ttl = -1
                    squid.hp -= 1;
                    for(let i = 0; i < rand(2,4); i++) {
                        addGameObject(createParticleDebris(laser.x, laser.y));
                    }
                    playAudio(AUDIO_SFX_HIT);
                }
            })
        });

        let actionPressed = getGamepadButtonPressed(GAMEPAD_A) || keyActive(KEY_ACTION_FIRE);
        if(!player.alive && player.lf >0 && actionPressed) {
            if(levels[currentLevel].adv) {
                currentLevel++;
            }
            loadGameMenu();
        } else if(player.alive && snakes.length + enemies.length + squids.length == 0) {
            if(player.lf >0 && actionPressed) {
                currentLevel++;
                loadGameMenu();
            }
        }
    }

    gameObjects.forEach(gameObject => {
        if(gameObject._u) {
            gameObject._u(delta);
        }
    });
    gameObjects = gameObjects.filter(gameObject => gameObject.ttl === undefined || gameObject.ttl > 0);
}




let gameTime = 0;
function squidCollision(gameObject, collisionRadius, squid) {
    let currentSegment = squid;
    let hit = pointDistance(gameObject, squid) <= squid.s + collisionRadius;
    if (!hit) {
        for (let tentacle of squid.t) {
            hit = pointDistance(gameObject, tentacle) <= tentacle.r + collisionRadius;
            currentSegment = tentacle;
            while (currentSegment.c && !hit) {
                currentSegment = currentSegment.c;
                hit = pointDistance(gameObject, currentSegment) <= currentSegment.r + collisionRadius;
            }
            if (hit) {
                break;
            }
        }
    }
    return { hit, currentSegment };
}

function gameLoop() {
    update()
    render();
    requestAnimationFrame(gameLoop);
}

function clearObjects() {
    gameObjects = [];
}

let menuActionWasReleased = false;
let menuDirectionWasReleased = false;
function loadGameMenu() {
    msgDiv.classList.add('hidden');
    menuActionWasReleased = false;
    menuDirectionWasReleased = false;
    clearObjects();
    camera.x = BASEWIDTH/2;
    camera.y = BASEHEIGHT/2;
    camera.t = null;
    gameState = STATE_MENU;
    addGameObject(createTriskaideka(BASEWIDTH/2,70, 0.8));
    let level = levels[currentLevel];

    let btnStartMission = addGameObject(createButton(BASEWIDTH/2,450,300,40,level.m, true, loadGameAction));
    if(!level.hideUpdates) {
        let btnUpgradeLaser = addGameObject(createButton(BASEWIDTH/2,570,350,40,"ADD LASERS", false, upgradeLaser));
        btnUpgradeLaser._u = (delta) => {btnUpgradeLaser.t = "UPGRADE LASER (" + (gameData[GAMEDATA_SHIP_WEAPON] == shipWeaponMaxValue ? "MAX" : gameData[GAMEDATA_SHIP_WEAPON]) + ")"}
        let btnUpgradeFireRate = addGameObject(createButton(BASEWIDTH/2,620,350,40,"ENHANCE FIRE RATE", false, upgradeFireRate));
        btnUpgradeFireRate._u = (delta) => {btnUpgradeFireRate.t = "ENHANCE FIRE RATE (" + (gameData[GAMEDATA_SHIP_FIRERATE] == shipFirerateMaxValue ? "MAX" : gameData[GAMEDATA_SHIP_FIRERATE]) + ")"}
        linkButtons(btnStartMission, btnUpgradeLaser, DIRECTION_DOWN);
        linkButtons(btnUpgradeLaser, btnUpgradeFireRate, DIRECTION_DOWN);
    }
}

function upgradeLaser() {
    if(gameData[GAMEDATA_SHIP_WEAPON] < shipWeaponMaxValue) {
        gameData[GAMEDATA_SHIP_WEAPON] += 1;
    }
}

function upgradeFireRate() {
    if(gameData[GAMEDATA_SHIP_FIRERATE] < shipFirerateMaxValue) {
        gameData[GAMEDATA_SHIP_FIRERATE] += 1;
    }
}


let player = null;

function loadGameAction() {
    msgDiv.classList.add('hidden');
    let level = levels[currentLevel];
    msgDiv.innerText = level.end;
    clearObjects();
    gameState = STATE_ACTION;
    player = createPlayer(BASEWIDTH/2,GROUND_HEIGHT-3, -90);
    for(let val in level.p) {
        player[val] = level.p[val];
    }

    
    for(let i = 0; i < 50; i++) {
        addGameObject(createParticleDust(rand(0, BASEWIDTH),rand(0, BASEHEIGHT)));
    }

    for(let i = 0; i < level.e; i++) {
        let wing = getRandomEntry([ENEMY_WING_A, ENEMY_WING_B, ENEMY_WING_C, ENEMY_WING_D, ENEMY_WING_E]);
        let hull = getRandomEntry([ENEMY_HULL_A, ENEMY_HULL_B, ENEMY_HULL_C]);
        let cockpit = getRandomEntry([ENEMY_COCKPIT_A, ENEMY_COCKPIT_B, ENEMY_COCKPIT_C]);
        addGameObject(createEnemy(rand(-BASEWIDTH, BASEWIDTH*2), rand(-BASEHEIGHT*2,0),[wing, hull, cockpit]));
    }

    for(let i = 0; i < level.sn; i++) {
        let x = player.x + (randInt(0,1) == 0 ? -1 : 1)*(200 + rand(0, BASEWIDTH))
        let y = player.y - rand(0, BASEHEIGHT);
        addGameObject(createSnake(x, y, randInt(13,33), randInt(13,33), rand(20,40)));
    }


    for(let i = 0; i < level.sq; i++) {
        let x = player.x + (randInt(0,1) == 0 ? -1 : 1)*(300 + rand(0, BASEWIDTH))
        let y = player.y - rand(0, BASEHEIGHT);
        addGameObject(createSquid(x, y, rand(60,100)));
    }
    /*
    [ENEMY_WING_A, ENEMY_WING_B, ENEMY_WING_C, ENEMY_WING_D, ENEMY_WING_E].forEach((wing,i) => {
        let x = 100 + i*50;
        [ENEMY_HULL_A, ENEMY_HULL_B, ENEMY_HULL_C].forEach((hull,j) => {
            let y = 200 + j*150;
            [ENEMY_COCKPIT_A, ENEMY_COCKPIT_B, ENEMY_COCKPIT_C].forEach((cockpit, k) => {
                let y1 = y + k*50;
                //addGameObject(createEnemy(x,y1,[wing, hull, cockpit]));
                addGameObject(createEnemy(rand(-BASEWIDTH, BASEWIDTH*2), rand(-BASEHEIGHT*2,0),[wing, hull, cockpit]));
            });
        });
    });
    */


    playAudio(AUDIO_SONG_AIRWOLF);
}