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
    if(!parentPoint.p && !parentPoint._r) {
        parentPoint._r = ()=> renderChain(parentPoint);
    }
    return childPoint;
}


/**
 * fix the distances between the chain points (rekursive parent to child)
 * @param {Point} point the partenpoint to start with 
 */
function fixChainDistances(point, maxAngle = 180) {
    if(point.c) {
        let child = point.c;
        let distanceVector = pointDifferenceVector(point, child);
        let dist = vectorLength(distanceVector);
        if(abs(dist - point.d) > 0.5) {
            let v2 = multiplyVector(distanceVector, point.d / dist);
            child.a = getVectorAngleDegrees(v2);

            let newchildPos = addPoints(point, v2)
            child.x = newchildPos.x;
            child.y = newchildPos.y;
        }
        fixChainDistances(child);
    }
    /* TODO: max Angle for bends 
     
    if(point.c) {
        let child = point.c;
        let distanceVector = pointDifferenceVector(point, child);
        let dist = vectorLength(distanceVector);
        if(abs(dist - point.d) > 0.5) {
            let v2 = multiplyVector(distanceVector, point.d / dist);
            let angle = getVectorAngleDegrees(v2); //clamp(getVectorAngleDegrees(v2), -maxAngle-point.a, maxAngle-point.a);
            let angleDifference = point.a - angle;

            console.log(point.a, angle, angleDifference);
            if(abs(angleDifference) > maxAngle) {
                angle += Math.sign(angleDifference) * (abs(angleDifference) - maxAngle);;
            }
            child.a = angle;
            if(!point.p) {
                //point.a = child.a;
            }
            let v3 = createAngleVector(angle, point.d);
            console.log(point, v3)
            let newchildPos = addPoints(point, v3);
            child.x = newchildPos.x;
            child.y = newchildPos.y;
        }
        fixChainDistances(child, maxAngle);
    } 
     
    */
}


function renderChain(head) {
    saveContext(ctx);
    translateContext(ctx, head.x, head.y);
    let currentpoint = head;
    while(currentpoint.c) {
        beginPath(ctx);
        strokeStyle(ctx,'#fff');
        circle(ctx, currentpoint.x-head.x, currentpoint.y-head.y, currentpoint.r);
        stroke(ctx);
        currentpoint = currentpoint.c;
    }
    restoreContext(ctx);
}
