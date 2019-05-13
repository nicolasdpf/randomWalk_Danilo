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


var inicializacion = false;
var poblacion = 0;

class Scene {
    constructor(scene, canvas, engine) {
        this.scene = scene;
        this.canvas = canvas;
        this.engine = engine;
        this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-100, 200, 0), scene);
    }
    createScene() {
        var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        //camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-100, 200, 0), scene);

        // This targets the camera to scene origin
        this.camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        this.camera.attachControl(canvas, true);
        scene.clearColor = new BABYLON.Color3(0,0,0);

        scene.enablePhysics(gravityVector, physicsPlugin);


        this.isAlive = true;

        return scene;
    }
    createLights() {
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        light.intensity = 0.1;
        return light;
    }

    generateShadows() {
        var light = this.createLights();
        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.bias = 0.00001;
        shadowGenerator.normalBias = 0.01;

        return shadowGenerator;
    }

    inicializarSistema(tiempo){
        if(tiempo === 0 && this.poblacion === 0){
            console.log("todas las variables inicializadas");
        }
        if(tiempo === 120 && inicializacion === false){
            console.log("Dando vida a primera particula");
            inicializacion = true;
        }
    }
}

function round(num, decimales = 2) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
        return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
}

//_______________________________________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________________________________
/**
 * Functiones generales 
 */
function localAxes(size) {
    var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);

    pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);

    var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);

    var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", {
        size: 1
    }, scene);
    local_origin.isVisible = false;

    pilot_local_axisX.parent = local_origin;
    pilot_local_axisY.parent = local_origin;
    pilot_local_axisZ.parent = local_origin;

    return local_origin;

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + 1;
}

function showNormals(mesh, size, color, sc) {
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    color = color || BABYLON.Color3.White();
    sc = sc || scene;
    size = size || 1;

    var lines = [];
    for (var i = 0; i < normals.length; i += 3) {
        var v1 = BABYLON.Vector3.FromArray(positions, i);
        var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
        lines.push([v1.add(mesh.position), v2.add(mesh.position)]);
    }
    var normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", {
        lines: lines
    }, sc);
    normalLines.color = color;
    return normalLines;
}



function vecToLocal(vector, mymesh){
    var m = mymesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;		 
}
