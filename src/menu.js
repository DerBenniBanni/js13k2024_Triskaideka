function createButton(x,y,w,h,text,click) {
    let btn = {
        x,y,w,h,t:text,c:click,
        ot:GAMEOBJECT_TYPE_BUTTON,
        a:true // active
    };
    btn._r = ()=>renderButton(btn);
    return btn;
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
    ctx.font = '24px sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText(btn.t, btn.w/2, btn.h/2);
    restoreContext();
}