let gameObjects = [];

let player = createPlayer(BASEWIDTH/2,GROUND_HEIGHT-3, -90);

addGameObject(createSnake(400,200, 20, 13, 20));
addGameObject(createSnake(600,600, 15, 26, 30));
addGameObject(createSnake(1900,400, 30, 20, 25));

//addGameObject(createEnemy(500,300,[ENEMY_WING_A, ENEMY_HULL_A, ENEMY_COCKPIT_A]));

[ENEMY_WING_A, ENEMY_WING_B, ENEMY_WING_C, ENEMY_WING_D, ENEMY_WING_E].forEach((wing,i) => {
    let x = 100 + i*50;
    [ENEMY_HULL_A, ENEMY_HULL_B, ENEMY_HULL_C].forEach((hull,j) => {
        let y = 200 + j*150;
        [ENEMY_COCKPIT_A, ENEMY_COCKPIT_B, ENEMY_COCKPIT_C].forEach((cockpit, k) => {
            let y1 = y + k*50;
            addGameObject(createEnemy(x,y1,[wing, hull, cockpit]));
        });
    });
});

for(let i = 0; i < 50; i++) {
    addGameObject(createParticleDust(rand(0, BASEWIDTH),rand(0, BASEHEIGHT)));
}


// document.addEventListener("click", ()=>playAudio(AUDIO_SONG_AIRWOLF, false));






getDelta();
gameLoop();


