'use strict';
import calculateExpression from './calculateExpression.js';

const displayMain = document.getElementById('displayMain');

const BUTTONS = document.querySelectorAll('.keyboard li button');

let displayValue = '0';
let isDot = false;
let wasEqualResult = false;
let firstOperandAfterEqual = false;
let firstOperatorAfterEqual = false;

displayMain.textContent = displayValue;

document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value === event.key || button.dataset.operators === event.key) button.classList.add('button--clicked');
  });
});

document.addEventListener('keyup', event => {
  if (wasEqualResult) {
    displayMain.textContent = displayValue;
  }

  if (displayValue.length < 2) isDot = false;

  BUTTONS.forEach(button => {
    if (event.key === '0' && displayValue === '0') {
      button.classList.remove('button--clicked');
      return;
    }
    if (
      event.key === '.' &&
      (displayValue[displayValue.length - 1] === '+' ||
        displayValue[displayValue.length - 1] === '-' ||
        displayValue[displayValue.length - 1] === '×' ||
        displayValue[displayValue.length - 1] === '÷')
    ) {
      button.classList.remove('button--clicked');
      return;
    }
    if (event.key === '.' && isDot) {
      button.classList.remove('button--clicked');
      return;
    }
    if (button.dataset.numbers === event.key) {
      if (wasEqualResult) firstOperandAfterEqual = true;
      if (wasEqualResult && firstOperandAfterEqual) {
        wasEqualResult = false;
        displayValue = '';
      }

      if (displayValue === '0' && event.key !== '.') displayValue = '';
      if (
        displayValue.endsWith('0') &&
        (displayValue[displayValue.length - 2] === '+' ||
          displayValue[displayValue.length - 2] === '-' ||
          displayValue[displayValue.length - 2] === '×' ||
          displayValue[displayValue.length - 2] === '÷' ||
          displayValue[displayValue.length - 2] === '.')
      ) {
        if (event.key !== '.') {
          displayValue = displayValue.slice(0, -1).concat(button.dataset.numbers);
          displayMain.textContent = displayValue;
          button.classList.remove('button--clicked');
          return;
        } else {
          isDot = false;
          button.classList.remove('button--clicked');
        }
      }
      if (event.key === '.' && !isDot) {
        displayValue += button.dataset.numbers;
        displayMain.textContent = displayValue;
        isDot = true;
        button.classList.remove('button--clicked');
        return;
      }
      button.classList.remove('button--clicked');
      displayValue += button.dataset.numbers;
      displayMain.textContent = displayValue;
    }

    if (button.dataset.operators === event.key) {
      if (wasEqualResult) firstOperatorAfterEqual = true;
      if (wasEqualResult && firstOperatorAfterEqual) wasEqualResult = false;
      if (
        displayValue.endsWith('+') ||
        displayValue.endsWith('-') ||
        displayValue.endsWith('×') ||
        displayValue.endsWith('÷') ||
        displayValue.endsWith('.')
      ) {
        button.classList.remove('button--clicked');
        return;
      }
      isDot = false;
      button.classList.remove('button--clicked');
      displayValue += button.value;
      displayMain.textContent = displayValue;
    }

    if (button.dataset.deleting === event.key) {
      if (button.dataset.deleting === 'Backspace') {
        if (displayValue[displayValue.length - 1] === '.') isDot = false;
        button.classList.remove('button--clicked');
        displayValue = displayValue.slice(0, -1);
        if (displayValue === '') displayValue = '0';
        displayMain.textContent = displayValue;
      } else {
        isDot = false;
        wasEqualResult = false;
        firstOperandAfterEqual = false;
        firstOperatorAfterEqual = false;
        button.classList.remove('button--clicked');
        displayValue = '0';
        displayMain.textContent = displayValue;
      }
    }
    if (button.dataset.equal === event.key) {
      button.classList.remove('button--clicked');

      if (
        displayValue[displayValue.length - 1] === '+' ||
        displayValue[displayValue.length - 1] === '-' ||
        displayValue[displayValue.length - 1] === '×' ||
        displayValue[displayValue.length - 1] === '÷' ||
        displayValue[displayValue.length - 1] === '.'
      )
        return;

      // Working with results

      const expressionResult = calculateExpression(displayValue);

      if (expressionResult === Infinity || expressionResult === -Infinity) {
        displayMain.textContent = 'numbers are not divisible by zero';
        displayValue = '0';
        return;
      }

      displayMain.textContent = expressionResult;
      displayValue = displayMain.textContent;

      if (displayValue.includes('.')) {
        isDot = true;
      } else {
        isDot = false;
      }

      wasEqualResult = true;
    }
  });
  if (displayValue.length >= 24) {
    BUTTONS.forEach(button => button.classList.remove('button--clicked'));
    displayValue = displayValue.slice(0, -1);
    displayMain.textContent = displayValue;
    alert('you cannot add more than 24 characters');
    return;
  }
});
