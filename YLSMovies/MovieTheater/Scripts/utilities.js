// Dom elements globals
var canvasObj = null; // canvas DOM object
var canvasContext = null; // canvas context

// Animation time globals
var currTime = 0; 
var frameInterval = 25; // in ms

// Ball globals
var ballRadius = 10;
var ballsArr = null;

// Physics globals
var collisionDamper = 0.3;
var floorFriction = 0.0005 * frameInterval;
var mouseForceMultiplier = 1 * frameInterval;
var restoreForce =0.001 * frameInterval;
 
// Mouse globals
var mouseX = 99999;
var mouseY = 99999;
  
// Initialize the canvas after the element is loaded to the document
jQuery("#logoanvas").ready(function () {
    init();
});

// Ball Constructor (current position, speed, color and original position)
function Ball(x,y,vx,vy,color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
  
    this.origX = x;
    this.origY = y;
}
  
// Initialize the canvas
function init() {
    // Gets the canvas and it's context
    canvasObj = document.getElementById("logoCanvas");
    canvasContext = canvasObj.getContext("2d");

    // Drawing the logo
    initStageObjects();

    // Redraw the logo every X ms (for the movement)
    setInterval(updateStage, frameInterval);
}
  
// Redraw the logo according to the new positions
function updateStage() {
    currTime += frameInterval;
    clearCanvas();
    updateStageObjects();
    drawStageObjects(); 
}
  
