function createParticle(x, y, dx, dy, ttl, renderMethod, updateMethod) {
    let particle = {x,y,dx,dy,ttl};
    particle.ittl = ttl; // initial ttl
    particle.s = 1; // splashcount
    if(renderMethod) {
        particle._r = () => {
            saveContext(ctx);
            translateContext(ctx, particle.x, particle.y);
            renderMethod(particle);
            restoreContext(ctx);
        }
    }
    updateMethod = updateMethod ? updateMethod : updateParticle;
    particle._u = (delta) => updateMethod(particle, delta);
    return particle;
}

function updateParticle(particle, delta) {
    if(particle.g) {
        particle.dy += particle.g * delta;
    }
    particle.x += particle.dx * delta;
    particle.y += particle.dy * delta;
    particle.ttl -= delta;
}

function updateParticleHitGround(particle, delta, withSplash) {
    updateParticle(particle, delta);
    if(particle.y > GROUND_HEIGHT) {
        particle.ttl = -1;
        if(withSplash) {
            for(let i = 0; i < particle.s; i++) {
                addGameObject(createParticleSplash(particle.x, particle.y));
            }
        }
    }
}

function updateParticleHitGroundSplash(particle, delta) {
    updateParticleHitGround(particle, delta, true);
}

function createParticleExhaust(x, y, dx, dy, ttl) {
    let particle = createParticle(x, y, dx, dy, ttl, renderParticleExhaust, updateParticleHitGroundSplash);
    particle.r = 10;
    return particle;
}

function createParticleSplash(x, y) {
    let particle = createParticle(x, y, rand(-30,30), rand(-300,-250), 2, renderParticleSplash, updateParticleHitGround);
    particle.r = 5;
    particle.g = 500;
    return particle;
}

const TYPE_LASER = 2;
function createParticleLaser(x, y, dx, dy, ttl) {
    let particle = createParticle(x, y, dx, dy, ttl, renderParticleLaser, updateParticleHitGroundSplash);
    particle.r = 3;
    particle.ot = TYPE_LASER;
    let l = vectorLength({x:dx, y:dy});
    particle.v = createPoint(dx/l, dy/l);
    particle.s = 5;
    return particle;
}

function createParticleDust(x,y) {
    let particle = createParticle(x, y, 0, 0, Infinity, renderParticleDust);
    particle.a = rand(0,360);
    return particle;
}

function createParticleDebris(x,y) {
    let particle = createParticle(x, y, rand(-5,5), rand(-5,10), Infinity, renderParticleDust, updateParticleHitGroundSplash);
    particle.a = rand(0,360);
    particle.g = 500;
    return particle;
}


function renderParticleExhaust(particle) {
    beginPath(ctx);
    fillStyle(ctx,'#fa01');
    circle(ctx, 0, 0, particle.r * (particle.ttl/ particle.ittl));
    fill(ctx);
}

function renderParticleSplash(particle) {
    beginPath(ctx);
    fillStyle(ctx, '#fff6');
    //circle(ctx, 0, 0, particle.r * (particle.ttl/ particle.ittl));
    fillRect(ctx, -particle.r/2, 0, particle.r, GROUND_HEIGHT - particle.y);
    stroke(ctx);
}

function renderParticleLaser(particle) {
    fillStyle(ctx,'#ff0a');
    [0,5,10,15].forEach(offset => {
        beginPath(ctx);
        circle(ctx, -offset*particle.v.x, -offset*particle.v.y, particle.r);
        fill(ctx);
    });
}

function renderParticleDust(particle) {
    rotateContext(ctx, particle.a);
    beginPath(ctx);
    strokeStyle(ctx,'#fffa');
    moveTo(ctx,-2,0);
    lineTo(ctx,2,0);
    stroke(ctx);
}