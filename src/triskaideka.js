let triskaidekaLetters = [[38,80,68,15,186,15,160,81],[173,81,197,15,328,16,343,38,332,81,291,81,293,64,217,64,212,80],[351,81,370,15,408,15,391,81],[411,80,422,36,449,15,559,14,581,40,573,79,528,81,528,64,459,64,451,80],[593,80,604,14,640,15,633,79,707,14,759,16,692,81],[798,80,823,15,852,15,871,79],[934,80,934,14,972,15,975,81],[995,80,992,14,1145,15,1171,39,1177,81],[1197,80,1188,16,1303,16,1313,65,1234,66,1236,81],[1336,80,1323,15,1360,15,1376,77,1426,14,1478,15,1437,81],[1543,81,1543,14,1574,14,1616,81],[9,238,63,113,103,112,52,238],[113,238,160,112,320,115,309,145,276,167,284,239,239,240,231,165,182,165,155,238],[306,236,341,114,383,115,350,238],[370,238,386,183,505,183,512,175,506,165,415,166,398,139,402,113,543,115,562,141,551,211,519,238],[567,237,588,114,689,114,738,238,685,239,657,165,620,166,609,237],[744,235,786,114,878,115,914,237,872,238,851,165,809,165,783,238],[936,238,935,114,976,114,979,237],[1001,238,997,113,1037,115,1040,181,1134,182,1147,166,1141,113,1181,114,1194,210,1171,237],[1219,237,1201,113,1292,113,1301,165,1250,166,1253,183,1340,185,1351,236],[1371,236,1345,114,1446,113,1540,237,1489,238,1434,165,1396,166,1413,237],[1548,236,1546,114,1639,115,1721,238,1675,238,1631,166,1588,167,1590,239]];
let triskaidekaOriginX = 856;
let triskaidekaOriginY = 0;

function createTriskaideka(x,y,size = 1) {
    let tris = {x:x, y:y, s:size, ttl:Infinity};
    tris._r = () => renderTriskaideka(tris);
    tris._u = (delta) => {tris.s = size + sin(gameTime) * 0.05;}
    return tris;
}
function renderTriskaideka(tris) {
    let x = tris.x;
    let y = tris.y;
    let size = tris.s;
    saveContext();
    translateContext(x-triskaidekaOriginX * size, y-triskaidekaOriginY * size);
    ctx.lineWidth = 3;
    strokeStyle('#d00');
    fillStyle('#f00');
    triskaidekaLetters.forEach(letter=> {
        beginPath();
        moveTo(letter[0] * size, letter[1] * size);
        for(let i = 2; i < letter.length -1; i+=2) {
            lineTo(letter[i] * size, letter[i+1] * size);
        }
        lineTo(letter[0] * size, letter[1] * size);
        fill();
        stroke();
    });
    ctx.lineWidth = 1;
    fillStyle('#ff8c');
    ctx.font = (70*size) + "px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline  = "bottom";
    ctx.fillText("AAAARGHHHHH!",100*size,0);
    ctx.textAlign = "right";
    ctx.textBaseline  = "top";
    ctx.fillText("ATTACKS!!!",1700*size,250*size);
    restoreContext();
}