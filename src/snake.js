
function createSnake(x, y, headsize, segments, speed, ot = GAMEOBJECT_TYPE_SNAKE ) {
    let headPoint = createSnakeSegment(x,y, headsize);
    headPoint.ot = ot;
    headPoint.ma = 25; // max Angle for Segments
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

    return headPoint;
}

function createSnakeSegment(x, y, radius) {
    let segment = createCircle(x, y, radius);
    segment.a = 0;
    return segment;
}

function updateSnake(head, delta, speed) {
    if(head.ot == GAMEOBJECT_TYPE_SNAKE) {
        let targetPoint = createPoint(player.x, player.y);
        let targetVector = pointDifferenceVector(head, targetPoint)
        let targetAngle = getVectorAngleDegrees(targetVector) + 720;
        head.ta = targetAngle;
        if(head.inited) {
            let headAngle = head.a-180;
            let diffAngle = (targetAngle - headAngle + 180) % 360 - 180;
            let turnspeed = speed; // angel per second
            let maxTurn = turnspeed * delta;
            if(diffAngle < 0) {
                head.a -= maxTurn;
            } else if(diffAngle > 0) {
                head.a += maxTurn;
            }
        } else {
            head.a = targetAngle+180;
            head.inited = true;
        }
        // normalize angle
        head.a = normalizeAngle(head.a);

        let targetStandardVector = createAngleVector(head.a-180, speed * delta); 
        head.x += targetStandardVector.x;
        head.y += targetStandardVector.y;
    }
    fixChainDistances(head, head.ma);
}



function renderSnake(head) {
    saveContext();
    translateContext(head.x, head.y);
    let pointsRight = [];
    let pointsLeft = [];
    let currentpoint = head;
    let isHead = true;
    let counter = 0;
    while(currentpoint.c) {
        let x = currentpoint.x-head.x;
        let y = currentpoint.y-head.y;
        
        setFillModeDelete();
        beginPath();
        fillStyle(COLOR_BLACK);
        //strokeStyle(COLOR_BLACK);
        circle(x, y, currentpoint.r);
        fill();
        //stroke();
        setFillModeFill();

        // debug segment angle
        /*
        let v = createAngleVector(currentpoint.a+180);
        beginPath();
        strokeStyle('#ff0');
        moveTo(x,y);
        lineTo(x+v.x*currentpoint.r, y + v.y*currentpoint.r);
        stroke();
        /**/
        
        if(isHead && head.ot == GAMEOBJECT_TYPE_SNAKE) {
            [[180,1],[170,2],[160,1],[150,1.5],[140,1],[130,1.2]].forEach(d => {
                pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,d[0],d[1]));
                pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-d[0],d[1]));
            });
        }
        pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,90));
        pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-90));
        if(counter % 2 == 0 ) {
            [[70,1.5],[70,1]].forEach(d=>{
                pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,d[0],d[1]));
                pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-d[0],d[1]));
            });

        }
        /*
        beginPath();
        circle(x+v.x*currentpoint.r, y + v.y*currentpoint.r, 3);
        stroke();
        /**/
        currentpoint = currentpoint.c;
        isHead = false;
        counter++;
    }
    beginPath();
    strokeStyle(COLOR_WHITE);
    let points = [...pointsRight, ...pointsLeft];
    points.forEach((p, i) => {
        if(i == 0) {
            moveTo(p.x, p.y);
        } else {
            lineTo(p.x, p.y);
        }
    });
    stroke();
    if(head.ot == GAMEOBJECT_TYPE_SNAKE) {
        let eyeRadius = head.r/4;
        let pupilRadius = eyeRadius/2;
        [90,-90].forEach(a => {
            let eyePoint = calculateCirclePointAtAngle(0,0,head,a, .7);
            renderEye(eyePoint.x, eyePoint.y, eyeRadius, pupilRadius, head.ta);
        });
    }
    
    restoreContext();
}

function renderEye(x, y, eyeRadius, pupilRadius, targetEyeAngle) {
    let targetEyeVector = createAngleVector(targetEyeAngle, eyeRadius-pupilRadius);
    beginPath();
    fillStyle(COLOR_WHITE);
    circle(x, y, eyeRadius);
    fill();
    beginPath();
    fillStyle(COLOR_BLACK);
    circle(x+targetEyeVector.x, y+targetEyeVector.y, pupilRadius);
    fill();
}


function calculateCirclePointAtAngle(x, y, currentpoint, angle, radiusMultiplier = 1) {
    let r = currentpoint.r * radiusMultiplier; 
    let v = createAngleVector(currentpoint.a + angle);
    return createPoint(x+v.x*r, y + v.y*r);
}

function explodeSnake(head) {
    let currentpoint = head;
    while(currentpoint.c) {
        gameObjects.push(createParticleSmoke(currentpoint.x + rand(-currentpoint.r,currentpoint.r), currentpoint.y + rand(-currentpoint.r,currentpoint.r),3));
        for(let i = 0; i < rand(3,7); i++) {
            addGameObject(createParticleDebris(currentpoint.x+rand(-currentpoint.r,currentpoint.r), currentpoint.y+rand(-currentpoint.r,currentpoint.r)));
        }
        currentpoint = currentpoint.c;
    }
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

function createSquid(x,y, size) {
    let squid = {
        x:x, 
        y:y, 
        s:size, 
        ot:GAMEOBJECT_TYPE_SQUID,
        t:[]
    };
    squid._r = () => renderSquid(squid);
    squid._u = (delta) => updateSquid(squid, delta);

    squid.t.push(createTentacle(x,y+size/2,size/4,18, 30,150));
    squid.t.push(createTentacle(x-size/2,y+size/3,size/4,15, 40,180));
    squid.t.push(createTentacle(x+size/2,y+size/3,size/4,15, 0,140));
    return squid;
}

function createTentacle(x,y,size,segments, minAngle, maxAngle) {
    let tentacle = createSnake(x,y,size,segments,0,GAMEOBJECT_TYPE_TENTACLE);
    tentacle.a = 90;
    tentacle.aMin = minAngle;
    tentacle.aMax = maxAngle;
    tentacle.da = 90;
    tentacle.ma = 5; // max segment angle
    tentacle._u(0);
    return tentacle
}

function renderSquid(squid) {
    saveContext();
    translateContext(squid.x, squid.y);
    beginPath();
    strokeStyle(COLOR_WHITE);
    circle(0,0,squid.s);
    stroke();
    restoreContext();
    squid.t.forEach(t => t._r());
    saveContext();
    setFillModeDelete();
    translateContext(squid.x, squid.y);
    beginPath();
    fillStyle(COLOR_WHITE);
    circle(0,0,squid.s-2);
    fill();
    setFillModeFill();

    renderEye(0, -squid.s/2, squid.s/3, squid.s/6, squid.ta);
    renderEye(squid.s/2, squid.s/4, squid.s/5, squid.s/9, squid.ta);
    renderEye(-squid.s/2, squid.s/4, squid.s/5, squid.s/9, squid.ta);
    restoreContext();
}

function updateSquid(squid, delta) {
    let targetPoint = createPoint(player.x, player.y);
    let targetVector = pointDifferenceVector(squid, targetPoint)
    let targetAngle = getVectorAngleDegrees(targetVector) + 720;
    squid.ta = targetAngle;
    squid.t.forEach(t => {
        t.a += t.da*delta;
        if(t.a < t.aMin || t.a > t.aMax) {
            t.da *= -1;
            t.a += 20*t.da * delta;
        }
        t._u(delta);
    });
}