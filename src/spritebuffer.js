
function createSpriteBuffer(w,h) {
    let buffercanvas = document.createElement("canvas");
    buffercanvas.width = w;
    buffercanvas.height = h;
    let buffer = {
        c:buffercanvas,
        w:w,
        h:h,
        ctx:buffercanvas.getContext('2d')
    }
    return buffer;
}
