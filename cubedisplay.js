var camera, scene, renderer, canvas, ctx;
var cubeMesh, cubeTex

var rendererWidth = 500;
var rendererHeight = 500;

var mouseX = 0;
var mouseY = 0;
var squareOriginX = 0;
var squareOriginY = 0;
var squareEndX = 0;
var squareEndY = 0;
var mouseDown = false;

var cubeMaxWidth = 250;
var cubeMaxHeight = 250;

$(document).ready(function() {
    init();
    animate();
});

function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(rendererWidth, rendererHeight);
    renderer.setClearColor(new THREE.Color(0x445566), 1)

    var $renderer = $(renderer.domElement);
    $renderer.addClass('renderer');

    var $canvas = $("<canvas class='canvas' style='width: 256px; height: 256px;'></canvas>");

    $('body').append($renderer);
    $('body').append($canvas);

    camera = new THREE.PerspectiveCamera( 70, rendererWidth/rendererHeight, 1, 1000 );
    camera.position.z = 500;
    scene.add(camera);

    $renderer.trigger($.Event('resize'));
    
    $('body').bind('resize', function() {
        camera.aspect = $renderer.width()/$renderer.height();
        console.log("aspect: ", camera.aspect)
        camera.updateProjectionMatrix();
        renderer.setSize($renderer.width(), $renderer.height());
    });

    canvas = $canvas.get(0);
    canvas.width = 256;
    canvas.height = 256;
    ctx = canvas.getContext('2d');

    cubeTex = new THREE.Texture(canvas);

    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( { map: cubeTex } );
    cubeMesh = new THREE.Mesh( geometry, material );
    scene.add(cubeMesh);


    $canvas.mousedown(function(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var pos = canvasMousePos(e.pageX, e.pageY);
        mouseX = pos[0];
        mouseY = pos[1];
        squareOriginX = mouseX;
        squareOriginY = mouseY;
        squareEndX = mouseX;
        squareEndY = mouseY;

        console.log('down: ', mouseX, mouseY);

        mouseDown = true;
    });

    $canvas.mousemove(function(e) {
        if (mouseDown) {
            var pos = canvasMousePos(e.pageX, e.pageY);
            mouseX = pos[0];
            mouseY = pos[1];
            squareEndX = mouseX;
            squareEndY = mouseY;

            console.log('move: ', mouseX, mouseY);
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

function canvasMousePos(pageX, pageY) {
    var canvasOffset = $('.canvas').offset();

    var x = pageX - canvasOffset.left;
    var y = pageY - canvasOffset.top;

    return [x, y];
}

function updateCanvas() {
    var width = squareEndX - squareOriginX;
    var height = squareEndY - squareOriginY;

    console.log("origin: ", squareOriginX, squareOriginY, "; end: ", squareEndX, squareEndY);

    console.log("FINAL width, height: ", width, height, squareOriginX, squareOriginY);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (width < 10 || height < 10)
        return;

    ctx.fillStyle = 'red';
    ctx.fillRect(squareOriginX, squareOriginY, width, height);

    ctx.fillStyle = 'gray';
    ctx.fillRect(squareOriginX + 5, squareOriginY + 5, width - 10, height - 10);
}

function updateCube() {
    var cubeWidth = 

    cubeTex.needsUpdate = true;
}

function animate() {
    requestAnimationFrame(animate);
    
    updateCanvas();

    cubeMesh.rotation.x += 0.005;
    cubeMesh.rotation.y += 0.005;

    renderer.render(scene, camera);
}
