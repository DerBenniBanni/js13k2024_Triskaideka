const SQUID_TYPE_NORMAL = 8;
const SQUID_TYPE_ROTATING = 9;

function createSquid(x,y, size, type = SQUID_TYPE_NORMAL) {
    let squid = {
        x:x, 
        y:y, 
        s:size, 
        ot:GAMEOBJECT_TYPE_SQUID,
        t:[],
        hp:20,
        st:type
    };
    squid._r = () => renderSquid(squid);
    squid._u = (delta) => updateSquid(squid, delta);
    if(type == SQUID_TYPE_NORMAL) {
        squid.t.push(createTentacle(squid, x,y+size/2,size/4,18, 30,150));
        squid.t.push(createTentacle(squid, x-size/2,y+size/3,size/4,15, 40,180));
        squid.t.push(createTentacle(squid, x+size/2,y+size/3,size/4,15, 0,140));
    } else if(type == SQUID_TYPE_ROTATING) {
        squid.t.push(createRotatingTentacle(squid, x,y+size/2,size/4,18, 120, 70));
        squid.t.push(createRotatingTentacle(squid, x,y-size/2,size/4,18, 240, 70));
        squid.t.push(createRotatingTentacle(squid, x,y-size/2,size/4,18, 360, 70));
        squid.t.push(createRotatingTentacle(squid, x,y+size/2,size/4,18, 120, -50));
        squid.t.push(createRotatingTentacle(squid, x,y-size/2,size/4,18, 240, -50));
        squid.t.push(createRotatingTentacle(squid, x,y-size/2,size/4,18, 360, -50));
        squid.t.forEach(t=>t.ma = 10);
        squid.hp = 30;
    }
    return squid;
}

function createTentacle(squid, x,y,size,segments, minAngle, maxAngle) {
    let tentacle = createSnake(x,y,size,segments,0,GAMEOBJECT_TYPE_TENTACLE);
    tentacle.a = 90;
    tentacle.aMin = minAngle;
    tentacle.aMax = maxAngle;
    tentacle.da = 90; // rotation per second
    tentacle.ma = 5; // max segment angle
    tentacle._u(0);
    tentacle.tt = SQUID_TYPE_NORMAL;
    tentacle.sq = squid;
    return tentacle
}

function createRotatingTentacle(squid, x,y,size, segments, angle, speed) {
    let tentacle = createSnake(x,y,size,segments,0,GAMEOBJECT_TYPE_TENTACLE);
    tentacle.a = angle;
    tentacle.da = speed; // rotation per second
    tentacle.tt = SQUID_TYPE_ROTATING;
    tentacle.sq = squid;
    return tentacle;
}

function renderSquid(squid) {
    if(!isInView(squid, squid.s)) {
        renderHudMarker(squid,4);
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
        if(t.tt == SQUID_TYPE_NORMAL) {
            t.x += moveVector.x,
            t.y += moveVector.y;
        
            t.a += t.da*delta;
            if(t.a < t.aMin || t.a > t.aMax) {
                t.da *= -1;
                t.a += 20*t.da * delta;
            }
        } else if(t.tt == SQUID_TYPE_ROTATING) {
            t.a += t.da*delta;
            let tentaclePositionVector = addPoints(createAngleVector(t.a, t.sq.s*0.9), t.sq);
            t.x = tentaclePositionVector.x;
            t.y = tentaclePositionVector.y;
        }
        t._u(delta);
    });
       
    if(squid.hp <= 0) {
        if(respawns > 0) {
            respawns--;
            let xdiff = rand(0,1) >= 0.5 ? BASEWIDTH: -BASEWIDTH
            addGameObject(createSquid(squid.x + xdiff, squid.y - BASEHEIGHT/4, squid.s, squid.st));
        } 
        squid.ttl = -1;
        squid.t.forEach(t => {
            t.ot = GAMEOBJECT_TYPE_SNAKE;
            t.x += rand(-squid.s, squid.s);
            t.y += rand(-squid.s, squid.s);
            t.a = rand(0,360);
            t.inited = true;
            t.s = rand(100,180);
            t.sq = null;
            addGameObject(t);
        });
        explodeSquid(squid);
    }
}

function explodeSquid(squid) {
    playAudio(AUDIO_SFX_EXPLOSION);
    for(let i = 0; i < rand(20,30); i++) {
        addGameObject(createParticleDebris(squid.x+rand(-squid.s,squid.s), squid.y+rand(-squid.s,squid.s)));
    }
    for(let i = 0; i < rand(8,12); i++) {
        addGameObject(createParticleSmoke(squid.x + rand(-squid.s,squid.s), squid.y + rand(-squid.s,squid.s), rand(2,5)));
    }
    countKill(squid.st);
}