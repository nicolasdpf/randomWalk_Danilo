class Ground extends Scene {
    constructor(scene, name, xmax, zmax, y){
        super(scene);
        this.name = name;
        this.xmax = xmax;
        this.zmax = zmax;
        this.meshGround = this.createTiledGround(this.xmax, this.zmax);
        this.y = y;
    }

    createTiledGround(xmax, zmax) {
        xmax = this.xmax;
        zmax = this.zmax;
        var xmin = -1;
        var zmin = -1;
        var precision = {
            "w": 0,
            "h": 0
        };
        var subdivisions = {
            'h': 20,
            'w': 20
        };

        var tiledGround = new BABYLON.Mesh.CreateTiledGround("name", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
        tiledGround.showBoundingBox = true;
        tiledGround.position.y = -1.1;
    
        
        tiledGround.physicsImpostor = new BABYLON.PhysicsImpostor(tiledGround, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0
        }, scene);
        tiledGround.receiveShadows = true;
        
        var sphereMat = new BABYLON.StandardMaterial("ground", scene);

        // Material y Color
        //sphereMat.diffuseColor = new BABYLON.Color3(0.4, 0, 0); //(0.4, 0.4, 0.4)
        //sphereMat.specularColor = new BABYLON.Color3(0,0,0);
        sphereMat.emissiveColor = new BABYLON.Color3(0.0,0.0,0.0);

        tiledGround.material = sphereMat;
        return tiledGround;
    }

}

