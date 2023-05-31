/* eslint-disable  */
import { divJugar, divInicial, explicacioP, explicacio, cambio } from '../DOM.js';
import { Game } from './Game.js';

/**
 * Esta es la clase vista, se encarga de
 * todo lo que tiene que ver con los cambios
 * en la vista de la pagina
 */
export class VistaClass {
  /**
   * Para construir
   */
  constructor() {
    this.game;
  }

  mostrarExplicacio() {
    divJugar.style.left = '150%';
    divJugar.style.opacity = '0';
    divInicial.style.top = '15%';
    explicacio.style.width = '70%';
    explicacioP.style.display = 'grid';
  }

  async cuestionarJugadors() {
    const { value: jugadors } = await Swal.fire({
      title: 'Que tipo de partida quieres jugar?',
      input: 'select',
      inputOptions: {
        '2players': '2 jugadores',
        '3players': '3 Jugadores',
        '4players': '4 Jugadores',
        '1player1computer': '1 vs Maquina'
      },
      inputPlaceholder: 'Selecciona los jugadores',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === '2players') {
            this.iniciarJoc(2, false);
            resolve();
          } else if (value === '3players') {
            this.iniciarJoc(3, false);
            resolve();
          } else if (value === '4players') {
            this.iniciarJoc(4, false);
            resolve();
          } else if (value === '1player1computer') {
            //this.iniciarJoc(2, true);
            Swal.fire(`Ho sentim, encara no es posible jugar contra la maquina`);
          } else {
            resolve('Necesitas elegir alguna opcion :)');
          }
        });
      },
    });

    if (jugadors) {
      Swal.fire(`You selected: ${jugadors}`);
    }
  }

  iniciarJoc(numjugadors, maquina) {
    this.game = new Game(numjugadors, maquina);
    explicacio.style.display = 'none';
    divJugar.style.display = 'none';

    this.game.comenzarJuego(numjugadors);
    this.crearDivJugadors(numjugadors);
    this.cargarMano();
    setTimeout(() => {
      this.cambiarTorn(numjugadors)
    }, 110);
  }

  crearDivJugadors(numjugadors) {
    const lateralDret = document.getElementById('lateralDret');
    const lateralEsquerre = document.getElementById('lateralEsquerre');
    for (let i = 1; i <= parseInt(numjugadors); i++) {
      const divJugador = document.createElement('div');
      divJugador.id = `jugador${i}Div`;

      divJugador.innerHTML = `
                    <div class="titulo">
                        <p>JUGADOR ${i} </p>
                        <input type="button" value="ACABA" class="botoCambiarTorn" data-jugador="${i}" data-posible="false">
                    </div>

                    <div class="mano">
                        <div class="carta" draggable="true" 
                          data-idcarta data-jugador="${i}"></div>
                        <div class="carta" draggable="true" 
                          data-idcarta data-jugador="${i}"></div>
                        <div class="carta" draggable="true" 
                          data-idcarta data-jugador="${i}"></div>
                    </div>

                    <div class="mesa">
                        <div class="carta" data-dropzone="true" data-inmune="false"
                          data-idcarta data-jugador="${i}"></div>
                        <div class="carta" data-dropzone="true" data-inmune="false"
                          data-idcarta data-jugador="${i}"></div>
                        <div class="carta" data-dropzone="true" data-inmune="false"
                          data-idcarta data-jugador="${i}"></div>
                        <div class="carta" data-dropzone="true" data-inmune="false"
                          data-idcarta data-jugador="${i}"></div>
                    </div>
                    
            `;
      if (i === 1) {
        lateralDret.appendChild(divJugador);
      } else if (i === 2 && numjugadors == 4 ) {
        lateralDret.appendChild(divJugador);
      } else {
        lateralEsquerre.appendChild(divJugador);

      }
    }
  }

  cargarMano() {
    setTimeout(() => {
      for (let jugador = 0; jugador < parseInt(this.game.NJugadores); jugador++) {
        const manoV = document.querySelectorAll(`#jugador${jugador + 1}Div .mano .carta`);
        for (let carta = 0; carta < this.game.jugadores[jugador].Mano.length && carta < manoV.length; carta++) {
          manoV[carta].style.backgroundImage = this.game.jugadores[jugador].Mano[carta].showCard();
          manoV[carta].dataset.idcarta = this.game.jugadores[jugador].Mano[carta].id;
          manoV[carta].dataset.draggable = true;

        }
      }
    }, 100);
  }

  // cargarMesa() {
  //   const mesaV = document.querySelectorAll(`#jugador${2}Div .mesa .carta`);
  //   for (let carta = 0; carta < this.game.jugadores[1].Mesa.length && carta < mesaV.length; carta++) {
  //     mesaV[carta].style.backgroundImage = this.game.jugadores[1].Mesa[carta].showCard();
  //     mesaV[carta].dataset.idcarta = this.game.jugadores[1].Mesa[carta].id;
  //   }
  // }

  dropable() {
    const mesaV = document.querySelectorAll('.mesa .carta');
    const manoV = document.querySelectorAll('.mano .carta');
    const game = this.game;
    let cartaMano = null;
    let self = this;

    manoV.forEach((cartaManoElement) => {
      cartaManoElement.addEventListener('dragstart', function (event) {
        // Al començar a arrastrar la carta guardem els atributs en lobjecte de transferencia de dades
        cambio.style.display = 'block';
        cartaMano = cartaManoElement;

        const cartaspropias = document.querySelectorAll(`#jugador${cartaMano.dataset.jugador}Div .mesa .carta`);
        const cartasRivales = document.querySelectorAll(`.mesa .carta:not(#jugador${cartaMano.dataset.jugador}Div .mesa .carta)`);

        if (game.jugadores[cartaMano.dataset.jugador - 1].obtenirTipo(cartaMano.dataset.idcarta) === 'Organo') {
          if (game.jugadores[cartaMano.dataset.jugador - 1].mazoAmbOrgan(cartaMano.dataset.idcarta) === false) {
            cartaspropias.forEach((cartaposible) => {
              if (cartaposible.dataset.idcarta === '' && cartaposible.dataset.dropzone === 'true') {
                cartaposible.style.border = '2px dashed black';
                cartaposible.style.boxShadow = '0px 0px 10px black';
              }
            });
          }
        } else if (game.jugadores[cartaMano.dataset.jugador - 1].obtenirTipo(cartaMano.dataset.idcarta) === 'Medicina') {

          cartaspropias.forEach((cartaposible) => {
            if (game.jugadores[cartaposible.dataset.jugador - 1].obtenirColor(cartaposible.dataset.idcarta)
              == game.jugadores[cartaMano.dataset.jugador - 1].obtenirColor(cartaMano.dataset.idcarta)
              || game.jugadores[cartaMano.dataset.jugador - 1].obtenirColor(cartaMano.dataset.idcarta) == 'Multicolor'
              || game.jugadores[cartaposible.dataset.jugador - 1].obtenirColor(cartaposible.dataset.idcarta) == 'Multicolor') {
              if (cartaposible.dataset.inmune == 'false') {
                if (game.jugadores[cartaposible.dataset.jugador - 1].obtenirTipo(cartaposible.dataset.idcarta) == 'Organo' && cartaposible.dataset.dropzone === 'true') {
                  cartaposible.style.border = '2px dashed black';
                  cartaposible.style.boxShadow = '0px 0px 10px black';
                }
              }
            }
          });
        } else if (game.jugadores[cartaMano.dataset.jugador - 1].obtenirTipo(cartaMano.dataset.idcarta) === 'Virus') {
          cartasRivales.forEach((cartaposible) => {
            if (game.jugadores[cartaposible.dataset.jugador - 1].obtenirTipo(cartaposible.dataset.idcarta) === 'Organo') {

              if (game.jugadores[cartaposible.dataset.jugador - 1].obtenirColor(cartaposible.dataset.idcarta)
                == game.jugadores[cartaMano.dataset.jugador - 1].obtenirColor(cartaMano.dataset.idcarta)
                || game.jugadores[cartaMano.dataset.jugador - 1].obtenirColor(cartaMano.dataset.idcarta) == 'Multicolor'
                || game.jugadores[cartaposible.dataset.jugador - 1].obtenirColor(cartaposible.dataset.idcarta) == 'Multicolor') {
                if (cartaposible.dataset.inmune == 'false' && cartaposible.dataset.dropzone === 'true') {
                  cartaposible.style.border = '2px dashed black';
                  cartaposible.style.boxShadow = '0px 0px 10px black';
                }
              }

            }
          });
        }
      });

      cartaManoElement.addEventListener('dragend', function (event) {
        event.preventDefault();
        cambio.style.display = 'none';
        cartaMano = null;

        const cartasPosibles = document.querySelectorAll(`#jugador${cartaManoElement.dataset.jugador}Div .mesa .carta`);
        cartasPosibles.forEach((cartaposible) => {
          cartaposible.style.border = '';
          cartaposible.style.boxShadow = '';
        });
        const cartasRivales = document.querySelectorAll(`.mesa .carta:not(#jugador${cartaManoElement.dataset.jugador}Div .mesa .carta)`);
        cartasRivales.forEach((cartaposible) => {
          cartaposible.style.border = '';
          cartaposible.style.boxShadow = '';
        });
      });
    });

    mesaV.forEach((cartaMesa) => {
      cartaMesa.addEventListener('dragover', function (event) {
        // Treiem el comportament prederminat del drag drop per que es pugui deixar la carta
        event.preventDefault();

      });

      cartaMesa.addEventListener('drop', function (event) {
        // Treiem el comportament prederminat del drag drop per que es pugui deixar la carta
        event.preventDefault();

        // Obtenim els atributs guardats en la trasferencia de dades
        const idMano = cartaMano.dataset.idcarta;
        const jugadorMano = cartaMano.dataset.jugador;

        const jugadorMesa = cartaMesa.dataset.jugador;

        // if per poder posar la carta la propia taula del jugador
        if (cartaMesa.dataset.dropzone == 'true') {
          if (cartaMesa.dataset.inmune == 'false') {
            if (jugadorMano === jugadorMesa) {
              if (game.jugadores[jugadorMano - 1].obtenirTipo(idMano) === 'Organo' && cartaMesa.dataset.idcarta === '') {

                if (game.jugadores[jugadorMano - 1].mazoAmbOrgan(idMano) === false) {
                  self.posarOrgan(cartaMano, cartaMesa);
                  game.afeguirCartaMesa(jugadorMano - 1, idMano);
                  game.eliminarCartaMano(jugadorMano - 1, idMano);
                  game.donarCarta(game.jugadores[jugadorMano - 1]);
                  game.jugadores[jugadorMano - 1].comprovarMesa();
                  self.cambiarTorn(jugadorMano);
                }


              } else if (game.jugadores[jugadorMano - 1].obtenirTipo(idMano) === 'Medicina'
                && (game.jugadores[jugadorMano - 1].obtenirColor(idMano) === game.jugadores[jugadorMesa - 1].obtenirColor(cartaMesa.dataset.idcarta)
                  || game.jugadores[jugadorMano - 1].obtenirColor(idMano) === 'Multicolor'
                  || game.jugadores[jugadorMesa - 1].obtenirColor(cartaMesa.dataset.idcarta) === 'Multicolor')) {

                self.apendMedicina(cartaMano, cartaMesa);
                game.eliminarCartaMano(jugadorMano - 1, idMano);
                game.donarCarta(game.jugadores[jugadorMano - 1]);
                game.jugadores[jugadorMano - 1].comprovarMesa();
                self.cambiarTorn(jugadorMano);
              }
            } else {
              if (game.jugadores[jugadorMano - 1].obtenirTipo(idMano) === 'Virus'
                && game.jugadores[jugadorMesa - 1].obtenirTipo(cartaMesa.dataset.idcarta) === 'Organo'
                && (game.jugadores[jugadorMano - 1].obtenirColor(idMano) === game.jugadores[jugadorMesa - 1].obtenirColor(cartaMesa.dataset.idcarta)
                  || game.jugadores[jugadorMano - 1].obtenirColor(idMano) === 'Multicolor'
                  || game.jugadores[jugadorMesa - 1].obtenirColor(cartaMesa.dataset.idcarta) === 'Multicolor')
              ) {

                self.apendVirus(cartaMano, cartaMesa);
                game.eliminarCartaMano(jugadorMano - 1, idMano);
                game.donarCarta(game.jugadores[jugadorMano - 1]);
                game.jugadores[jugadorMano - 1].comprovarMesa();
                self.cambiarTorn(jugadorMano);
              }
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'MOVIMENT INVALID',
              text: 'Aquesta carta es inmune'
            })
          }
        } else {
          console.log("moviment invalid")
        }
      });
    });

    cambio.addEventListener('dragover', function dragover(event) {
      event.preventDefault();
    });

    cambio.addEventListener('drop', function (event) {
      const mesa = document.querySelectorAll(` .mesa .carta`);
      mesa.forEach(carta => {
        carta.dataset.dropzone = false;
      });
      const boto = document.querySelector(`#jugador${cartaMano.dataset.jugador}Div .botoCambiarTorn`);
      boto.dataset.posible = "true";

      event.preventDefault();
      event.stopPropagation();

      const idMano = cartaMano.dataset.idcarta;
      const jugadorMano = cartaMano.dataset.jugador;
      cartaMano.dataset.idcarta = ''
      cartaMano.style.backgroundImage = '';

      game.eliminarCartaMano(jugadorMano - 1, idMano);
      game.donarCarta(game.jugadores[jugadorMano - 1]);
    });


  }

  posarOrgan(divMano, divMesa) {
    divMesa.dataset.idcarta = divMano.dataset.idcarta;
    divMesa.style.backgroundImage = `url("img/${this.game.jugadores[divMano.dataset.jugador - 1].obtenirTipo(divMano.dataset.idcarta) + this.game.jugadores[divMano.dataset.jugador - 1].obtenirColor(divMano.dataset.idcarta)}.svg")`;
  }

  /**
   * e
   * @param {*} divMano 
   * @param {*} divMesa 
   */
  apendMedicina(divMano, divMesa) {
    let nuevoDiv = divMano.cloneNode(true); // Clonar el div existente
    const divHijo = divMesa.querySelector('div');
    if (divHijo !== null) {
      if (this.game.jugadores[divMano.dataset.jugador - 1].obtenirTipo(divHijo.dataset.idcarta) == 'Virus') {
        this.game.eliminarCartaMesa(divMesa.dataset.jugador - 1, divHijo.dataset.idcarta)
        this.game.jugadores[divMesa.dataset.jugador - 1].eliminarCarta(divHijo.dataset.idcarta)

        divHijo.remove();
      } else {
        //this.game.eliminarCartaMesa(divMesa.dataset.jugador - 1, divHijo.dataset.idcarta)
        this.game.afeguirCartaMesa(divMano.dataset.jugador - 1, divMano.dataset.idcarta);
        divMesa.appendChild(nuevoDiv); // Agregar el nuevo div al div contenedor (divMesa)
        this.game.jugadores[divMesa.dataset.jugador - 1].convertirInmune(divMesa.dataset.idcarta)
        divMesa.dataset.inmune = 'true';
        if (divMano.dataset.jugador == '1') {
          nuevoDiv.style.transform = "translateY(-20px) translateX(-20px)"; // Modificar los estilos del nuevo div
        } else {
          nuevoDiv.style.transform = "translateY(20px) translateX(20px)"; // Modificar los estilos del nuevo div
        }
        nuevoDiv.style.position = 'absolute'
      }
    } else {
      this.game.afeguirCartaMesa(divMesa.dataset.jugador - 1, divMano.dataset.idcarta);
      divMesa.appendChild(nuevoDiv); // Agregar el nuevo div al div contenedor (divMesa)
      if (divMano.dataset.jugador == '1') {
        nuevoDiv.style.transform = "translateY(-10px) translateX(-10px)"; // Modificar los estilos del nuevo div
      } else {
        nuevoDiv.style.transform = "translateY(10px) translateX(10px)"; // Modificar los estilos del nuevo div
      }
      nuevoDiv.style.position = 'absolute'
    }


  }

  apendVirus(divMano, divMesa) {
    let nuevoDiv = divMano.cloneNode(true); // Clonar el div existente
    const divHijo = divMesa.querySelector('div');
    if (divHijo !== null) {
      if (this.game.jugadores[divMesa.dataset.jugador - 1].obtenirTipo(divHijo.dataset.idcarta) == 'Medicina') {
        //this.game.eliminarCartaMesa(divMesa.dataset.jugador - 1, divHijo.dataset.idcarta)
        this.game.jugadores[divMesa.dataset.jugador - 1].eliminarCarta(divHijo.dataset.idcarta)

        divHijo.remove();
      } else {
        this.game.jugadores[divMesa.dataset.jugador - 1].eliminarCarta(divHijo.dataset.idcarta)
        this.game.jugadores[divMesa.dataset.jugador - 1].eliminarCarta(divMesa.dataset.idcarta)
        divHijo.remove();
        divMesa.dataset.idcarta = '';
        divMesa.style.backgroundImage = '';
      }
    } else {
      this.game.afeguirCartaMesa(divMesa.dataset.jugador - 1, divMano.dataset.idcarta);
      divMesa.appendChild(nuevoDiv); // Agregar el nuevo div al div contenedor (divMesa)
      if (divMano.dataset.jugador != '1') {
        nuevoDiv.style.transform = "translateY(-10px) translateX(-10px)"; // Modificar los estilos del nuevo div
      } else {
        nuevoDiv.style.transform = "translateY(10px) translateX(10px)"; // Modificar los estilos del nuevo div
      }
      nuevoDiv.style.position = 'absolute'
    }
  }


  cambiarTorn(jugador) {
    const cartasJugador = document.querySelectorAll(`#jugador${jugador}Div .mano .carta`);
    cartasJugador.forEach(carta => {
      carta.draggable = false;
      carta.style.filter = 'brightness(10) opacity(0.4)'
    });

    let jugadorSeguent = parseInt(jugador) + 1;
    if (jugadorSeguent > this.game.NJugadores) {
      jugadorSeguent = 1;
    }
    const cartasSeguent = document.querySelectorAll(`#jugador${jugadorSeguent}Div .mano .carta`);
    cartasSeguent.forEach(carta => {
      carta.draggable = true;
      carta.style.filter = 'none'
    });
    const mesa = document.querySelectorAll(`.mesa .carta`);
    mesa.forEach(carta => {
      carta.dataset.dropzone = true;
    });
    const boto = document.querySelector(`#jugador${jugador}Div .botoCambiarTorn`);
    boto.dataset.posible = "false";

    if (this.game.maquina == true && jugadorSeguent == 2) {
      this.game.jugarMaquina();

      this.cargarMano();
      this.cargarMesa();
      this.cambiarTorn(2);
    } else {
      this.cargarMano();
    }
  }
}