// Initialize the logo (balls original position)
function initStageObjects() {
    ballsArr = new Array();
  
    var blue = "#3A5BCD";
    //var red="#EF2B36";
    //var yellow = "#FFC636";
    //var green = "#02A817";
    var purple = "#6E37FA";
    var cyan = "#37E6FA";
    var orange = "#E07751";
  
    // Y
    ballsArr.push(new Ball(102, 52,0 ,0 , blue));
    ballsArr.push(new Ball(112, 62, 0, 0, blue));
    ballsArr.push(new Ball(122, 72, 0, 0, blue));
    ballsArr.push(new Ball(132, 82, 0, 0, blue));
    ballsArr.push(new Ball(142, 92, 0, 0, blue));
    ballsArr.push(new Ball(152, 82, 0, 0, blue));
    ballsArr.push(new Ball(162, 72, 0, 0, blue));
    ballsArr.push(new Ball(172, 62, 0, 0, blue));
    ballsArr.push(new Ball(182, 52, 0, 0, blue));
    ballsArr.push(new Ball(142, 102, 0, 0, blue));
    ballsArr.push(new Ball(142, 112, 0, 0, blue));
    ballsArr.push(new Ball(142, 122, 0, 0, blue));
    ballsArr.push(new Ball(142, 132, 0, 0, blue));
    ballsArr.push(new Ball(142, 136, 0, 0, blue));

    // L
    ballsArr.push(new Ball(210, 52, 0, 0, purple));
    ballsArr.push(new Ball(210, 62, 0, 0, purple));
    ballsArr.push(new Ball(210, 72, 0, 0, purple));
    ballsArr.push(new Ball(210, 82, 0, 0, purple));
    ballsArr.push(new Ball(210, 92, 0, 0, purple));
    ballsArr.push(new Ball(210, 102, 0, 0, purple));
    ballsArr.push(new Ball(210, 112, 0, 0, purple));
    ballsArr.push(new Ball(210, 122, 0, 0, purple));
    ballsArr.push(new Ball(210, 132, 0, 0, purple));
    ballsArr.push(new Ball(210, 136, 0, 0, purple));
    ballsArr.push(new Ball(220, 136, 0, 0, purple));
    ballsArr.push(new Ball(230, 136, 0, 0, purple));
    ballsArr.push(new Ball(240, 136, 0, 0, purple));
    ballsArr.push(new Ball(250, 136, 0, 0, purple));
    ballsArr.push(new Ball(260, 136, 0, 0, purple));
    ballsArr.push(new Ball(270, 136, 0, 0, purple));

    // S
    ballsArr.push(new Ball(298, 116, 0, 0, cyan));
    ballsArr.push(new Ball(300, 122, 0, 0, cyan));
    ballsArr.push(new Ball(307, 130, 0, 0, cyan));
    ballsArr.push(new Ball(314, 132, 0, 0, cyan));
    ballsArr.push(new Ball(314, 134, 0, 0, cyan));
    ballsArr.push(new Ball(322, 136, 0, 0, cyan));
    ballsArr.push(new Ball(328, 136, 0, 0, cyan));
    ballsArr.push(new Ball(334, 136, 0, 0, cyan));
    ballsArr.push(new Ball(342, 134, 0, 0, cyan));
    ballsArr.push(new Ball(342, 132, 0, 0, cyan));
    ballsArr.push(new Ball(349, 130, 0, 0, cyan));
    ballsArr.push(new Ball(356, 122, 0, 0, cyan));
    ballsArr.push(new Ball(358, 116, 0, 0, cyan));
    ballsArr.push(new Ball(358, 114, 0, 0, cyan));
    ballsArr.push(new Ball(356, 112, 0, 0, cyan));
    ballsArr.push(new Ball(350, 106, 0, 0, cyan));
    ballsArr.push(new Ball(342, 100, 0, 0, cyan));
    ballsArr.push(new Ball(335, 97, 0, 0, cyan));
    ballsArr.push(new Ball(328, 94, 0, 0, cyan));
    ballsArr.push(new Ball(321, 91, 0, 0, cyan));
    ballsArr.push(new Ball(314, 88, 0, 0, cyan));
    ballsArr.push(new Ball(306, 82, 0, 0, cyan));
    ballsArr.push(new Ball(300, 76, 0, 0, cyan));
    ballsArr.push(new Ball(298, 74, 0, 0, cyan));
    ballsArr.push(new Ball(298, 72, 0, 0, cyan));
    ballsArr.push(new Ball(300, 66, 0, 0, cyan));
    ballsArr.push(new Ball(307, 58, 0, 0, cyan));
    ballsArr.push(new Ball(314, 56, 0, 0, cyan));
    ballsArr.push(new Ball(314, 54, 0, 0, cyan));
    ballsArr.push(new Ball(322, 52, 0, 0, cyan));
    ballsArr.push(new Ball(328, 52, 0, 0, cyan));
    ballsArr.push(new Ball(334, 52, 0, 0, cyan));
    ballsArr.push(new Ball(342, 54, 0, 0, cyan));
    ballsArr.push(new Ball(342, 56, 0, 0, cyan));
    ballsArr.push(new Ball(349, 58, 0, 0, cyan));
    ballsArr.push(new Ball(356, 66, 0, 0, cyan));
    ballsArr.push(new Ball(358, 72, 0, 0, cyan));

    // C
    ballsArr.push(new Ball(386, 116, 0, 0, orange));
    ballsArr.push(new Ball(388, 122, 0, 0, orange));
    ballsArr.push(new Ball(395, 130, 0, 0, orange));
    ballsArr.push(new Ball(402, 132, 0, 0, orange));
    ballsArr.push(new Ball(402, 134, 0, 0, orange));
    ballsArr.push(new Ball(410, 136, 0, 0, orange));
    ballsArr.push(new Ball(416, 136, 0, 0, orange));
    ballsArr.push(new Ball(422, 136, 0, 0, orange));
    ballsArr.push(new Ball(430, 134, 0, 0, orange));
    ballsArr.push(new Ball(430, 132, 0, 0, orange));
    ballsArr.push(new Ball(437, 130, 0, 0, orange));
    ballsArr.push(new Ball(444, 122, 0, 0, orange));
    ballsArr.push(new Ball(446, 116, 0, 0, orange));
    ballsArr.push(new Ball(386, 112, 0, 0, orange));
    ballsArr.push(new Ball(386, 104, 0, 0, orange));
    ballsArr.push(new Ball(386, 96, 0, 0, orange));
    ballsArr.push(new Ball(386, 88, 0, 0, orange));
    ballsArr.push(new Ball(386, 80, 0, 0, orange));
    ballsArr.push(new Ball(386, 72, 0, 0, orange));
    ballsArr.push(new Ball(388, 66, 0, 0, orange));
    ballsArr.push(new Ball(395, 58, 0, 0, orange));
    ballsArr.push(new Ball(402, 56, 0, 0, orange));
    ballsArr.push(new Ball(402, 54, 0, 0, orange));
    ballsArr.push(new Ball(410, 52, 0, 0, orange));
    ballsArr.push(new Ball(416, 52, 0, 0, orange));
    ballsArr.push(new Ball(422, 52, 0, 0, orange));
    ballsArr.push(new Ball(430, 54, 0, 0, orange));
    ballsArr.push(new Ball(430, 56, 0, 0, orange));
    ballsArr.push(new Ball(437, 58, 0, 0, orange));
    ballsArr.push(new Ball(444, 66, 0, 0, orange));
    ballsArr.push(new Ball(446, 72, 0, 0, orange));
}
  
