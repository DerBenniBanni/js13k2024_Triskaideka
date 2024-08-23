let gameObjects = [];

let player = createPlayer(BASEWIDTH/2,GROUND_HEIGHT-3, -90);

addGameObject(createSnake(400,200, 20, 13, 20));
addGameObject(createSnake(600,600, 15, 26, 30));
addGameObject(createSnake(1900,400, 30, 20, 25));


for(let i = 0; i < 50; i++) {
    addGameObject(createParticleDust(rand(0, BASEWIDTH),rand(0, BASEHEIGHT)));
}






getDelta();
gameLoop();


