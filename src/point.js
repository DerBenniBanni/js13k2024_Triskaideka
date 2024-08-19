/**
 * create a new point
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @returns 
 */
function createPoint (x,y){
    return {x,y}
};

/**
 * creates a Point with radius
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @param {number} r the radius
 * @returns 
 */
function createCircle (x,y,r) {
    return {x,y,r}
}

/**
 * creates a new Point as difference vector from p1 to p2
 * @param {Point} p1 
 * @param {Point} p2 
 * @returns Point the diff-vector
 */
function pointDifferenceVector(p1, p2) {
    return createPoint(p2.x - p1.x, p2.y - p1.y);
}

/**
 * calculates the length of a vector (Point)
 * @param {Point} v 
 * @returns length as number
 */
function vectorLength(v) {
    return sqrt(v.x*v.x + v.y*v.y);
}

/**
 * calculate the distance between two points
 * @param {Point} p 
 * @param {Point} p2 
 * @returns distance as number
 */
function pointDistance(p1, p2) {
    return vectorLength(pointDifferenceVector(p1, p2));
}

/**
 * multiplies the parts of the vector with the given factor
 * @param {Point} v the Vector
 * @param {number} factor the mutliplicator
 * @returns the new Vector/Point
 */
function multiplyVector(v, factor) {
    return createPoint(v.x * factor, v.y*factor);
}

/**
 * adds the given points
 * @param {Point} p 
 * @param {Point} p2 
 * @returns the sum-point
 */
function addPoints(p, p2) {
    return createPoint(p.x + p2.x, p.y + p2.y);
}


function getVectorAngle(v) {
    return Math.atan2(v.y, v.x);
}

function getVectorAngleDegrees(v) {
    return toDeg(getVectorAngle(v));
}

function createStandardVector(angleDegrees) {
    let a = toRad(angleDegrees);
    return {x:cos(a), y:sin(a)};
}

function getStandardVector(vector) {
    let length = vectorLength(vector);
    return multiplyVector(vector, 1/length);
}

function sumVectors(v1, v2) {
    return {
        x:v1.x + v2.x,
        y:v1.y + v2.y
    };
}


//const fixChainDistances = ()
/*

class P {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new P(this.x, this.y);
    }
    add(x,y) {
        return new P(this.x+x, this.y+y);
    }
    addP(p) {
        return this.add(p.x, p.y);
    }
    diffP(p) {
        return new P(this.x-p.x, this.y-p.y);
    }
    div(divisor) {
        return new P(this.x/divisor, this.y/divisor);
    }
    multi(factor) {
        return new P(this.x*factor, this.y*factor);
    }
    rotate(angle) {
        return new P(this.x * cos(angle) - this.y * sin(angle), this.x * sin(angle) + this.y * cos(angle));
    }
    dist(p) {
        let x = this.x - p.x;
        let y = this.y - p.y;
        return Math.sqrt(x*x + y*y);
    }
}
const hexToInt = (h) => parseInt('0x' + h);
const intToHex = (d) => (d <=15 ? "0" : "") + Number(d).toString(16);

*/