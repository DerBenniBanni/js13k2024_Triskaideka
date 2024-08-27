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
const sign = Math.sign;
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
const bgGradientDiv = document.querySelector('#bg > div');

let currentCtx = ctx;

// delta-time for updates
let lastUpdate = Date.now();
function getDelta() {
    let now = Date.now();
    let delta = clamp((now - lastUpdate) / 1000, 0, 0.1);
    lastUpdate = now;
    return delta;
}

// canvas-specific method-shortcuts for better minification of the code
function setCurrentContext(context) {
    currentCtx = context;
}
function translateContext(x, y) {
    let [tx,ty] = getCameraView({x,y});
    currentCtx.translate(tx,ty);
}
const rotateContext = (angleDegrees) => currentCtx.rotate(toRad(angleDegrees));
const saveContext = () => currentCtx.save();
const restoreContext = () => currentCtx.restore();
const strokeStyle = (color) => currentCtx.strokeStyle = color;
const fillStyle = (color) => currentCtx.fillStyle = color;
const beginPath = () => currentCtx.beginPath();
const moveTo = (x,y) => currentCtx.moveTo(x,y);
const lineTo = (x,y) => currentCtx.lineTo(x,y);
const stroke = () => currentCtx.stroke();
const fill = () => currentCtx.fill();
const fillRect = (x,y,w,h) => currentCtx.fillRect(x,y,w,h);
const drawImage = (source,x,y) => currentCtx.drawImage(source,x,y);
const setFillModeDelete = () => currentCtx.globalCompositeOperation = "destination-out";
const setFillModeFill = () => currentCtx.globalCompositeOperation = "source-over";

const circle = (x, y, r) => currentCtx.arc(x, y, r, 0, PI*2);
const ellipse = (x, y, rx, ry, rot, start, end) => currentCtx.ellipse(x, y, rx, ry, rot, start, end);
