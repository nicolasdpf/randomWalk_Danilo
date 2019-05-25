/*jshint esversion: 6*/
//import * as BABYLON from 'babylonjs';

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
var theta = 2 * Math.PI * Math.random();
var phi = Math.PI - 2 * Math.PI * Math.random();



window.addEventListener('DOMContentLoaded', function(){
    
    var escena = new Scene(scene, canvas, engine);
    escena.createScene();
    escena.createLights();
    var tiledGround = new Ground(scene, "Ground1");
    var particula = new Particula(escape.scene, 'PPP', 4, 2);
    var particula2 = new Particula(escape.scene, 'PPP', 4, 2);
    
    var i=0;
    







    
    var text1 = new BABYLON.GUI.TextBlock();
    var text2 = new BABYLON.GUI.TextBlock();
    text2.color = "red";
    text1.color = "white";
    text1.fontSize = 24;
    
    
    escena.scene.registerAfterRender(function(){
        
        //particula.velocidad = 0.3;
        var posXY = agregarRecorridoParticulaLS(particula);

        var moveDelta = new BABYLON.Vector3(0, 0, particula.velocidad);
        particula.avanzar(moveDelta);
        getRotateStep(particula);
        particula.setParticleLimits(groundWidth, groundHeight);

        //var posXY2 = agregarRecorridoParticulaLS(particula2);

        var moveDelta = new BABYLON.Vector3(0, 0, particula2.velocidad);
        particula2.avanzar(moveDelta);
        getRotateStep(particula2);
        particula2.setParticleLimits(groundWidth, groundHeight);

        text1.text = stopwatch(tiempo);
        text2.text = `${posXY}`;

        tiempo ++;
    });
      

    
    escena.engine.runRenderLoop(function(){
        escena.scene.render();
    });
    escena.scene.debugLayer.show();

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    text1.textHorizontalAlignment = 2;
    text1.textVerticalAlignment = 1;
    advancedTexture.addControl(text1);   

    showAxis(100);
});

function stopwatch(i){
    var fps = i;
    var h;


    if(fps % 60 === 0){
        s += 1;
    } else if(s >= 60){
        m += 1;
        s = 0;
    }
    if(m < 10 && s < 10){
        return `0${m}:0${s}`;
    }else if( m >= 10 && s < 10){
        return `${m}:0${s}`
    }else if(m >= 10 && s >= 10){
        return `${m}:${s}`;        
    }else {
        return `0${m}:${s}`;
    }
}

/**
 * OBTENER paso de rotación
 * 
 * @param {*} particula 
 */
function getRotateStep(particula){
    var rotateStp = getRndInteger(-0.5, 0.5);
    if( s % 5 === 0){
        rotateStp = 0.02;
        particula.rotateParticle(rotateStp);
    }
    if(s % 7 === 0){
        rotateStp = 0.03;
        particula.rotateParticle(rotateStp);
    }
    if(s % 2 === 0){
        var choose = getRndInteger(0, 1);
        if(choose === 1 ){
            rotateStp = -0.02;
            particula.rotateParticle(rotateStp);
        }else if( choose === 0){
            rotateStp = 0.02;
            particula.rotateParticle(rotateStp);
        }
    }
    if(s %  0.26 === 0){
        rotateStp = -0.02;
        particula.rotateParticle(rotateStp);
    }
    
}


/**
 * Function para agregar el recorrido de cada partícula en el LOCAL STORAGE
 * @param {*} particula 
 */

function agregarRecorridoParticulaLS(particula){
    var posParticula = particula.getPosition();
    if (s % 2 === 0){
        var posXY = [];
        localStorage.setItem(`X  ${m} m con ${s} segundo(s)`, round(posParticula.x));
        posXY.push(posParticula.x);
        localStorage.setItem(`Z  ${m} m con ${s} segundo(s)`, round(posParticula.z));
        posXY.push(posParticula.y);
        return posXY[0];
    }
}


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


