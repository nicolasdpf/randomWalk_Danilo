
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);


var groundName = 'ground1';
var groundWidth = 100, groundHeight = 100, divs = 2;

var sistParticulas = new Array();
var tiempo = 0;
var iParticles = 0;


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
    escena.createGround(groundName, groundWidth, groundHeight, divs);
    
    var ob1 = new Obstaculo(escena.scene,'o1',5,Math.floor(Math.random()*(40 - (-30) + 1) + 1));
    ob1.setPosition(Math.floor(Math.random()*(200 - (-200) + 1)) + 1,1,Math.floor(Math.random()*(200 - (-200) + 1)));
    var ob2 = new Obstaculo(escena.scene,'o1',5,Math.floor(Math.random()*(40 - (-30) + 1) + 1));
    ob2.setPosition(Math.floor(Math.random()*(200 - (-200) + 1)) + 1,1,Math.floor(Math.random()*(200 - (-200) + 1)));
    var ob3 = new Obstaculo(escena.scene,'o1',5,Math.floor(Math.random()*(40 - (-30) + 1) + 1));
    ob3.setPosition(Math.floor(Math.random()*(200 - (-200) + 1)) + 1,1,Math.floor(Math.random()*(200 - (-200) + 1)));
    //setInterval(generadorDeParticulas(escena), 1000);

    var mesh = new BABYLON.Mesh.CreateSphere(name, this.subdivs, this.size, scene);
    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {mass: Math.random(), restitution: 0}, scene);
    mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    //mesh.position.y =1;
    mesh.position = new BABYLON.Vector3(groundWidth/2,1,groundHeight/2);
    mesh.receiveShadows = true;

    var particula = new Particula(escape.scene, 'PPP', 16, 2);

    var velX = 0.03, velY = 0.03;
    var t= 0.0;
    escena.scene.registerBeforeRender(function(){
        // py = 25.0 + 10.0 * Math.sin(t / 4.0);
        px = 0.5 * Math.cos(t / 3.5);
        py = 0;
        pz = 0.5 * Math.cos(t / 4.5);
        mesh.position.x += px;
        mesh.position.z +=  pz;

        t += 0.1;
    });
      
    escena.engine.runRenderLoop(function(){
        tiempo ++;
        //generadorDeParticulas(escena);
        escena.scene.render();
    });

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

