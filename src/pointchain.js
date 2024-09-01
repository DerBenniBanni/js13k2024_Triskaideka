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
        //if(abs(dist - point.d) > 0.5) {
            let v2 = multiplyVector(distanceVector, point.d / dist);
            child.a = getVectorAngleDegrees(v2);

            let newchildPos = addPoints(point, v2)
            child.x = newchildPos.x;
            child.y = newchildPos.y;

            let diffAngle = (point.a - child.a + 180) % 360 - 180;
            let updateNeeded = false;
            if(diffAngle < -maxAngle) {
                diffAngle = -maxAngle;
                updateNeeded = true;
            } else if(diffAngle > maxAngle) {
                diffAngle = maxAngle;
                updateNeeded = true;
            }
            if(updateNeeded) {
                child.a = normalizeAngle(point.a + 720 - diffAngle);
                let diffVector = createAngleVector(child.a, point.d);
                let newchildPos = addPoints(point, diffVector);
                child.x = newchildPos.x;
                child.y = newchildPos.y;
            }
                
        //}
        fixChainDistances(child, maxAngle);
    }
}

function normalizeAngle(angle) {
    while(angle >= 360) {
        angle -= 360;
    }
    while(angle < 0) {
        angle += 360;
    }
    return angle;
}


function renderChain(head) {
    saveContext();
    translateContext(head.x, head.y);
    let currentpoint = head;
    while(currentpoint.c) {
        beginPath();
        strokeStyle(COLOR_WHITE);
        circle(currentpoint.x-head.x, currentpoint.y-head.y, currentpoint.r);
        stroke();
        currentpoint = currentpoint.c;
    }
    restoreContext();
}
