'use strict';
const displayMain = document.getElementById('displayMain');
const displaySecondary = document.getElementById('displaySecondary');

const BUTTONS = document.querySelectorAll('.keyboard li button');

const NUMBERS = document.querySelectorAll('[data-numbers]');

let displayValue = 0;
let result = '';

displayMain.innerHTML = displayValue;
displaySecondary.innerHTML = result;

document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value == event.key) button.classList.add('button--clicked');
  });
});

document.addEventListener('keyup', event => {
  if (displayValue === 0) displayValue = '';
  BUTTONS.forEach(button => {
    if (button.dataset.numbers === event.key) {
      button.classList.remove('button--clicked');
      displayValue += button.dataset.numbers;
      displayMain.innerHTML = displayValue;
    }
  });
});

// document.addEventListener('mouseup', event => {
//   BUTTONS.forEach(button => {
//     if (button.value == event.target.value) {
//       button.classList.remove('button--clicked');
//       displayValue = displayValue + +event.target.value;
//       console.log(displayValue);
//     }
//   });
// });
