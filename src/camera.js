const camera = {
    // camera looks at middle of the screen
    x:BASEWIDTH/2,
    y:BASEHEIGHT/2,
    bb:{ // boundingbox
        l:0,
        r:BASEWIDTH,
        t:0,
        b:BASEHEIGHT
    },
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
        //boundingbox
        cam.bb.l = cam.x-BASEWIDTH/2;
        cam.bb.r = cam.x+BASEWIDTH/2;
        cam.bb.t = cam.y-BASEHEIGHT/2;
        cam.bb.b = cam.y+BASEHEIGHT/2;
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

function isInView(gameObject, buffer) {
    return gameObject.x >= camera.bb.l - buffer
        && gameObject.x <= camera.bb.r + buffer
        && gameObject.y >= camera.bb.t - buffer
        && gameObject.y <= camera.bb.b + buffer;
}

function getCameraView(point) {
    return [
        point.x - camera.x + BASEWIDTH/2 + camera.ex,
        point.y - camera.y + BASEHEIGHT/2 + camera.ey
    ];
}

function cameraShake(duration) {
    camera.et = duration;
}