// Drawing the balls
function drawStageObjects() {

    // Drawing all the ball according to the balls array
    for (var n = 0; n < ballsArr.length; n++) {

        canvasContext.beginPath();
        canvasContext.arc(ballsArr[n].x, ballsArr[n].y, ballRadius,
            0, 2*Math.PI, false);
        canvasContext.fillStyle=ballsArr[n].color;
        canvasContext.fill();
    }
}
  
function updateStageObjects() {
  
    for (var n = 0; n < ballsArr.length; n++) {
  
        // set ball position based on velocity
        ballsArr[n].y += ballsArr[n].vy;
        ballsArr[n].x += ballsArr[n].vx;
  
        // restore forces
  
  
  
        if (ballsArr[n].x > ballsArr[n].origX) {
            ballsArr[n].vx -= restoreForce;
        }
        else {
            ballsArr[n].vx += restoreForce;
        }
        if (ballsArr[n].y > ballsArr[n].origY) {
            ballsArr[n].vy -= restoreForce;
        }
        else {
            ballsArr[n].vy += restoreForce;
        }
  
        // mouse forces
        var distX = ballsArr[n].x - mouseX;
        var distY = ballsArr[n].y - mouseY;
  
        var radius = Math.sqrt(Math.pow(distX,2) + 
            Math.pow(distY,2));
  
        var totalDist = Math.abs(distX) + Math.abs(distY);
  
        var forceX = (Math.abs(distX) / totalDist) * 
            (1/radius) * mouseForceMultiplier;
        var forceY = (Math.abs(distY) / totalDist) * 
            (1/radius) * mouseForceMultiplier;
  
        if (distX>0) { // mouse is left of ball
            ballsArr[n].vx += forceX;
        }
        else {
            ballsArr[n].vx -= forceX;
        }
        if (distY>0) { // mouse is on top of ball
            ballsArr[n].vy += forceY;
        }
        else {
            ballsArr[n].vy -= forceY;
        }
  
  
        // floor friction
        if (ballsArr[n].vx>0) {
            ballsArr[n].vx-=floorFriction;
        }
        else if (ballsArr[n].vx<0) {
            ballsArr[n].vx+=floorFriction;
        }
        if (ballsArr[n].vy>0) {
            ballsArr[n].vy-=floorFriction;
        }
        else if (ballsArr[n].vy<0) {
            ballsArr[n].vy+=floorFriction;
        }
  
        // floor condition
        if (ballsArr[n].y > (canvasObj.height-ballRadius)) {
            ballsArr[n].y=canvasObj.height-ballRadius-2;
            ballsArr[n].vy*=-1; 
            ballsArr[n].vy*=(1-collisionDamper);
        }
  
        // ceiling condition
        if (ballsArr[n].y < (ballRadius)) {
            ballsArr[n].y=ballRadius+2;
            ballsArr[n].vy*=-1; 
            ballsArr[n].vy*=(1-collisionDamper);
        }
  
        // right wall condition
        if (ballsArr[n].x > (canvasObj.width-ballRadius)) {
            ballsArr[n].x=canvasObj.width-ballRadius-2;
            ballsArr[n].vx*=-1;
            ballsArr[n].vx*=(1-collisionDamper);
        }
  
        // left wall condition
        if (ballsArr[n].x < (ballRadius)) {
            ballsArr[n].x=ballRadius+2;
            ballsArr[n].vx*=-1;
            ballsArr[n].vx*=(1-collisionDamper);
        }   
    }
}
  
function clearCanvas() {
    canvasContext.clearRect(0,0,canvasObj.width, canvasObj.height);
}
  
function handleMouseMove(evt) {
    mouseX = evt.clientX - canvasObj.offsetLeft;
    mouseY = evt.clientY - canvasObj.offsetTop;    
}
  
function handleMouseOut() {
    mouseX = 99999;
    mouseY = 99999;
}