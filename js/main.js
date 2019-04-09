
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);


var groundName = 'ground1';
var groundWidth = 100, groundHeight = 100, divs = 2;

var sistParticulas = new Array();
var tiempo = 0;
var iParticles = 0;
//Variables para calcular el tiempo general de la simulación
var s=0;
var m=0;

//Variable que hará un conteo general de los espacios creados
var iGrounds;

window.addEventListener('DOMContentLoaded', function(){
    var escena = new Scene(scene, canvas, engine);
    escena.createScene();
    escena.createLights();
    //escena.generateShadows();
    //escena.createGround(groundName, groundWidth, groundHeight, divs);
    var tiledGround = escena.createTiledGround("tiledGround");

    var particula = new Particula(escape.scene, 'PPP', 16, 2);
    particula.getPosition();

    var i=0;
    
    escena.scene.registerBeforeRender(function(){
        var moveDelta = new BABYLON.Vector3(0, 0, i);
        i = 0.3;
        particula.avanzar(moveDelta);
        particula.setParticleLimits(groundWidth, groundHeight);
        text1.text =stopwatch(tiempo);
        tiempo ++;
    });
      
    var text1 = new BABYLON.GUI.TextBlock();
    var text2 = new BABYLON.GUI.TextBlock();
    text1.color = "white";
    text1.fontSize = 24;
    
    escena.engine.runRenderLoop(function(){
        escena.scene.render();
    });
    
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    text1.textHorizontalAlignment = 2;
    text1.textVerticalAlignment = 1;
    advancedTexture.addControl(text1);   

    showAxis(10);
    //events(escena.scene, tiledGround);
});

/*

function events(scene, ground, camera){
    var obswire = new BABYLON.StandardMaterial("matBB", scene);
    obswire.diffuseColor = new BABYLON.Color3(0, 0, 0);
    obswire.specularColor = new BABYLON.Color3(0, 0, 0);
    obswire.emissiveColor = new BABYLON.Color3(0, 0, 0);
    obswire.wireframe = true;
    $('#button').remove();
    // add the button to the playground document
    // this is not needed if the button has already been added in the html
    $('body').append('<button id="button" style="position: absolute; right: 10px; top: 100px;">Nuevo Obst.</button>');
    var canvas = engine.getRenderingCanvas();
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition(evt);

            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }
        }
    }

    var onPointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var onPointerMove = function (evt) {
        if (!startingPoint) {
            return;
        }

        var current = getGroundPosition(evt);

        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }

    $('#button').click(function () {
        var ob4 = BABYLON.Mesh.CreateSphere("obstaculo 4", 3, 8);
        ob4.material= obswire;
        ob4.position.y = 3;
        ob4.position.x = Math.floor(Math.random()*(20 - (-10) + 1)) + 1;;
        ob4.position.z = Math.floor(Math.random()*(20 - (-10) + 1)) + 1;;
    });
}
*/
var showAxis = function(size) {
    var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
  
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};


function stopwatch(i){
    var fps = i;
    var h;


    if(fps % 60 === 0){
        s += 1;
    } else if(s >= 60){
        m += 1;
        s = 0;
    }
    if(m<10 && s < 10){
        return `0${m}:0${s}`;
    }else if(m>= 10 && s<10){
        return `${m}:0${s}`
    }else if(m>= 10 && s>=10){
        return `${m}:${s}`;        
    }else {
        return `0${m}:${s}`;
    }
}

