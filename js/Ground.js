class Ground extends Scene {
    constructor(scene, name){
        super(scene);
        this.name = name;
        this.meshGround = this.createTiledGround();
    }

    createTiledGround() {
        var xmin = -1;
        var zmin = -1;
        var xmax = 501;
        var zmax = 501;
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
        tiledGround.position.y = -1;
        
        tiledGround.physicsImpostor = new BABYLON.PhysicsImpostor(tiledGround, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0
        }, scene);
        tiledGround.receiveShadows = true;
        //showNormals(tiledGround, 0.3, new BABYLON.Color3(1, 0, 0))
     
        /* tiledGround.updateFacetData();
        var positions = tiledGround.getFacetLocalPositions();
        var normals = tiledGround.getFacetLocalNormals();
        var lines = [];

        var datas = [];
        for (var i = 0; i < positions.length; i++) {
            var line = [ positions[i], positions[i].add(normals[i]) ];
            lines.push(line);

            //datas.push(new BABYLON.Mesh.CreateBox("Data "+ i, 0.5))
            datas.push(positions[i]);
        }

        var lineSystem = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines}, scene);
        lineSystem.color = BABYLON.Color3.Green();

        console.log(`normales: ${normals.length}`); */
        return tiledGround;
    }

}

