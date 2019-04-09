class Scene {
    constructor(scene, canvas, engine) {
        this.scene = scene;
        this.canvas = canvas;
        this.engine = engine;
        this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-100, 200, 0), scene);
        //this.events = this.events();
        //this.ground = this.createGround();
    }

    createScene() {
        var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        //camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-100, 200, 0), scene);


        // This targets the camera to scene origin
        this.camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        this.camera.attachControl(canvas, true);

        scene.enablePhysics(gravityVector, physicsPlugin);

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

    createGround(name, width, length, divs) {
        var ground = new BABYLON.Mesh.CreateGround(name, width, length, divs, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.9
        }, scene);
        ground.receiveShadows = true;
        ground.position.x = length / 2;
        ground.position.z = width / 2;

        showNormals(ground, 0.25, new BABYLON.Color3(1, 0, 0));
        this.castRay(ground);
        return ground;
    }
    
    createTiledGround() {
        var xmin = -1;
        var zmin = -1;
        var xmax = 101;
        var zmax = 101;
        var precision = {
            "w": 1,
            "h": 1
        };
        var subdivisions = {
            'h': 20,
            'w': 20
        };

        var tiledGround = new BABYLON.Mesh.CreateTiledGround("name", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
        tiledGround.showBoundingBox = true;
        tiledGround.position.y = -1;
        showNormals(tiledGround, 0.3, new BABYLON.Color3(1, 0, 0))

        tiledGround.physicsImpostor = new BABYLON.PhysicsImpostor(tiledGround, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0.9
        }, scene);
        tiledGround.receiveShadows = true;
        
        tiledGround.updateFacetData();
        var positions = tiledGround.getFacetLocalPositions();
        var normals = tiledGround.getFacetLocalNormals();
        var lines = [];
        for (var i = 0; i < positions.length; i++) {
            var line = [ positions[i], positions[i].add(normals[i]) ];
            lines.push(line);
        }
        //this.castRay(tiledGround);
        var lineSystem = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines}, scene);
        lineSystem.color = BABYLON.Color3.Green();
        console.log(`normales: ${normals.length}`);

        var ray = new BABYLON.Ray();
        var rayHelper = new BABYLON.RayHelper(ray);
        return tiledGround;
    }



    events( ){
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
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== this.ground; });
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
        };
    
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
    
        };
    
        canvas.addEventListener("pointerdown", onPointerDown, false);
        canvas.addEventListener("pointerup", onPointerUp, false);
        canvas.addEventListener("pointermove", onPointerMove, false);
    
        scene.onDispose = function () {
            canvas.removeEventListener("pointerdown", onPointerDown);
            canvas.removeEventListener("pointerup", onPointerUp);
            canvas.removeEventListener("pointermove", onPointerMove);
        };
    
        $('#button').click(function () {
            var ob4 = BABYLON.Mesh.CreateSphere("obstaculo 4", 3, 8);
            ob4.material= obswire;
            ob4.position.y = 3;
            ob4.position.x = Math.floor(Math.random()*(20 - (-10) + 1)) + 1;
            ob4.position.z = Math.floor(Math.random()*(20 - (-10) + 1)) + 1;
        });
    }
    
    castRay(mesh){       
        var origin = mesh.position;
	
	    var forward = new BABYLON.Vector3(0,1,0);		
	    forward = vecToLocal(forward, mesh);
	
	    var direction = forward.subtract(origin);
	    direction = BABYLON.Vector3.Normalize(direction);
	
	    var length = 100;
	
	    var ray = new BABYLON.Ray(origin, direction, length);

		let rayHelper = new BABYLON.RayHelper(ray);		
		rayHelper.show(scene);		
/*
        var hit = scene.pickWithRay(ray);

        if (hit.pickedMesh){
		   hit.pickedMesh.scaling.y += 0.01;
	    }*/
    }

    getFacetNormals(titledGround) {
        tiledGround.updateFacetData();
        var positions = tiledGround.getFacetLocalPositions();
        var normals = tiledGround.getFacetLocalNormals();
        var lines = [];
        for (var i = 0; i < positions.length; i++) {
            var line = [positions[i], positions[i].add(normals[i])];
            lines.push(line);
        }
        var lineSystem = BABYLON.MeshBuilder.CreateLineSystem("ls", {
            lines: lines
        }, scene);
        lineSystem.color = BABYLON.Color3.Green();

        return normals;
    }
}



