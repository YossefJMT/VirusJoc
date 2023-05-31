/* eslint-disable  */

class Carta {
  constructor(id, tipo, color, descripcion) {
    this.id = id;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.color = color;
    this.cartaEnBaraja = true;
  }

  cambiarCarta() {
    // Implementación de la función para cambiar la carta
  }

  getReverse() {
    return '/img/Reverse.svg';
  }

  showCard() {
    const ruta = `url(img/${this.tipo + this.color}.svg)`;
    return ruta;
  }

  listarMetodos() {
    for (const propiedad in this) {
      if (typeof this[propiedad] === 'function') {
        console.log(`Función ${propiedad}: `, this[propiedad]);
      }
    }
  }
}

class Organo extends Carta {
  constructor(id, color, descripcion) {
    super(id, 'Organo', color, descripcion);
    this.inmune = false
    this.medicina1 = undefined;
    this.medicina2 = undefined;
    this.virus1 = undefined;
    }
}

class Virus extends Carta {
  constructor(id, color, descripcion) {
    super(id, 'Virus', color, descripcion);
  }
}

class Medicina extends Carta {
  constructor(id, color, descripcion) {
    super(id, 'Medicina', color, descripcion);
  }
}

export class Deck {
  cartes = [];

  constructor() {
    this.cartes;
    this.cartaSiguiente = 0;
  }

  generarDeck() {
    const descripcionOrgano = 'Esto es un organo, necesitas completar de los 4 colores o 3 y un multicolor sin estar infectadas para ganar';
    const descripcionVirus = 'Esto es un virus, infecta a los demas jugadores para que no consigan ganarte';
    const descripcionMedicina = 'Esto es un medicina, si infectan tus cartas podras sanarlas aunque si consigues darle dos medicinas a una carta la haras inmune';
    let id=0;

    for (let i = 1; i <= 5; i++) {
      this.cartes.push(new Organo(`${id++}`, 'Verde', descripcionOrgano));
      this.cartes.push(new Organo(`${id++}`, 'Azul', descripcionOrgano));
      this.cartes.push(new Organo(`${id++}`, 'Rojo', descripcionOrgano));
      this.cartes.push(new Organo(`${id++}`, 'Amarillo', descripcionOrgano));
    }
    this.cartes.push(new Organo(`organoMulticolor`, 'Multicolor', descripcionOrgano));


    for (let i = 1; i <= 4; i++) {
      this.cartes.push(new Virus(`${id++}`, 'Verde', descripcionVirus));
      this.cartes.push(new Virus(`${id++}`, 'Azul', descripcionVirus));
      this.cartes.push(new Virus(`${id++}`, 'Rojo', descripcionVirus));
      this.cartes.push(new Virus(`${id++}`, 'Amarillo', descripcionVirus));

      this.cartes.push(new Medicina(`${id++}`, 'Verde', descripcionMedicina));
      this.cartes.push(new Medicina(`${id++}`, 'Azul', descripcionMedicina));
      this.cartes.push(new Medicina(`${id++}`, 'Rojo', descripcionMedicina));
      this.cartes.push(new Medicina(`${id++}`, 'Amarillo', descripcionMedicina));
      this.cartes.push(new Medicina(`${id++}`, 'Multicolor', descripcionMedicina));
    }
    this.cartes.push(new Virus(`${id++}`, 'Multicolor', descripcionVirus));
    console.log('s\'ha creat la baralla de la partida');
  }


  deckShuffle() {
    this.cartes.sort(() => Math.random() - 0.5);
  }
}


