function createParticle(x, y, dx, dy, ttl, renderMethod) {
    let particle = {x,y,dx,dy,ttl};
    particle.ittl = ttl; // initial ttl
    if(renderMethod) {
        particle._r = () => {
            saveContext(ctx);
            translateContext(ctx, particle.x, particle.y);
            renderMethod(particle);
            restoreContext(ctx);
        }
    }
    particle._u = (delta) => updateParticle(particle, delta);
    return particle;
}

function updateParticle(particle, delta) {
    particle.x += particle.dx * delta;
    particle.y += particle.dy * delta;
    particle.ttl -= delta;
}

function createParticleExhaust(x, y, dx, dy, ttl) {
    let particle = createParticle(x, y, dx, dy, ttl, renderParticleExhaust);
    particle.r = 10;
    return particle;
}

function createParticleLaser(x, y, dx, dy, ttl) {
    let particle = createParticle(x, y, dx, dy, ttl, renderParticleLaser);
    particle.r = 3;
    return particle;
}

function createParticleDust(x,y) {
    let particle = createParticle(x, y, 0, 0, Infinity, renderParticleDust);
    particle.a = rand(0,360);
    return particle;
}


function renderParticleExhaust(particle) {
    beginPath(ctx);
    strokeStyle(ctx,'#fa03');
    circle(ctx, 0, 0, particle.r * (particle.ttl/ particle.ittl));
    stroke(ctx);
}

function renderParticleLaser(particle) {
    beginPath(ctx);
    strokeStyle(ctx,'#ff0a');
    circle(ctx, 0, 0, particle.r);
    stroke(ctx);
}

function renderParticleDust(particle) {
    rotateContext(ctx, particle.a);
    beginPath(ctx);
    strokeStyle(ctx,'#fffa');
    moveTo(ctx,-2,0);
    lineTo(ctx,2,0);
    stroke(ctx);
}