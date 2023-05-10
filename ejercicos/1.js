class Contador {
    constructor(responsable){
        this.responsable = responsable
        this.contador = 0
    }

    static contadorGlobal = 0

    getResponsable = ()=>{
        return this.responsable
    }
    contar = ()=>{
        this.contador++
        Contador.contadorGlobal++
    }

    getCuentaIndividual = ()=>{
        return this.contador
    }
    getCuentaGLobal = ()=>{
        return Contador.contadorGlobal
    }

}

const cuenta1 = new Contador("maria")
cuenta1.contar()
cuenta1.contar()
cuenta1.contar()

console.log(cuenta1.getCuentaGLobal())
console.log(cuenta1.getCuentaIndividual())

const cuenta2 = new Contador("juan")
cuenta2.contar()
cuenta2.contar()

console.log(cuenta2.getCuentaGLobal())
console.log(cuenta2.getCuentaIndividual())