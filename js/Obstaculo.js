class Obstaculo extends Scene{
	constructor(scene, name, subdivs, size, influence){
        super(scene);
        this.name = name;
        this.subdivs = subdivs;
        this.size = size;
        this.mesh = this.crearObstaculo();
        this.influence = influence;
    }
	
	crearObstaculo(){
		var obsWireMat = new BABYLON.StandardMaterial("obstaculomat", scene);
		
		//Material y Color
		obsWireMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        obsWireMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        obsWireMat.emissiveColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        obsWireMat.wireframe = true;
		//Mesh
		var mesh = new BABYLON.Mesh.CreateSphere(name, this.subdivs, this.size, scene);
        //mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {mass: Math.random(), restitution: Math.random()}, scene);
		
		mesh.material = obsWireMat;
        //mesh.position.y =1;

        mesh.position = new BABYLON.Vector3(getRndInteger(-500, 500), 1, getRndInteger(-500, 500));
        // var shadowGenerator = this.generateShadows();
        // shadowGenerator.addShadowCaster(mesh);

        // mesh.showBoundingBox = true;

        mesh.receiveShadows = true;
        
        return mesh;
	}
	
	setObPosition(x = 0, y = 0, z = 0){
        this.mesh.position = new BABYLON.Vector3(x, y, z);
    }
    getObPosition(){
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y,this.mesh.position.z);
        //return console.log(`Position x: ${this.mesh.position.x}, y: ${this.mesh.position.y}, z: ${this.mesh.position.z}`);
    }

}