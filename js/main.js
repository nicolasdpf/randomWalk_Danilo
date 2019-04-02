
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);


var groundName = 'ground1';
var groundWidth = 1000, groundHeight = 1000, divs = 2;

var sistParticulas = new Array();
var tiempo = 0;
var iParticles = 0;



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

    setInterval(generadorDeParticulas(escena), 1000);
    escena.engine.runRenderLoop(function(){

        tiempo ++;
        generadorDeParticulas(escena);
        escena.scene.render();
    });
});




