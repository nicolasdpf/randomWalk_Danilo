/**
 * La particula tendrá distintos modos de comportamiento que se van reconfigurando
 * a medida que va interactuando con el ambiente.
 * La idea es que la funcion retorne un valor entero, este valor indica el
 * comportamiento que dicha particula va a tomar
 * siendo:
 *  0: Modo Lineal, pasado X cantidad de recorrido, la particula reduce su velocidad a 1/4
 *      y modifica su orientación (giro entre 0 - 45°).
 *  1: Llega al limite del mapa, se detiene, retrocede y carga una nueva velocidad por tres segundos
 *      para pasar nuevamente a modo lineal
 * @param {*} particula 
 */
var particlesPopulation = [];

function crearParticula(escena, bool){
    if(inicializacion === true && poblacion === 0){
        var particula = new Particula(escena.scene, 'P' + poblacion, 16, 2, s);
        console.log("Particula creada en el segundo:", particula.segundoDeNacimiento);
        poblacion += 1;
        particlesPopulation.push(particula);   
    }

    if(inicializacion === true && poblacion < 3){
        var particula = new Particula(escena.scene, 'P' + poblacion, 16, 2, s);
        console.log("Particula creada en el segundo:", particula.segundoDeNacimiento);
        poblacion += 1;
        particlesPopulation.push(particula);   
    }
}

function vidaParticulas(){
    if(particlesPopulation.length != 0){
        for(var i = 0; i < particlesPopulation.length; i++){
            particlesPopulation[i].inicializarVariables(tiempo);
            for (let j = 0; j < particlesPopulation.length; j++) {
                if(i != j){
                    particlesPopulation[i].detectCollisions(particlesPopulation[j]);
                    particlesPopulation[j].detectCollisions(particlesPopulation[i]);
                }
            }
        }
    }
}


