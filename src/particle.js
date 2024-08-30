function createParticle(x, y, dx, dy, ttl, renderMethod, updateMethod) {
    let particle = {x,y,dx,dy,ttl};
    particle.ittl = ttl; // initial ttl
    particle.s = 1; // splashcount
    particle.sf = 1; // splashforce multiplier
    if(renderMethod) {
        particle._r = () => {
            saveContext();
            translateContext(particle.x, particle.y);
            renderMethod(particle);
            restoreContext();
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
                addGameObject(createParticleSplash(particle.x+rand(-10,10), particle.y, particle.sf));
            }
        }
    }
}

function updateParticleHitGroundSplash(particle, delta) {
    updateParticleHitGround(particle, delta, true);
}

function updateParticleSplash(particle, delta) {
    particle.w += particle.dw * delta;
    updateParticleHitGround(particle, delta, false);
}

function createParticleExhaust(x, y, dx, dy, ttl) {
    let particle = createParticle(x, y, dx, dy, ttl, renderParticleExhaust, updateParticleHitGroundSplash);
    particle.r = 10;
    particle.sf = 0.7;
    return particle;
}

function createParticleSplash(x, y, force = 1) {
    let particle = createParticle(x, y, rand(-30,30), rand(-400,-200) * force, 2, renderParticleSplash, updateParticleSplash);
    particle.w = 1;
    particle.dw = 40; // horizontal size change rate (pixel per second)
    particle.g = 500;
    return particle;
}

function createParticleLaser(x, y, dx, dy, ttl) {
    let particle = createParticle(x, y, dx, dy, ttl, renderParticleLaser, updateParticleHitGroundSplash);
    particle.r = 3;
    particle.ot = GAMEOBJECT_TYPE_LASER;
    let l = vectorLength({x:dx, y:dy});
    particle.v = createPoint(dx/l, dy/l);
    particle.s = 5;
    return particle;
}

function createParticleDust(x,y) {
    let particle = createParticle(x, y, 0, 0, Infinity, renderParticleDust, updateParticleDust);
    particle.a = rand(0,360);
    particle.l = 1;
    return particle;
}

function updateParticleDust(particle) {
    if(particle.x < camera.x - BASEWIDTH/2) {
        particle.x = camera.x + BASEWIDTH/2;
    }
    if(particle.x > camera.x + BASEWIDTH/2) {
        particle.x = camera.x - BASEWIDTH/2;
    }
    if(particle.y < camera.y - BASEHEIGHT/2) {
        particle.y = camera.y + BASEHEIGHT/2;
    }
    if(particle.y > camera.y + BASEHEIGHT/2) {
        particle.y = camera.y - BASEHEIGHT/2;
    }
    particle.a = player.dva;
    particle.l = 1+player.dvl;
}

function createParticleSmoke(x,y,ttlModifier = 1) {
    let particle = createParticle(x, y, rand(-5,5), rand(-50,-15), rand(1,2) * ttlModifier, renderParticleSmoke);
    particle.r = rand(5,10);
    particle.c = '50,50,40';
    return particle;
}

function createParticleExplosion(x,y,rgb,ttlModifier = 1) {
    let particle = createParticle(x, y, 0, 0, 1 * ttlModifier, renderParticleSmoke, updateParticleExplosion);
    particle.r = rand(20,30);
    particle.c = rgb;
    return particle;
}

function updateParticleExplosion(particle, delta) {
    particle.r += particle.r * 3 * delta;
    particle.ttl -= delta;
}

function createParticleDebris(x,y, xMultiplyer = 1, yModifier = 0) {
    let particle = createParticle(x, y, rand(-50,50) * xMultiplyer, rand(-150,10) + yModifier, 2, renderParticleDust, updateParticleHitGroundSplash);
    particle.a = rand(0,360);
    particle.g = 500;
    particle.l = rand(3,6);
    return particle;
}

function renderParticleSmoke(particle) {
    beginPath();
    let alpha = particle.ttl/ particle.ittl;
    fillStyle('rgba(' + particle.c + ','+alpha+')');
    circle(0, 0, particle.r * (particle.ittl - particle.ttl/ particle.ittl));
    fill();
}

function renderParticleExhaust(particle) {
    beginPath();
    fillStyle('#fa01');
    circle(0, 0, particle.r * (particle.ttl/ particle.ittl));
    fill();
}

function renderParticleSplash(particle) {
    beginPath();
    fillStyle('#fff3');
    //circle(0, 0, particle.r * (particle.ttl/ particle.ittl));
    //fillRect(-particle.w/2, 0, particle.w, GROUND_HEIGHT - particle.y);
    let r = particle.r * (particle.ttl/ particle.ittl);
    ellipse(0, GROUND_HEIGHT - particle.y, particle.w, clamp(GROUND_HEIGHT - particle.y,0,500),0,PI,2*PI);
    fill();
}

function renderParticleLaser(particle) {
    fillStyle('#ff0a');
    [0,5,10,15].forEach(offset => {
        beginPath();
        circle(-offset*particle.v.x, -offset*particle.v.y, particle.r);
        fill();
    });
}

function renderParticleDust(particle) {
    rotateContext(particle.a);
    beginPath();
    strokeStyle('#fffa');
    moveTo(-particle.l,0);
    lineTo(particle.l,0);
    stroke();
}