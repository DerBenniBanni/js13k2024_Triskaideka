// defines the rendersize of the canvases
const BASEWIDTH = 1920;
const BASEHEIGHT = 900;

// Game states (not used, yet...)
const STATE_LOADING = 1;
const STATE_MENU = 2;
const STATE_GAME_RUNNING = 3;
const STATE_GAME_FINISHED = 4;

const COLOR_WHITE = '#fff';

//Math-related shortcuts
const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const abs = (value) => Math.abs(value);
const toRad = (deg) => deg * (PI / 180);
const toDeg = (rad) => rad / (PI / 180);
const round = Math.round;
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => round(rand(min, max));


const samePosition = (p1, p2, delta) => abs(p1.x - p2.x) < delta && abs(p1.y - p2.y) < delta;

// handle Canvas sizes, generate 2d-contexts
const initCanvas = (id) => {
    let canvasElement = document.querySelector('#' + id);
    canvasElement.width = BASEWIDTH; 
    canvasElement.height = BASEHEIGHT;
    return [canvasElement,canvasElement.getContext("2d")];
}
const [canvas, ctx] =  initCanvas('gameCanvas');
const [bgCanvas, bgCtx] =  initCanvas('bgCanvas');

// delta-time for updates
let lastUpdate = Date.now();
function getDelta() {
    let now = Date.now();
    let delta = clamp((now - lastUpdate) / 1000, 0, 0.1);
    lastUpdate = now;
    return delta;
}

// canvas-specific method-shortcuts for better minification of the code
const translateContext = (context, x, y) => {
    let  [tx,ty] = getCameraView({x,y});
    context.translate(tx,ty);
}
const rotateContext = (context, angleDegrees) => context.rotate(toRad(angleDegrees));
const saveContext = (context) => context.save();
const restoreContext = (context) => context.restore();
const strokeStyle = (context, color) => context.strokeStyle = color;
const fillStyle = (context, color) => context.fillStyle = color;
const beginPath = (context) => context.beginPath();
const moveTo = (context,x,y) => context.moveTo(x,y);
const lineTo = (context,x,y) => context.lineTo(x,y);
const stroke = (context) => context.stroke();
const fill = (context) => context.fill();
const fillRect = (context,x,y,w,h) => context.fillRect(x,y,w,h);

const circle = (context, x, y, r) => context.arc(x, y, r, 0, PI*2);
