


function addGameObject(gameObject) {
    gameObjects.push(gameObject);
}


function render() {
    ctx.clearRect(0,0,BASEWIDTH, BASEHEIGHT);
    player._r();
    gameObjects
        .filter(gameObject=>gameObject._r)
        .forEach(gameObject => gameObject._r());
}


function update() {
    let delta = getDelta();
    getGamepadState();
    gameTime += delta;
    
    player._u(delta);
    camera._u(delta);

    let maxBgTop = BASEHEIGHT * 9; // the world is 9 screens tall
    let camheight = camera.y - BASEHEIGHT / 2;
    let topPosition = (clamp(maxBgTop + camheight, 0, maxBgTop) / maxBgTop) * -900;
    //console.log(topPosition + "vh");
    bgGradientDiv.style.top = topPosition + "vh";


    gameObjects.forEach(gameObject => {
        if(gameObject._u) {
            gameObject._u(delta);
        }
    });
    gameObjects = gameObjects.filter(gameObject => gameObject.ttl === undefined || gameObject.ttl > 0);
}
