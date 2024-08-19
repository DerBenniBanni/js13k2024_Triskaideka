let gameObjects = [];

let player = createPlayer(BASEWIDTH/2,GROUND_HEIGHT-3, -90);

addGameObject(createSnake(400,200, 20, 13, 20));
addGameObject(createSnake(1500,100, 15, 26, 30));
addGameObject(createSnake(1900,400, 30, 20, 40));
for(let i = 0; i < 200; i++) {
    addGameObject(createParticleDust(rand(-BASEWIDTH*4, BASEWIDTH),rand(-BASEHEIGHT*4, BASEHEIGHT*4)));
}





getDelta();
gameLoop();


