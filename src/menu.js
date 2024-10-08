function createButton(x,y,w,h,text,active,click) {
    let btn = {
        x,y,w,h,t:text,c:click,
        ot:GAMEOBJECT_TYPE_BUTTON,
        a:active,
        l:{} // navigationlinks (directions)
    };
    btn._r = ()=>renderButton(btn);
    return btn;
}

function createText(x,y,text, size = 30) {
    let textObject = {
        x,y,t:text, s:size
    };
    textObject._r = ()=>renderText(textObject);
    return textObject;
}

const DIRECTION_DOWN = 1;
const DIRECTION_UP = -1;

function linkButtons(buttonFrom, buttonTo, direction) {
    buttonFrom.l[direction] = buttonTo;
    buttonTo.l[-direction] = buttonFrom;
}

function renderButton(btn) {
    saveContext();
    translateContext(btn.x - btn.w/2, btn.y - btn.h/2);
    strokeStyle(COLOR_WHITE);
    if(btn.a) {
        ctx.lineWidth = 5;
        fillStyle('#ffa6');
        fillRect(0,0,btn.w, btn.h);
    } else {
        ctx.lineWidth = 1;
    }
    rect(0,0,btn.w, btn.h);
    fillStyle(COLOR_WHITE);
    let ts = btn.ts || 24;
    ctx.font = ts + 'px sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText(btn.t, btn.w/2, btn.h/2);
    restoreContext();
}

function renderText(text) {
    saveContext();
    translateContext(text.x, text.y);
    fillStyle(COLOR_WHITE);
    ctx.font = text.s + 'px sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText(text.t, 0, 0);
    restoreContext();
}