//PARTICULA
//_______________________________________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________________________________
class Particula extends Scene {

    constructor(scene, name, subdivs, size) {
        super(scene);
        this.name = name;
        this.subdivs = subdivs;
        this.size = size;
        this.mesh = this.crearParticula();
        this.meshLabel = this.meshLabelName();
        this.torus = this.crearToro();
    }


    crearParticula() {

        var sphereMat = new BABYLON.StandardMaterial("ground", scene);

        // Material y Color
        sphereMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random()); //(0.4, 0.4, 0.4)
        sphereMat.specularColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMat.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

        var mesh = new BABYLON.Mesh.CreateSphere(name, this.subdivs, this.size, scene);
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: Math.random(),
            restitution: 0
        }, scene);
        mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        mesh.material = sphereMat;
        // mesh.position.y =-10;
        mesh.position = new BABYLON.Vector3(getRndInteger(-1, 10), 1, getRndInteger(-10, 10));
        var shadowGenerator = this.generateShadows();
        shadowGenerator.addShadowCaster(mesh);
        var localOrigin = localAxes(3);
        localOrigin.parent = mesh;
        mesh.receiveShadows = true;

        return mesh;
    }

    crearToro() {
        var torusMat = new BABYLON.StandardMaterial("texture1", scene);

        var torus = new BABYLON.Mesh.CreateTorus(this.name, 7, 0.2, 32, scene, false);

        // Material y Color
        torusMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        torusMat.specularColor = new BABYLON.Color3(0, 1, 0);
        torusMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        torus.material = torusMat;
        torus.parent = this.mesh;

        return torus;
    }

    meshLabelName() {
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer.layerMask = 2;
        var label = new BABYLON.GUI.Rectangle("label for " + this.name);
        label.background = "black"
        label.height = "30px";
        label.alpha = 0.5;
        label.width = "50px";
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        advancedTexture.addControl(label);
        label.linkWithMesh(this.mesh);

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = this.name;
        text1.color = "white";
        label.addControl(text1);
    }

    setPosition(x = 0, y = 0, z = 0) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

    }
    getPosition() {
        var pX = this.mesh.position.x;
        var pY = this.mesh.position.y;
        var pZ = this.mesh.position.z;
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    }

    transformPerQuat(vec) {
        var mymatrix = new BABYLON.Matrix();
        this.mesh.rotationQuaternion.toRotationMatrix(mymatrix);
        return BABYLON.Vector3.TransformNormal(vec, mymatrix);
    }

    rotateParticle(rotateStep) {
        this.mesh.rotate(BABYLON.Axis.Y, rotateStep, BABYLON.Space.WORLD);
    }

    avanzar(moveVector) {
        this.mesh.moveWithCollisions(this.transformPerQuat(moveVector));
    }

    setParticleLimits(groundWidth, groundHeight) {
        if (this.mesh.position.z >= groundHeight || this.mesh.position.z < 0) {
            this.rotateParticle(10);
        } else if (this.mesh.position.x >= groundWidth || this.mesh.position.x < 0) {
            this.rotateParticle(10);
        }
    }









    setCoordinates(i) {
        var cuadrante = Math.floor(Math.random() * (5 - 1)) + 1;
        if (i % 10 === 0) {
            if (cuadrante === 1) {
                this.moveCuadrante1(true);
            } else if (cuadrante === 2) {
                this.moveCuadrante2(true);
            } else if (cuadrante === 3) {
                this.moveCuadrante3(true);
            } else if (cuadrante === 4) {
                this.moveCuadrante4(true);
            }
        }
    }


    moveCuadrante1(bool = false, mX = getRndInteger(0, 10), mY = 1.2, mZ = getRndInteger(0, 10)) {
        if (bool) {
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }
    moveCuadrante2(bool = false, mX = getRndInteger(0, -10), mY = 1.2, mZ = getRndInteger(0, 10)) {
        if (bool) {
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }
    moveCuadrante3(bool = false, mX = getRndInteger(0, -10), mY = 1.2, mZ = getRndInteger(0, -10)) {
        if (bool) {
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }
    moveCuadrante4(bool = false, mX = getRndInteger(0, 10), mY = 1.2, mZ = getRndInteger(0, -10)) {
        if (bool) {
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }


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