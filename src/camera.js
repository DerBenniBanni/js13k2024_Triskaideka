const camera = {
    // camera looks at middle of the screen
    x:BASEWIDTH/2,
    y:BASEHEIGHT/2,
    dx:0,
    dy:0,
    // effects (Screenshake)
    ex:0,
    ey:0,
    et:0,
    // target to look at
    t:null,
    _u:() => {}
}
camera._u = (delta) => updateCamera(camera, delta);

function updateCamera(cam, delta) {
    if(cam.t) {
        let aimVector = {
            x:cam.t.x - cam.x, 
            y:cam.t.y - cam.y
        };
        let speed = vectorLength({x:cam.t.p.dx, y: cam.t.p.dy})
        cam.dx =aimVector.x * speed;
        cam.dy =aimVector.y * speed;
        cam.x += cam.dx * delta;
        cam.y += cam.dy * delta;
    }
    if(cam.et > 0) {
        cam.et -= delta;
        cam.ex = clamp(cam.ex + rand(-5,5),-10,10);
        cam.ey = clamp(cam.ey + rand(-5,5),-10,10);
    } else {
        cam.ex = 0;
        cam.ey = 0;
    }
}

function getCameraView(point) {
    return [
        point.x - camera.x + BASEWIDTH/2 + camera.ex,
        point.y - camera.y + BASEHEIGHT/2 + camera.ey
    ];
}