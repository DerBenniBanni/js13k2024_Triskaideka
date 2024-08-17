


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
    gameObjects.forEach(gameObject => {
        if(gameObject._u) {
            gameObject._u(delta);
        }
    });
    gameObjects = gameObjects.filter(gameObject => gameObject.ttl === undefined || gameObject.ttl > 0);
}
