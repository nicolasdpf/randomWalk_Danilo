class Scene{
    constructor(scene, canvas, engine){
        this.scene = scene;
        this.canvas = canvas;
        this.engine = engine;
    }

    createScene(){
        var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        /*
        var camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.lowerRadiusLimit = 30;
        camera.lowerBetaLimit = 0;
        camera.upperBetaLimit = Math.PI*(4/9);
        camera.lowerAlphaLimit = Math.PI/6;
        camera.upperAlphaLimit = Math.PI*(5/6);
        camera.setPosition(new BABYLON.Vector3(0,0,20));
        camera.attachControl(canvas, false);
        */

       var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-100, 200, 0), scene);
       
                                        
       // This targets the camera to scene origin
       camera.setTarget(BABYLON.Vector3.Zero());
                           
       // This attaches the camera to the canvas
       camera.attachControl(canvas, true);

        scene.enablePhysics(gravityVector, physicsPlugin);

        return scene;
    }

    createLights(){
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
	    light.position = new BABYLON.Vector3(20, 40, 20);   
        light.intensity = 0.1;
        return light;
    }

    generateShadows(){
        var light = this.createLights();
         // Shadows
	    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.bias = 0.00001;
        shadowGenerator.normalBias = 0.01;

        return shadowGenerator;
    }

    createGround(name, width, length, divs){
        var ground = new BABYLON.Mesh.CreateGround(name, width, length, divs, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        ground.receiveShadows = true;
        ground.position.x = length/2;
        ground.position.z = width/2;
        return ground;
    }
}


class Obstaculo extends Scene{
	constructor(scene, name, subdivs, size, px, py, pz){
        super(scene);
        this.name = name;
        this.subdivs = subdivs;
        this.size = size;
        this.mesh = this.crearObstaculo();
        
    }
	
	crearObstaculo(){
		var obsWireMat = new BABYLON.StandardMaterial("obstaculomat", scene);
		
		//Material y Color
		obsWireMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        obsWireMat.specularColor = new BABYLON.Color3(0, 0, 0);
        obsWireMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        obsWireMat.wireframe = true;
		//Mesh
		var mesh = new BABYLON.Mesh.CreateSphere(name, this.subdivs, this.size, scene);
        //mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {mass: Math.random(), restitution: Math.random()}, scene);
		
		mesh.material = obsWireMat;
        //mesh.position.y =1;

        mesh.position = new BABYLON.Vector3(getRndInteger(1, 1), 1, getRndInteger(-5, 5));
        var shadowGenerator = this.generateShadows();
        shadowGenerator.addShadowCaster(mesh);

        mesh.receiveShadows = true;
        
        return mesh;
	}
	
	setPosition(x = 0, y = 0, z = 0){
        this.mesh.position = new BABYLON.Vector3(x, y, z);
    }
    getPosition(){
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y,this.mesh.position.z);
        //return console.log(`Position x: ${this.mesh.position.x}, y: ${this.mesh.position.y}, z: ${this.mesh.position.z}`);
    }

}


class Particula extends Scene {

    constructor(scene, name, subdivs, size){
        super(scene);
        this.name = name;
        this.subdivs = subdivs;
        this.size = size;
        this.mesh = this.crearParticula();
        this.meshLabel = this.meshLabelName();
        this.torus = this.crearToro();
    }

    
    crearParticula(){
        
        var sphereMat = new BABYLON.StandardMaterial("ground", scene);

        // Material y Color
        sphereMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random()); //(0.4, 0.4, 0.4)
        sphereMat.specularColor = new BABYLON.Color3(Math.random(),Math.random(),Math.random());
        sphereMat.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

        var mesh = new BABYLON.Mesh.CreateSphere(name, this.subdivs, this.size, scene);
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {mass: Math.random(), restitution: 0}, scene);
        mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        mesh.material = sphereMat;
        //mesh.position.y =1;
        mesh.position = new BABYLON.Vector3(getRndInteger(-1, 10), 1, getRndInteger(-10, 10));
        var shadowGenerator = this.generateShadows();
        shadowGenerator.addShadowCaster(mesh);

        mesh.receiveShadows = true;
        
        return mesh;
    }

    crearToro(){
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
    
    meshLabelName(){
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

    setPosition(x = 0, y = 0, z = 0){
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        
    }
    getPosition(){
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y,this.mesh.position.z);
    }
    setCoordinates(i){
        var cuadrante = Math.floor(Math.random() *(5 - 1)) + 1;
        if(i % 10 === 0){
            if(cuadrante === 1){
                this.moveCuadrante1(true);
            }else if(cuadrante === 2){
                this.moveCuadrante2(true);
            }else if(cuadrante === 3){
                this.moveCuadrante3(true);
            }else if(cuadrante === 4){
                this.moveCuadrante4(true);
            }
        }
    }


    moveCuadrante1(bool = false, mX = getRndInteger(0, 10), mY = 1.2, mZ = getRndInteger(0,10)){
        if(bool){
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }
    moveCuadrante2(bool = false, mX = getRndInteger(0, -10), mY = 1.2, mZ = getRndInteger(0,10)){
        if(bool){
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }
    moveCuadrante3(bool = false, mX = getRndInteger(0, -10), mY = 1.2, mZ = getRndInteger(0,-10)){
        if(bool){
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }
    moveCuadrante4(bool = false, mX = getRndInteger(0, 10), mY = 1.2, mZ = getRndInteger(0, -10)){
        if(bool){
            this.mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(mX, mY, mZ));
        }
    }

    
}


function getRndInteger(min, max){
    return Math.floor(Math.random()*(max - min + 1)) + 1;
}

