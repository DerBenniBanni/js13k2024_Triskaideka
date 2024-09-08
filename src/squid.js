
function createSquid(x,y, size) {
    let squid = {
        x:x, 
        y:y, 
        s:size, 
        ot:GAMEOBJECT_TYPE_SQUID,
        t:[],
        hp:20
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
    if(!isInView(squid, squid.s)) {
        let p = getStandardVector(pointDifferenceVector(player, squid), 350);
        fillStyle('#f00a');
        beginPath();
        circle(BASEWIDTH/2 + p.x, BASEHEIGHT/2 + p.y, 10);
        fill();
    }
    if(isInView(squid, squid.s*2)) {
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
}

function updateSquid(squid, delta) {
    let targetPoint = createPoint(player.x, player.y);
    let targetVector = pointDifferenceVector(squid, targetPoint)
    let targetAngle = getVectorAngleDegrees(targetVector) + 720;
    squid.ta = targetAngle;
    let moveVector = getStandardVector(targetVector, 50*delta);
    squid.x += moveVector.x,
    squid.y += moveVector.y;
    squid.t.forEach(t => {
        t.x += moveVector.x,
        t.y += moveVector.y;
    
        t.a += t.da*delta;
        if(t.a < t.aMin || t.a > t.aMax) {
            t.da *= -1;
            t.a += 20*t.da * delta;
        }
        t._u(delta);
    });
       
    if(squid.hp <= 0) {
        if(respawns > 0) {
            respawns--;
            squid.y -= BASEHEIGHT/2;
            let xdiff = rand(0,1) >= 0.5 ? BASEWIDTH: -BASEWIDTH
            squid.x += xdiff;
            squid.t.forEach(t => {
                t.y -= BASEHEIGHT/2;
                t.x += xdiff;
            });
            squid.hp = 20;
        } else {
            squid.ttl = -1;
            squid.t.forEach(t => {
                t.ot = GAMEOBJECT_TYPE_SNAKE;
                addGameObject(t);
            });
        }
        explodeSquid(squid);
    }
}

function explodeSquid(squid) {

}