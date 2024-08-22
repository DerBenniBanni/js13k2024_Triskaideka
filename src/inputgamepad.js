let inputGamepadIndex = -1;
const inputGamepadButtons = [];
const inputGamepadAxes = [];
const gamepadMappingStandard = "standard";
window.addEventListener("gamepadconnected", (ev) => {
    if(ev.gamepad.mapping == gamepadMappingStandard) {
        inputGamepadIndex = ev.gamepad.index
    }
});
window.addEventListener("gamepaddisconnected", (ev) => {
    inputGamepadIndex = -1
    navigator.getGamepads().find(gamepad => gamepad.mapping == gamepadMappingStandard)
});

const STICK_LEFT_HORIZONTAL = 0;
const STICK_LEFT_VERTICAL = 1;
const STICK_RIGHT_HORIZONTAL = 2;
const STICK_RIGHT_VERTICAL = 3;

const GAMEPAD_A = 0;
const GAMEPAD_B = 1;
const GAMEPAD_X = 2;
const GAMEPAD_Y = 3;

function gamepadConnected() {
    return inputGamepadIndex >= 0;
}
function getGamepadState() {
    if(gamepadConnected()) {
        let inputGamepad = navigator.getGamepads()[inputGamepadIndex];
        inputGamepad.buttons.forEach((btn,i) => {
            inputGamepadButtons[i] = btn.pressed;
        });
        inputGamepad.axes.forEach((axe, i) => {
            inputGamepadAxes[i] = axe;
        });
    }
}
function getGamepadStickValue(index) {
    if(gamepadConnected()) {
        return inputGamepadAxes[index];
    }
    return 0;
}
function getGamepadStickVector(xIndex, yIndex) {
    return createPoint(getGamepadStickValue(xIndex), getGamepadStickValue(yIndex));
}

function getGamepadButtonPressed(index) {
    if(gamepadConnected()) {
        return inputGamepadButtons[index];
    }
    return false;
}
