/*jshint esversion: 6*/
//import * as BABYLON from 'babylonjs';




window.addEventListener('DOMContentLoaded', function(){
    
    var escena = new Scene(scene, canvas, engine);
    escena.createScene();
    escena.createLights();
    var tiledGround = new Ground(scene, "Ground1");
    


    var text1 = new BABYLON.GUI.TextBlock();
    var text2 = new BABYLON.GUI.TextBlock();
    text2.color = "red";
    text1.color = "white";
    text1.fontSize = 24;
    
    
    escena.scene.registerAfterRender(function(){
        escena.inicializarSistema(tiempo);
        crearParticula(escena); 
        //crearParticula(escena); 
        
        text1.text = stopwatch(tiempo);
        tiempo ++;
        vidaParticulas();
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


