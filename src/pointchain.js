/**
 * adds a child-point to the given parent-point
 * @param {Point} parentPoint the parent point
 * @param {Point} childPoint the child point
 * @param {number} distance the distance constraint
 * @returns the child point
 */
function chainPoint (parentPoint, childPoint, distance) {
    parentPoint.c = childPoint;
    parentPoint.d = distance;
    childPoint.p = parentPoint;
    childPoint.pd = distance;
    if(!parentPoint.p) {
        parentPoint._r = ()=>renderChain(parentPoint);
    }
    return childPoint;
}


/**
 * fix the distances between the chain points (rekursive parent to child)
 * @param {Point} point the partenpoint to start with 
 */
function fixChainDistances(point) {
    if(point.c) {
        let child = point.c;
        let distanceVector = pointDifferenceVector(point, child);
        let dist = vectorLength(distanceVector);
        if(abs(dist - point.d) > 0.5) {
            let v2 = multiplyVector(distanceVector, point.d / dist);
            let newchildPos = addPoints(point, v2)
            child.x = newchildPos.x;
            child.y = newchildPos.y;
        }
        fixChainDistances(child);
    }
}


function renderChain(head) {
    let currentpoint = head;
    while(currentpoint.c) {
        beginPath(ctx);
        strokeStyle(ctx,'#fff');
        circle(ctx, currentpoint.x, currentpoint.y, currentpoint.r);
        stroke(ctx);
        currentpoint = currentpoint.c;
    }
}