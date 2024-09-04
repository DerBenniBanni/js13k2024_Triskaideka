const keyboardStates = {};
window.addEventListener("keydown", (ev)=>keyboardStates[ev.code] = true);
window.addEventListener("keyup", (ev)=>keyboardStates[ev.code] = false);

const KEY_ACTION_LEFT = ["ArrowLeft", "KeyA"];
const KEY_ACTION_RIGHT = ["ArrowRight", "KeyD"];
const KEY_ACTION_UP = ["ArrowUp", "KeyW"];
const KEY_ACTION_DOWN = ["ArrowDown", "KeyS"];
const KEY_ACTION_FIRE = ["Space", "ControlLeft", "ControlRight", "Enter","NumpadEnter"];

function keyActive(keyAction) {
    return keyAction.find(keycode => keyboardStates[keycode]) != undefined;
}
