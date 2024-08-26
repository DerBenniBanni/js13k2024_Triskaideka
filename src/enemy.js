function createEnemy(x, y, components) {
    let enemy = {
        x:x,
        y:y,
        a:0,
        c:components,
        ttl:Infinity
    };
    enemy._r = () => renderEnemy(enemy);

    return enemy;
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
    saveContext(ctx);
    translateContext(ctx, enemy.x, enemy.y);
    rotateContext(ctx, enemy.a+90);
    enemy.c.forEach(points => {
        beginPath(ctx);
        fillStyle(ctx, '#000');
        strokeStyle(ctx, '#fff');
        moveTo(ctx, points[0], points[1]);
        let length = points.length;
        let close = true;
        if(length%2 == 1) {
            close = points[length-1] == 1;
            length--;
        }
        for(let i = 2; i<length-1; i+=2) {
            lineTo(ctx, points[i], points[i+1]);
        }
        for(let i = length-2; i>=0; i-=2) {
            lineTo(ctx, -points[i], points[i+1]);
        }
        if(close) {
            lineTo(ctx, points[0], points[1]);
        }
        setFillModeDelete(ctx);
        fill(ctx);
        setFillModeFill(ctx);
        stroke(ctx);
    });
    restoreContext(ctx);
}

