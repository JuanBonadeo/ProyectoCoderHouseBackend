class TicketManager {
    #precioBaseganancia = 0.15
    constructor(){
        this.eventos = []
    }
    returnEventos(){
        return this.eventos
    }
    crearEventos(nombre,lugar,precio,capacidad=50, fecha= new Date().toLocaleDateString()){
        const evento = {
            nombre,
            lugar,
            precio: precio + precio* this.#precioBaseganancia,
            capacidad,
            fecha,
            participantes: []
        }
        if(this.eventos.length === 0){
            evento.id = 1
        }else {
            evento.id = this.eventos[this.eventos.length-1].id + 1
        }
        this.eventos.push(evento)
    }
    agregarUsuario(idUsuario, idEvento){
        const eventoIndex = this.eventos.findIndex(evento=>evento.id === idEvento)
        if (eventoIndex == -1){ // -1 para cunadop no ecuentra ningun evento
            console.log("evento no existe papa")
        }
        this.eventos[eventoIndex].participantes.push(idUsuario)
    }
}

const  nuevoProducto = new TicketManager();
manejadorDeEventos.crearEventos('evento 1', 'Baires', 5, 50000)
manejadorDeEventos.agregarUsuario(100,1)
console.log(manejadorDeEventos.returnEventos())