/* eslint-disable  */   
export class Jugador {
  constructor(name) {
    this.name = name;
    this.Mano = [];
    this.Mesa = [];
  }

  obtenirTipo(idEntrat) {
    let carta = null;
    for (let cartanum = 0; cartanum < this.Mano.length; cartanum++) {
      if (this.Mano[cartanum].id == idEntrat) {
        carta = this.Mano[cartanum];
      }
    }
    for (let cartanum = 0; cartanum < this.Mesa.length; cartanum++) {
      if (this.Mesa[cartanum].id == idEntrat) {
        carta = this.Mesa[cartanum];
      }
    }
    if (carta !== null) {
      return carta.tipo;
    }
    return null;
  }

  obtenirColor(idEntrat) {
    let carta = null;
    for (let cartanum = 0; cartanum < this.Mano.length; cartanum++) {
      if (this.Mano[cartanum].id == idEntrat) {
        carta = this.Mano[cartanum];
      }
    }
    for (let cartanum = 0; cartanum < this.Mesa.length; cartanum++) {
      if (this.Mesa[cartanum].id == idEntrat) {
        carta = this.Mesa[cartanum];
      }
    }
    if (carta !== null) {
      return carta.color;
    }
    return null;
  }

  // comprova si al mazo hi ha un organ del mateix color que l'id entrat, es per el dragstart
  mazoAmbOrgan(idEntrat){
    const color = this.obtenirColor(idEntrat);
    for (let cartanum = 0; cartanum < this.Mesa.length; cartanum++) {
      if (this.Mesa[cartanum].color == color && this.Mesa[cartanum].tipo == 'Organo') {
        return true;
      }
    }
    return false;
  }

  comprovarInmune(idEntrat){
    for (let cartanum = 0; cartanum < this.Mesa.length; cartanum++) {
      if (this.Mesa[cartanum].id == idEntrat && this.Mesa[cartanum].inmune == true) {
        return true
      }
    }
    return false;
  }

  convertirInmune(idEntrat){
    for (let cartanum = 0; cartanum < this.Mesa.length; cartanum++) {
      if (this.Mesa[cartanum].id == idEntrat && this.Mesa[cartanum].tipo == 'Organo') {
        this.Mesa[cartanum].inmune = true;
      }
    }
  }

  eliminarCarta(idEntrat) {
    console.log(this.Mano);
    for (let cartanum = 0; cartanum < this.Mano.length; cartanum++) {
      if (this.Mano[cartanum].id === idEntrat) {
        this.Mano.splice(cartanum, 1);
        console.log('carta eliminada');
      }
    }
    for (let cartanum = 0; cartanum < this.Mesa.length; cartanum++) {
      if (this.Mesa[cartanum].id === idEntrat) {
        this.Mesa.splice(cartanum, 1);
        console.log('carta eliminada');
      }
    }
    // this.Mano.splice(1, 2);
  }

  async comprovarMesa(){    
    let organosColores = new Set();
    let virusEncontrados = false;
    
    for (const carta of this.Mesa) {
      if (carta.tipo === 'Organo') {
        organosColores.add(carta.color);
      } else if (carta.tipo === 'Virus') {
        virusEncontrados = true;
        break;
      }
    }
    if (organosColores.size === 4 && !virusEncontrados) {
      await Swal.fire(
        'Buen trabajo!',
        `El ${this.name} HA GANADO`,
        'success'
      )
      location.reload();
    }    
  }
}
