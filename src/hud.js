const HUD_RADIUS = 350 ;
const HUD_SPACING = 20;
const HUD_BARS = 20;
const HUD_BASE_COLOR = '#afa5';
const HUD_INDICATOR_COLOR = '#cfc7';
const HUD_INDICATOR_DANGER_COLOR = '#f00a';
const HUD_DANGER_COLOR = '#fa07';
const HUD_SCORE_COLOR = '#ff0';
function drawHUD() {
    saveContext()
        currentCtx.translate(-2 * camera.ex,-2*camera.ey);
        beginPath();
        strokeStyle(HUD_BASE_COLOR);
        circle(BASEWIDTH/2, BASEHEIGHT/2, HUD_RADIUS);
        stroke();
        // height indicator
        beginPath();
        strokeStyle(HUD_BASE_COLOR);
        rect(BASEWIDTH/2 + HUD_RADIUS + HUD_SPACING, BASEHEIGHT/2 - HUD_RADIUS, HUD_BARS, 2*HUD_RADIUS);
        stroke();
        fillStyle(HUD_DANGER_COLOR);
        fillRect(BASEWIDTH/2 + HUD_RADIUS + HUD_SPACING, BASEHEIGHT/2 - HUD_RADIUS, HUD_BARS, 0.3*HUD_RADIUS);
        saveContext()
            currentCtx.translate(BASEWIDTH/2 + HUD_RADIUS, BASEHEIGHT/2 - HUD_RADIUS);
            rotateContext(90);
            currentCtx.font = '20px sans-serif';
            currentCtx.fillText("DANGER", 0, 0);
            fillStyle(HUD_BASE_COLOR);
            currentCtx.fillText("HEIGHT", 0, -45);
        restoreContext();

        let indicatorY = abs(2*HUD_RADIUS * ((player.y-GROUND_HEIGHT)/-PLAYER_MAX_HEIGHT));
        if(indicatorY > 2*HUD_RADIUS) {
            fillStyle(HUD_INDICATOR_DANGER_COLOR);
            currentCtx.font = '30px sans-serif';
            currentCtx.textAlign = "center";
            currentCtx.textBaseline  = "middle";
            currentCtx.fillText("ALTITUDE! ENGINE FROZEN!", BASEWIDTH/2, BASEHEIGHT/2-150);
        } 
        indicatorY = clamp(indicatorY, 0, 2*HUD_RADIUS);
        fillStyle(indicatorY > 1.9*HUD_RADIUS ? HUD_INDICATOR_DANGER_COLOR : HUD_INDICATOR_COLOR);
        fillRect(BASEWIDTH/2 + HUD_RADIUS + HUD_SPACING - 5, BASEHEIGHT/2 + HUD_RADIUS - indicatorY, HUD_BARS + 10, 4);

        if(indicatorY )
        // health indicator
        beginPath();
        strokeStyle(HUD_BASE_COLOR);
        rect(BASEWIDTH/2 - HUD_RADIUS - HUD_SPACING - HUD_BARS, BASEHEIGHT/2 - HUD_RADIUS, HUD_BARS, 2*HUD_RADIUS);
        stroke();
        fillStyle(HUD_INDICATOR_COLOR);
        let healthbarHeight = 2*HUD_RADIUS * (player.h / player.mh);
        if(healthbarHeight < 0) {
            healthbarHeight = 0;
        }
        fillRect(BASEWIDTH/2 - HUD_RADIUS - HUD_SPACING - HUD_BARS, BASEHEIGHT/2 + HUD_RADIUS - healthbarHeight, HUD_BARS, healthbarHeight);

        saveContext()
            currentCtx.translate(BASEWIDTH/2 - HUD_RADIUS, BASEHEIGHT/2 + HUD_RADIUS);
            rotateContext(-90);
            currentCtx.font = '20px sans-serif';
            fillStyle(HUD_BASE_COLOR);
            currentCtx.fillText("SHIELD STATUS", 0, -45);
        restoreContext();

        if(levels[currentLevel].count) {
            fillStyle(HUD_SCORE_COLOR);
            currentCtx.font = '40px sans-serif';
            currentCtx.textAlign = "center";
            currentCtx.textBaseline  = "middle";
            currentCtx.fillText("Triskaidekageddon-Score: " + killCount.p, BASEWIDTH/2, 40);
        }

    restoreContext();
}

function renderHudMarker(obj, size = 1) {
    let p = getStandardVector(pointDifferenceVector(player, obj), 350);
    fillStyle('#f00a');
    saveContext();
    currentCtx.translate(BASEWIDTH/2 + p.x, BASEHEIGHT/2 + p.y);
    rotateContext(getVectorAngleDegrees(p));
    beginPath();
    moveTo(-4*size, -4*size);
    lineTo(4*size, 0*size);
    lineTo(-4*size, 4*size);
    fill();
    restoreContext();
}