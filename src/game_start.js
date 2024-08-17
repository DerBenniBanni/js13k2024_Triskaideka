let gameObjects = [];

let player = createPlayer(800,450, -90);

addGameObject(createSnake());
for(let i = 0; i < 200; i++) {
    addGameObject(createParticleDust(rand(-BASEWIDTH*4, BASEWIDTH),rand(-BASEHEIGHT*4, BASEHEIGHT*4)));
}

let gameTime = 0;


function loop() {
    update()
    render();
    requestAnimationFrame(loop);
}

getDelta();
loop();


