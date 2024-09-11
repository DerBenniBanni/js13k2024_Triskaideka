
function createSnake(x, y, headsize, segments, speed, ot = GAMEOBJECT_TYPE_SNAKE ) {
    let headPoint = createSnakeSegment(x,y, headsize);
    headPoint.ot = ot;
    headPoint.ma = 25; // max Angle for Segments
    headPoint.hp = 10;
    headPoint.s = speed;
    headPoint._r = () => renderSnake(headPoint);
    // gamepad control? 
    // headPoint._u = (delta) => updateSnake(headPoint, STICK_RIGHT_HORIZONTAL, STICK_RIGHT_VERTICAL, delta);
    headPoint._u = (delta) => updateSnake(headPoint, delta);
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

function updateSnake(head, delta) {
    if(head.ot == GAMEOBJECT_TYPE_SNAKE) {
        let targetPoint = createPoint(player.x, player.y);
        let targetVector = pointDifferenceVector(head, targetPoint);
        let targetAngle = getVectorAngleDegrees(targetVector) + 720;
        head.ta = targetAngle;
        if(head.inited) {
            let headAngle = head.a-180;
            let diffAngle = (targetAngle - headAngle + 180) % 360 - 180;
            let turnspeed = head.s; // angle per second == speed
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

        let targetStandardVector = createAngleVector(head.a-180, head.s * delta); 
        head.x += targetStandardVector.x;
        head.y += targetStandardVector.y;
    }
    fixChainDistances(head, head.ma);
}



function renderSnake(head) {
    if(!isInView(head, head.r) && !head.sq) {
        renderHudMarker(head, 3);
    }
    let tail = head;
    while(tail.c) {
        tail = tail.c;
    }
    if(isInView(head,head.r) || isInView(tail, head.r)) {
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
            circle(x, y, currentpoint.r);
            fill();
            setFillModeFill();
            
            if(isHead && head.ot == GAMEOBJECT_TYPE_SNAKE) {
                [[180,1],[170,2],[160,1],[150,1.5],[140,1],[130,1.2]].forEach(d => {
                    pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,d[0],d[1]));
                    pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-d[0],d[1]));
                });
            }
            pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,90));
            pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-90));
            if(counter % 2 == 0 ) {
                let factor = counter == 2 && head.ot == GAMEOBJECT_TYPE_SNAKE ? 2 : 1;
                [[70,1.5],[65,1.1]].forEach(d=>{
                    pointsLeft.unshift(calculateCirclePointAtAngle(x,y,currentpoint,d[0],d[1]*factor));
                    pointsRight.push(calculateCirclePointAtAngle(x,y,currentpoint,-d[0],d[1]*factor));
                });

            }

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
