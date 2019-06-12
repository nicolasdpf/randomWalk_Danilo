var arrDistancias = [], path3D;
//let temRecorrido;
class Particula extends Scene {

    constructor(scene, name, subdivs, size, segundoDeNacimiento) {
        super(scene); 
        this.name = name;
        this.subdivs = subdivs;
        this.size = size;
        this.mesh = this.crearParticula();
        this.meshLabel = this.meshLabelName();
        this.toro = this.crearToro();
        this.velocidad = 0;
        this.velMax = 0.5;
        this.velMin = 0.02;
        this.edad = 0;
        this.edadFPS = 0;
        this.recorrido = 0;
        this.temRecorrido = 0;
        this.segundoDeNacimiento = segundoDeNacimiento;
        this.interacciones = 0;
        this.boolInteractuando = false;
        this.boolInteractuandoConObstaculo = false;
    }


    crearParticula() {
        var sphereMat = new BABYLON.StandardMaterial("ground", scene);

        // Material y Color
        sphereMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random()); //(0.4, 0.4, 0.4)
        sphereMat.specularColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        sphereMat.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

        var mesh = new BABYLON.Mesh.CreateBox(name, this.size, scene);
        
        
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 0,
            restitution: 0, friction: 0
        }, scene);
        

        mesh.material = sphereMat;
        mesh.position = new BABYLON.Vector3(getRndInteger(-1, 10), 1, getRndInteger(-10, 10));
        var localOrigin = localAxes(3);
        localOrigin.parent = mesh;

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

    calcularEdad(){
        this.edad = s - this.segundoDeNacimiento;
        this.edadFPS = 0;
        if(s % 1 === 0){
            this.edadFPS = tiempo - this.edad * 60;
           // console.log(this.edadFPS);
        }
        
    }

    agregarDistanciaArray(){

        if(this.edad % 2 === 0 ){
            if(this.edadFPS === 61){
                arrDistancias.push(this.getPosition());
            }
        }
        if(arrDistancias.length > 1){
            path3D = new BABYLON.Path3D(arrDistancias);
        }
    }
    


    calcularRecorridoTotal(){
        if(this.edad % 5 === 0){
            if(this.edadFPS === 61){
                var distances = path3D.getDistances();
                distances = distances.pop();
                this.recorrido = round(distances, 1);
                //console.log(this.recorrido);
            }
        }
    }

    inicializarVariables(){
        this.agregarDistanciaArray();
        this.calcularEdad();
        this.calcularRecorridoTotal();
        if(this.edad >= 0){
            // console.log(`particula debe entrar en modo lineal`);
            this.temRecorrido = 0;
            this.setModo(0);
        }

        if (this.mesh.position.z >= groundHeight || this.mesh.position.z < 0) {
            // console.log(`particula debe cambiar dirteccion; tocó limite`);
            this.setModo(1);
        } else if (this.mesh.position.x >= groundWidth || this.mesh.position.x < 0) {
            // console.log(`particula debe cambiar dirteccion; tocó limite`);
            this.setModo(1);
        }


        if(this.boolInteractuando){
            this.setModo(2);
        }else{
            this.setModo(0);
        }
        /* if(this.boolInteractuandoConObstaculo){
            this.setModo(3);
        }else{
            this.setModo(0);
        } */

    }
    detectCollisions(visitante){
        if(this.toro.intersectsMesh(visitante.toro, true)){
            //return true;
            this.boolInteractuando = true;
        }else{
            this.boolInteractuando = false;
        }
    }
    detectObstaculo(visitante){
        if(this.toro.intersectsMesh(visitante, true)){
            
            //this.boolInteractuandoConObstaculo = true;
            this.setModo(3);
            console.log(`particula ${this.name} Colisiona con obstaculo`);
        }else{
            this.boolInteractuandoConObstaculo = false;
        }
    }
    setModo(modo){
        switch (modo) {
            case 0:
                 if(this.recorrido % 30 == 0){
                     this.setOrientation();
                 }
                
                //this.disminuirVelocidad(this.velocidad);        
                if(this.velocidad < this.velMax){
                    this.velocidad += 0.01;
                }else{
                    this.velocidad = this.velMax;
                }
                var vecAvance = new BABYLON.Vector3(0, 0, this.velocidad);
                this.avanzar(vecAvance);
                
                break;
            case 1:
                this.interacciones += 1;
                this.rotateParticle(10);
                this.setModo(0);
                break;
            case 2:
                if(this.edad % 10 === 0){
                    if(this.edadFPS === 61){
                        this.interacciones += 1;
                        this.velMax = 0.001;
                    }
                }
                if(this.velocidad > this.velMin){
                    this.velocidad -= 0.03;
                }else{
                    this.velocidad = this.velMin;
                }
                this.setOrientation(3);
                this.setModo(0);     
                break;
            case 3:
                if(this.edad % 10 === 0){
                    if(this.edadFPS === 61){
                        this.interacciones += 1;
                        this.velMax = 0.001;
                        this.setOrientation(4);
                    }
                }
                if(this.velocidad > this.velMin){
                    this.velocidad -= 0.03;
                }else{
                    this.velocidad = this.velMin;
                }
                this.setModo(0);     
                break;
            default:
                break;
        }

    }

    disminuirVelocidad(velocidad){
        do {
            this.velocidad -= 0.005;
        } while (this.velocidad < velocidad/ 2);
    }
    meshLabelName() {
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer.layerMask = 2;
        var label = new BABYLON.GUI.Rectangle("label for " + this.name);
        label.background = "black"
        label.height = "30px";
        label.alpha = 0.3;
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

    getPosition() {
        var pX = this.mesh.position.x;
        var pY = this.mesh.position.y;
        var pZ = this.mesh.position.z;
        //console.log(`${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}`)
        return new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    }

    transformPerQuat(vec) {
        var mymatrix = new BABYLON.Matrix();
        this.mesh.rotationQuaternion.toRotationMatrix(mymatrix);
        return BABYLON.Vector3.TransformNormal(vec, mymatrix);
    }

    rotateParticle(rotateStep) {
        var rotation = this.mesh.rotate(BABYLON.Axis.Y, rotateStep, BABYLON.Space.WORLD);
        this.mesh.rotation =new BABYLON.Vector3 (0,0,0);
    }

    avanzar(moveVector) {
        this.mesh.moveWithCollisions(this.transformPerQuat(moveVector));
        this.recorrido += 1;
    }

    memoriaRecorrido(){
        var position = this.getPosition();
        console.log(`${round(position.x, 3)}, ${round(position.y, 3)}, ${round(position.z, 3)}`);
    }

    setOrientation(tem = getRndInteger(1, 3) ){
        switch (tem) {
            //Izquierda
            case 1:
                this.rotateParticle(-7);
                break;
            //Derecha
            case 2:
                this.rotateParticle(7);
                break;
            //Radical
            case 3:
                this.rotateParticle(45);
                break;
            case 4:
                let temp2= getRndInteger(1, 2);
                switch (temp2) {
                    case 1:
                        this.rotateParticle(180);
                        break;
                    case 2:
                        this.rotateParticle(-180);
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }
    printInformation(particle){
        var seccion = document.getElementById("sectInfo");
        
        var div = document.createElement("div");
        div.className = particle.name;
        seccion.appendChild(div);
    }
}

