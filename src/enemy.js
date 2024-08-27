function createEnemy(x, y, components) {
    let enemy = {
        x:x,
        y:y,
        a:45,
        c:components,
        ttl:Infinity,
        ot:GAMEOBJECT_TYPE_ENEMY,
        r:15, // collission radius
        hp:2
    };
    
    createEnemyImage(enemy);
    enemy._r = () => renderEnemy(enemy);
    enemy._u = (delta) => updateEnemy(delta, enemy);

    return enemy;
}

function updateEnemy(delta, enemy) {
    enemy.a += rand(25,90) * delta;
}

function explodeEnemy(enemy) {
    gameObjects.push(createParticleSmoke(enemy.x + rand(-enemy.r,enemy.r), enemy.y + rand(-enemy.r,enemy.r),3));
    for(let i = 0; i < rand(3,7); i++) {
        addGameObject(createParticleDebris(enemy.x+rand(-enemy.r,enemy.r), enemy.y+rand(-enemy.r,enemy.r)));
    }
}

function createEnemyImage(enemy) {
    enemy.i = createSpriteBuffer(60,60);
    setCurrentContext(enemy.i.ctx);
    saveContext();
    translateContext(enemy.i.w/2, enemy.i.h/2);
    rotateContext(90);
    enemy.c.forEach(points => {
        beginPath();
        fillStyle('#000');
        strokeStyle('#fff');
        moveTo(points[0], points[1]);
        let length = points.length;
        let close = true;
        if(length%2 == 1) {
            close = points[length-1] == 1;
            length--;
        }
        for(let i = 2; i<length-1; i+=2) {
            lineTo(points[i], points[i+1]);
        }
        for(let i = length-2; i>=0; i-=2) {
            lineTo(-points[i], points[i+1]);
        }
        if(close) {
            lineTo(points[0], points[1]);
        }
        setFillModeDelete();
        fill();
        setFillModeFill();
        stroke();
    });
    restoreContext();
    setCurrentContext(ctx);
}

const ENEMY_WING_A = [0,-15, -20,0, -20,10, 0,5];
const ENEMY_WING_B = [0,-5, -20,0, -20,5, 0,5];
const ENEMY_WING_C = [0,-5, -18,0, -20,-8, -20,5, 0,5];
const ENEMY_WING_D = [0,-4, -12,-2, -16,-5, -19,-10, -20,-15, -20,0, -18,3, -14,5, 0,10];
const ENEMY_WING_E = [0,-5, -12,-5, -14,-15, -16,-15, -16,10, -14,10, -12,0, 0,0];

const ENEMY_HULL_A = [-5,-10, -5,-5, -2,0, 0];
const ENEMY_HULL_B = [-5,-10, -5,7, -3,10, -1,12, 0];
const ENEMY_HULL_C = [-5,-10, -5,-5, -2,0, -3,10, -7,12, -7,15,-1,14, 0];

const ENEMY_COCKPIT_A = [-5,-10, -4,-12, -2,-13, -1,-10, 0];
const ENEMY_COCKPIT_B = [-5,-10, -4,-12, -2,-15, -1,-20, 0];
const ENEMY_COCKPIT_C = [-5,-10, -8,-10, -3,-15, -3,-20, -2,-16, 0];

function renderEnemy(enemy) {
    saveContext();
    translateContext(enemy.x, enemy.y);
    rotateContext(enemy.a);
    drawImage(enemy.i.c, -enemy.i.w/2, -enemy.i.h/2);
    /* debug hit area
    beginPath();
    strokeStyle('#ff0')
    circle(0,0,enemy.r);
    stroke();
    */
    restoreContext();
}

