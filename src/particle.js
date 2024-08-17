function createParticle(x, y, dx, dy, ttl, renderMethod) {
    let particle = {x,y,dx,dy,ttl};
    particle.ittl = ttl; // initial ttl
    if(renderMethod) {
        particle._r = () => renderMethod(particle);
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


function renderParticleExhaust(particle) {
    beginPath(ctx);
    strokeStyle(ctx,'#fa03');
    circle(ctx, particle.x, particle.y, particle.r * (particle.ttl/ particle.ittl));
    stroke(ctx);
}

function renderParticleLaser(particle) {
    beginPath(ctx);
    strokeStyle(ctx,'#ff0a');
    circle(ctx, particle.x, particle.y, particle.r);
    stroke(ctx);
}