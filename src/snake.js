const TYPE_SNAKE = 1;
function createSnake(x, y, headsize, segments, speed) {
    let headPoint = createSnakeSegment(x,y, headsize);
    headPoint.ot = TYPE_SNAKE;
    headPoint.hp = 10;
    headPoint._r = () => renderSnake(headPoint);
    // gamepad control? 
    // headPoint._u = (delta) => updateSnake(headPoint, STICK_RIGHT_HORIZONTAL, STICK_RIGHT_VERTICAL, delta);
    headPoint._u = (delta) => updateSnake(headPoint, delta, speed || 50);
    let currentpoint = headPoint;
    for(let i = 1; i <= segments; i++) {
        let size = headsize - i*(headsize/segments);
        currentpoint = chainPoint(currentpoint, createSnakeSegment(x-400,y-i*headsize, size), size);
    }
    // target point spin speed
    headPoint.tSpin = rand(30,60) * (randInt(0,1) == 1 ? 1 : -1);

    gameObjects.push(headPoint);
    return headPoint;
}

function createSnakeSegment(x, y, radius) {
    let segment = createCircle(x, y, radius);
    segment.a = 0;
    return segment;
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

function renderSnake(head) {
    saveContext(ctx);
    translateContext(ctx, head.x, head.y);
    let pointsRight = [];
    let pointsLeft = [];
    let currentpoint = head;
    let isHead = true;
    while(currentpoint.c) {
        let x = currentpoint.x-head.x;
        let y = currentpoint.y-head.y;
        /*
        beginPath(ctx);
        strokeStyle(ctx,'#fff');
        circle(ctx, x, y, currentpoint.r);
        stroke(ctx);
        */

        // debug segment angle
        /*
        let v = createStandardVector(currentpoint.a+180);
        beginPath(ctx);
        moveTo(ctx, x,y);
        lineTo(ctx, x+v.x*currentpoint.r, y + v.y*currentpoint.r);
        stroke(ctx);
        */
        
        if(isHead) {
            [[180,1],[170,1.5],[160,1],[150,1.5],[140,1],[130,1.5],[120,1],[110,1.5]].forEach(d => {
                pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,d[0],d[1]));
                pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-d[0],d[1]));
            });
        }
        pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,90));
        pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-90))
        /*
        beginPath(ctx);
        circle(ctx, x+v.x*currentpoint.r, y + v.y*currentpoint.r, 3);
        stroke(ctx);
        */
        currentpoint = currentpoint.c;
        isHead = false;
    }
    beginPath(ctx);
    strokeStyle(ctx,COLOR_WHITE);
    let points = [...pointsRight, ...pointsLeft];
    points.forEach((p, i) => {
        if(i == 0) {
            moveTo(ctx, p.x, p.y);
        } else {
            lineTo(ctx, p.x, p.y);
        }
    });
    stroke(ctx);
    restoreContext(ctx);
}

function calculateCirclePointAtAngle(x, y, currentpoint, angle, radiusMultiplier = 1) {
    let r = currentpoint.r * radiusMultiplier; 
    let v = createStandardVector(currentpoint.a + angle);
    return createPoint(x+v.x*r, y + v.y*r);
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