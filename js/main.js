
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);


var groundName = 'ground1';
var groundWidth = 100, groundHeight = 100, divs = 1;

var sistParticulas = new Array();
var tiempo = 0;
var iParticles = 0;
//Variables para calcular el tiempo general de la simulación
var s=0;
var m=0;
/*
function generadorDeParticulas(escena){
    if(tiempo % 60 == 0){
        var nombre = String("p " + iParticles);
            sistParticulas.push(new Particula(escena.scene, nombre, 16, 2));
            sistParticulas[iParticles].setCoordinates(tiempo);
            let index;
            for (index = 0; index < sistParticulas.length; index++) {
                if(tiempo % 90 === 0 && index % 2 === 0){
                    sistParticulas[index].setCoordinates(tiempo);
                }
                if(tiempo % 30 === 0 && index % 3 === 0){
                    sistParticulas[index].setCoordinates(tiempo);
                }
                if(tiempo % 70 === 0 && index % 4 === 0){
                    sistParticulas[index].setCoordinates(tiempo);
                }
        }
        iParticles++;
    }
}
*/

//Variable que hará un conteo general de los espacios creados
var iGrounds;

window.addEventListener('DOMContentLoaded', function(){
    var escena = new Scene(scene, canvas, engine);
    escena.createScene();
    escena.createLights();
    escena.generateShadows();
    //escena.createGround(groundName, groundWidth, groundHeight, divs);
    var tiledGround = escena.createTiledGround("tiledGround");

    var particula = new Particula(escape.scene, 'PPP', 16, 2);
    particula.getPosition();


    //var theta = 2 * Math.PI * Math.random();
    //var phi = Math.PI - 2 * Math.PI * Math.random();
    //var xi = Math.sin(phi) * Math.cos(theta);
    var i=0;
    
    escena.scene.registerBeforeRender(function(){
        var moveDelta = new BABYLON.Vector3(0, 0, i);
        i = 0.511;
        particula.avanzar(moveDelta);
        particula.setParticleLimits(groundWidth, groundHeight);
        text1.text =stopwatch(tiempo);
        tiempo ++;
        console.log(m);
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
    text1.textHorizontalAlignment = 50;
    text1.textVerticalAlignment =0;

    advancedTexture.addControl(text1);   

    showAxis(10);
});


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

