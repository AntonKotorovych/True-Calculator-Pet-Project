'use strict';
const displayMain = document.getElementById('displayMain');
const displaySecondary = document.getElementById('displaySecondary');

const BUTTONS = document.querySelectorAll('.keyboard li button');

const NUMBERS = document.querySelectorAll('[data-numbers]');

let displayValue = '0';

displayMain.textContent = displayValue;

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
    if (event.key === '.' && displayValue.includes('.')) {
      button.classList.remove('button--clicked');
      return;
    }

    if (button.dataset.numbers === event.key) {
      if (displayValue === '0' && event.key !== '.') displayValue = '';
      if (displayValue.endsWith('0') && displayValue.startsWith('0') && displayValue.length > 2) {
        displayValue = displayValue.replace(displayValue[displayValue.length - 1], button.dataset.numbers);
        displayMain.textContent = displayValue;
        button.classList.remove('button--clicked');
        return;
      }

      button.classList.remove('button--clicked');
      displayValue += button.dataset.numbers;
      displayMain.textContent = displayValue;
    }

    if (button.dataset.operators === event.key) {
      if (displayValue.endsWith('+') || displayValue.endsWith('-') || displayValue.endsWith('×') || displayValue.endsWith('÷')) {
        button.classList.remove('button--clicked');
        return;
      }
      button.classList.remove('button--clicked');
      displayValue += button.value;
      displayMain.textContent = displayValue;
    }

    if (button.dataset.deleting === event.key) {
      if (button.dataset.deleting === 'Backspace') {
        button.classList.remove('button--clicked');
        displayValue = displayValue.slice(0, -1);
        if (displayValue === '') displayValue = '0';
        displayMain.textContent = displayValue;
      } else {
        button.classList.remove('button--clicked');
        displayValue = '0';
        displayMain.textContent = displayValue;
      }
    }
    if (button.dataset.equal === event.key) {
      button.classList.remove('button--clicked');
      const result = eval(displayValue.replace(/×/g, '*').replace(/÷/g, '/'));
      if (result === Infinity || result === -Infinity) {
        displayMain.textContent = 'numbers are not divisible by zero';
        displayValue = '0';
        return;
      }
      displayMain.textContent = result;
      displayValue = displayMain.textContent;
    }
  });
  console.log(displayValue.length);
  if (displayValue.length >= 24) {
    BUTTONS.forEach(button => button.classList.remove('button--clicked'));
    displayValue = displayValue.slice(0, -1);
    displayMain.textContent = displayValue;
    alert('you cannot add more than 24 characters');
    return;
  }
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
