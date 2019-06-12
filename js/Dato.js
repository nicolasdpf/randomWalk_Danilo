class Dato extends Scene{
	constructor(scene, name,  size, influence){
        super(scene);
        this.name = name;
        this.size = size;
        this.mesh = this.crearDato();
        this.torus = this.crearToro();
        this.influence = influence;
    }
	
	crearDato(){
        var DatoWireMat = new BABYLON.StandardMaterial("obstaculomat", scene);
        
		//Material y Color
		DatoWireMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        DatoWireMat.specularColor = new BABYLON.Color3(1, 0, 0);
        DatoWireMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
        DatoWireMat.wireframe = true;
        DatoWireMat.alpha = 0.5;
		//Mesh
		var mesh = new BABYLON.Mesh.CreateBox(name, this.size, scene);
		
		mesh.material = DatoWireMat;

        mesh.position = new BABYLON.Vector3(getRndInteger(-500, 500), 1, getRndInteger(-500, 500));

        return mesh;
	}
    
    crearToro() {
        var torusMat = new BABYLON.StandardMaterial("texture1", scene);

        var torus = new BABYLON.Mesh.CreateTorus(this.name, 10, 0.2, 32, scene, false);

        // Material y Color
        torusMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        torusMat.specularColor = new BABYLON.Color3(1, 0, 0);
        torusMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
        torus.material = torusMat;
        torus.parent = this.mesh;

        return torus;
    }

	setDtPosition(x = 0, y = 0, z = 0){
        this.mesh.position = new BABYLON.Vector3(x, y, z);
    }
    getDtPosition(){
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y,this.mesh.position.z);
        //return console.log(`Position x: ${this.mesh.position.x}, y: ${this.mesh.position.y}, z: ${this.mesh.position.z}`);
    }
}