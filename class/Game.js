/* eslint-disable  */

import { Deck } from './DeckAndCard.js';
import { Jugador } from './Jugador.js';

/**
 * Esta es la clase Game, se encarga de
 * juntar todas las clases y hacerlas
 * encajar de forma logica
 */
export class Game {
  /**
   * El constructor de la clase game,
   * en el juego solo hay dos o tres jugadores,
   * pero está pensado para que pueda soportar más
   * por si en caso futuro se quiera agregar
   * @param {int} jugadores
   */
  constructor(jugadores, maquina) {
    this.NJugadores = jugadores;
    this.jugadores = [];
    this.baraja = new Deck();
    this.TurnoCarta = 0;
    this.maquina = maquina;
  }

  comenzarJuego() {
    this.crearBaraja();
  }

  crearBaraja() {
    this.baraja.generarDeck();
    this.baraja.deckShuffle();
    console.log(this.baraja);

    this.crearJugadores();
  }

  crearJugadores() {
    for (let i = 1; i <= this.NJugadores; i++) {
      this.jugadores.push(new Jugador('jugador' + i));
    }
    this.repartirInicial();
  }

  repartirInicial() {
    for (let i = 0; i < this.jugadores.length; i++) {
      for (let numCarta = 0; numCarta < 3; numCarta++) {
        let cartatrobada = false;
        while (cartatrobada === false) {
          if (this.baraja.cartes[this.TurnoCarta].cartaEnBaraja == true) {
            this.jugadores[i].Mano.push(this.baraja.cartes[this.TurnoCarta]);
            this.baraja.cartes[this.TurnoCarta].cartaEnBaraja = false;
            cartatrobada = true;
          }
          this.TurnoCarta++;
        }
      }
    }
    console.log(this.jugadores);
  }

  afeguirCartaMesa(jugador, idCarta) {
    this.baraja.cartes.forEach(carta => {
      if (carta.id === idCarta) {
        carta.cartaEnBaraja = false;
        this.jugadores[jugador].Mesa.push(carta)
      }
    });
  }

  eliminarCartaMano(jugador, idCarta) {
    for (let cartanum = 0; cartanum < this.jugadores[jugador].Mano.length; cartanum++) {
      if (this.jugadores[jugador].Mano[cartanum].id === idCarta) {
        this.jugadores[jugador].Mano.splice(cartanum, 1);
        console.log('carta eliminada')
        console.log(this.jugadores)
      }
    }
    this.posarCartaABaraja(idCarta)
  }

  eliminarCartaMesa(jugador, idCarta) {
    for (let cartanum = 0; cartanum < this.jugadores[jugador].Mesa.length; cartanum++) {
      if (this.jugadores[jugador].Mesa[cartanum].id === idCarta) {
        this.jugadores[jugador].Mesa.splice(cartanum, 1);
      }
    }
    this.posarCartaABaraja(idCarta)
  }

  donarCarta(jugador) {

    let cartatrobada = false;
    while (cartatrobada == false) {
      if (this.baraja.cartes[this.TurnoCarta].cartaEnBaraja == true) {
        jugador.Mano.push(this.baraja.cartes[this.TurnoCarta]);
        this.baraja.cartes[this.TurnoCarta].cartaEnBaraja = false;
        cartatrobada = true;
        break;
      }
      this.TurnoCarta++;
      if (this.TurnoCarta == 58) {
        this.TurnoCarta = 0;
      }
    }
  }

  posarCartaABaraja(idCarta) {
    this.baraja.cartes.forEach((element) => {
      if (element.id === idCarta) {
        element.cartaEnBaraja = true;
      }
    });
  }

  // jugarMaquina() {
  //   let maquinaJugada = false;
  //   for (let carta = 0; carta < this.jugadores[1].Mano.length && maquinaJugada == false; carta++) {
  //     const cartaMaquina = this.jugadores[1].Mano[carta];

  //     if (this.jugadores[1].obtenirTipo(cartaMaquina.id) == 'Organo') {
  //       if (this.jugadores[1].mazoAmbOrgan(cartaMaquina.id) == false) {
  //         this.afeguirCartaMesa(1, cartaMaquina.id)
  //         maquinaJugada = true;
  //       } else if (this.jugadores[1].mazoAmbOrgan(cartaMaquina.id) == false) {
  //         maquinaJugada = true;
  //         this.eliminarCartaMano(1, cartaMaquina.id)
  //       }
  //     } else if (this.jugadores[1].obtenirTipo(cartaMaquina.id) == 'Medicina') {
  //       for (let carta = 0; carta < this.jugadores[1].Mesa.length && maquinaJugada == false; carta++) {
  //         const cartaMesa = this.jugadores[1].Mesa[carta];
  //         if (this.jugadores[1].obtenirColor(cartaMesa.id) == this.jugadores[1].obtenirColor(cartaMaquina.id)) {
  //           this.afeguirCartaMesa(1, cartaMaquina.id);
  //           maquinaJugada = true;
  //         }
  //       }
  //     } else if (this.jugadores[1].obtenirTipo(cartaMaquina.id) == 'Virus') {
  //       for (let jugador = 0; jugador < this.jugadores.length && maquinaJugada == false; jugador++) {
  //         const mesa = this.jugadores[jugador].Mesa;
  //         mesa.forEach(cartaMesa => {
  //           if (this.jugadores[1].obtenirTipo(cartaMesa.id) == 'Organo' && maquinaJugada == false) {
  //             if (this.jugadores[1].obtenirColor(cartaMaquina.id) == this.jugadores[1].obtenirColor(cartaMesa.id)) {
  //               this.afeguirCartaMesa(1, cartaMaquina.id);
  //               maquinaJugada = true;
  //             }
  //           }
  //         });
  //       }
  //     }
  //   }

  //   if (maquinaJugada == false) {
  //     console.log('eliminar carta y afegir carta')
  //     this.eliminarCartaMano(1, this.jugadores[1].Mano[1].id)
  //     this.donarCarta(this.jugadores[1])
  //     this.jugadores[1].comprovarMesa();
  //   }
  //   console.log('maquina jugada')
  // }
}
