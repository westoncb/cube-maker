var camera, scene, renderer, canvas, ctx;
var cubeMesh, cubeTex

var rendererWidth = 512;
var rendererHeight = 512;
var canvasWidth = 512;
var canvasHeight = 512;

var mouseX = 0;
var mouseY = 0;
var squareOriginX = 0;
var squareOriginY = 0;
var squareEndX = 0;
var squareEndY = 0;

var mouseDown = false;

var cubeMaxWidth = 300;
var cubeMaxHeight = 300;

var firstCubeCreated = false;

$(document).ready(function() {
    init();
    animate();
});

function init() {
    scene = new THREE.Scene();

    //Set up renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(rendererWidth, rendererHeight);
    renderer.setClearColor(new THREE.Color(0x445566), 1);
    renderer.antialias = true;
    var $renderer = $(renderer.domElement);
    $renderer.addClass('renderer');

    //set up canvas
    var $canvas = $("<canvas class='canvas' style='width: " + canvasWidth + "px; height: " + canvasHeight + "px;'></canvas>");
    canvas = $canvas.get(0);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    //Set up page structure
    var $body = $('body')
    $body.append("<div class='message'>Draw squares here...</div>");
    $body.append($canvas);
    $body.append("<div class='message'>&#8212;to make cubes here.</div>");
    $body.append($renderer);

    camera = new THREE.PerspectiveCamera( 70, rendererWidth/rendererHeight, 1, 1000 );
    camera.position.z = 500;
    scene.add(camera);

    //Set up cube
    cubeTex = new THREE.Texture(canvas);
    var geometry = new THREE.BoxBufferGeometry(cubeMaxWidth, cubeMaxHeight, cubeMaxWidth);
    var material = new THREE.MeshBasicMaterial({ map: cubeTex });
    cubeMesh = new THREE.Mesh( geometry, material );

    setUpCanvasMouseEvents();
}

function setUpCanvasMouseEvents() {
    var $canvas = $('canvas');

    $canvas.mousedown(function(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var pos = canvasMousePos(e.pageX, e.pageY);
        mouseX = pos[0];
        mouseY = pos[1];
        squareOriginX = mouseX;
        squareOriginY = mouseY;
        squareEndX = mouseX;
        squareEndY = mouseY;

        mouseDown = true;
    });

    $canvas.mousemove(function(e) {
        if (mouseDown) {
            var pos = canvasMousePos(e.pageX, e.pageY);
            mouseX = pos[0];
            mouseY = pos[1];
            squareEndX = mouseX;
            squareEndY = mouseY;
        }
    });

    $canvas.mouseup(function(e) {
        var pos = canvasMousePos(e.pageX, e.pageY);
        mouseX = pos[0];
        mouseY = pos[1];
        squareEndX = mouseX;
        squareEndY = mouseY;

        mouseDown = false;

        updateCube();
    });
}

//Get mouse position relative to upper left corner of canvas
function canvasMousePos(pageX, pageY) {
    var canvasOffset = $('.canvas').offset();

    var x = pageX - canvasOffset.left;
    var y = pageY - canvasOffset.top;

    return [x, y];
}

//Called every frame
function updateCanvas() {
    var squareWidth = squareEndX - squareOriginX;
    var squareHeight = squareEndY - squareOriginY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Don't bother if width/height are less than the square border size
    if (squareWidth < 10 || squareHeight < 10)
        return;

    ctx.fillStyle = 'red';
    ctx.fillRect(squareOriginX, squareOriginY, squareWidth, squareHeight);

    ctx.fillStyle = 'gray';
    ctx.fillRect(squareOriginX + 5, squareOriginY + 5, squareWidth - 10, squareHeight - 10);
}

//Called on mouse up after a square has been drawn on the canvas
function updateCube() {
    var squareWidth = squareEndX - squareOriginX;
    var squareHeight = squareEndY - squareOriginY;
    var xProportion = squareWidth / canvasWidth;
    var yProportion = squareHeight / canvasHeight;

    //Don't bother if width/height are less than the square border size
    if (squareWidth < 10 || squareHeight < 10) {
        return;
    }

    if (!firstCubeCreated) {
        scene.add(cubeMesh);
        firstCubeCreated = true;
    }


    //Give the cube the same proportions as the square
    cubeMesh.scale.set(xProportion, yProportion, xProportion);

    //Save old square properties
    var oldSquareProps = [squareOriginX, squareOriginY, squareEndX, squareEndY];

    //Draw square fully covering canvas
    squareOriginX = 0;
    squareOriginY = 0;
    squareEndX = canvasWidth;
    squareEndY = canvasHeight;

    //Use the full-sized square as the actual texture to apply (otherwise we'll see gaps)
    updateCanvas();
    cubeTex.needsUpdate = true;
    renderer.render(scene, camera);

    //Restore the user's drawn square to the canvas
    squareOriginX = oldSquareProps[0];
    squareOriginY = oldSquareProps[1];
    squareEndX = oldSquareProps[2];
    squareEndY = oldSquareProps[3];
}

function animate() {
    requestAnimationFrame(animate);
    
    updateCanvas();

    cubeMesh.rotation.x += 0.01;
    cubeMesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}
