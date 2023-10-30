'use strict';
const displayMain = document.getElementById('displayMain');
const displaySecondary = document.getElementById('displaySecondary');

const BUTTONS = document.querySelectorAll('.keyboard li button');

const NUMBERS = document.querySelectorAll('[data-numbers]');

let displayValue = '0';
// let result = '';

displayMain.textContent = displayValue;
// displaySecondary.textContent = result;

document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value === event.key || button.dataset.operators === event.key) button.classList.add('button--clicked');
  });
});

document.addEventListener('keyup', event => {
  BUTTONS.forEach(button => {
    if (event.key === '0' && displayValue === '0') {
      button.classList.remove('button--clicked');
      return;
    }

    if (button.dataset.numbers === event.key) {
      if (displayValue === '0') displayValue = '';
      button.classList.remove('button--clicked');
      displayValue += button.dataset.numbers;
      displayMain.textContent = displayValue;
    }

    if (button.dataset.operators === event.key) {
      if (
        displayValue.endsWith('+') ||
        displayValue.endsWith('-') ||
        displayValue.endsWith('×') ||
        displayValue.endsWith('÷') ||
        displayValue.startsWith('0')
      ) {
        button.classList.remove('button--clicked');
        return;
      }
      button.classList.remove('button--clicked');
      displayValue += button.value;
      displayMain.textContent = displayValue;
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
