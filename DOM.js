export const divInicial = document.getElementById('divInicial');
export const explicacio = document.getElementById('explicacio');
export const explicacioP = document.getElementById('explicacioP');
export const divJugar = document.getElementById('jugar');
export const cambio = document.getElementById('basura');

import {VistaClass} from '/class/vistaclass.js';
const vista = new VistaClass();

explicacio.addEventListener('click', () => {
  vista.mostrarExplicacio();
});

divJugar.addEventListener('click', async () => {
  await vista.cuestionarJugadors();

  setTimeout(() => {
    vista.cargarMano();
  }, 200);

  setTimeout(() => {
    const cambiarTorn = document.querySelectorAll('.botoCambiarTorn');
    cambiarTorn.forEach((boto) => {
      boto.addEventListener('click', () => {
        if (boto.dataset.posible == 'true') {
          vista.cargarMano();
          vista.cambiarTorn(boto.dataset.jugador);
        }
      });
    });
    vista.dropable();
  }, 500);
});

/**
 * -
 * -
 */
/**
 * e
 * @return {int} d
 */
function getRandomPosition() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const randomX = Math.floor(Math.random() * screenWidth);
  const randomY = Math.floor(Math.random() * screenHeight);
  return [randomX, randomY];
}

/**
 * d
 * @return {int} randomScale e
 */
function getRandomScale() {
  const randomScale = Math.random() * + 0.3;
  return randomScale;
}

/**
 * d
 * @param {*} x d
 * @param {*} y d
 * @param {*} scale d
 */
function createImage(x, y, scale) {
  const image = document.createElement('img');
  image.src = 'img/logoVirus-removebg-preview.png';
  image.classList.add('image');
  image.style.left = x + 'px';
  image.style.top = y + 'px';
  image.style.transform = 'scale(' + scale + ')';
  document.getElementById('background').appendChild(image);
  image.classList.add('active');

  setTimeout(function() {
    image.classList.remove('active');
    setTimeout(function() {
      image.remove();
    }, 500);
  }, 3000);
}

document.addEventListener('click', function(event) {
  setInterval(() => {
    const position = getRandomPosition();
    createImage(position[0], position[1], getRandomScale());
  }, 1500);
});

