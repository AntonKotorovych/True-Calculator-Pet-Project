'use strict';
const displayMain = document.getElementById('displayMain');
const displaySecondary = document.getElementById('displaySecondary');

const BUTTONS = document.querySelectorAll('.keyboard li button');

const NUMBERS = document.querySelectorAll('[data-numbers]');

let displayValue = '0';
let isDot = false;
let wasEqualResult = false;

displayMain.textContent = displayValue;

function calculateExpression(expression) {}

document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value === event.key || button.dataset.operators === event.key) button.classList.add('button--clicked');
  });
});

document.addEventListener('keyup', event => {
  if (wasEqualResult) {
    wasEqualResult = false;
    displayValue = '0';
    isDot = false;
    displayMain.textContent = displayValue;
  }
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
      let result = 0;

      // Working with results

      function calculateExpression(expression) {
        // Replacing '×' and '÷' to * and /

        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

        // Parse string in the comfortable array format to work with

        let parsedExpression = '';

        for (let i = 0; i < expression.length; i++) {
          if (expression[i] !== '+' && expression[i] !== '-' && expression[i] !== '*' && expression[i] !== '/') {
            parsedExpression += expression[i];
          } else {
            parsedExpression += ' ';
            parsedExpression += expression[i];
            parsedExpression += ' ';
          }
        }

        expression = parsedExpression.split(' ');

        // mutating expression array with calculating results * and / operands pairs

        function multiplyOrDevideOperands(expression, operator) {
          while (expression.includes(`${operator}`)) {
            for (let i = 1; i < expression.length; i += 2) {
              const currentOperator = expression[i];
              if (currentOperator === `${operator}`) {
                if (operator === '*') {
                  const multiplyResult = expression[i - 1] * expression[i + 1];
                  expression.splice(i - 1, 3, multiplyResult);
                } else if (operator === '/') {
                  const devideResult = expression[i - 1] / expression[i + 1];
                  expression.splice(i - 1, 3, devideResult);
                }
              }
            }
          }
        }

        multiplyOrDevideOperands(expression, '*');
        multiplyOrDevideOperands(expression, '/');

        // calculating result

        let result = parseFloat(expression[0]);

        for (let i = 1; i < expression.length; i += 2) {
          const operator = expression[i];
          const operand = parseFloat(expression[i + 1]);
          operator === '+' ? (result += operand) : (result -= operand);
        }
        return result;
      }

      const expressionResult = calculateExpression(displayValue);

      if (expressionResult === Infinity || expressionResult === -Infinity) {
        displayMain.textContent = 'numbers are not divisible by zero';
        displayValue = '0';
        return;
      }
      displayMain.textContent = expressionResult;
      displayValue = displayMain.textContent;
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

// document.addEventListener('mouseup', event => {
//   BUTTONS.forEach(button => {
//     if (button.value == event.target.value) {
//       button.classList.remove('button--clicked');
//       displayValue = displayValue + +event.target.value;
//       console.log(displayValue);
//     }
//   });
// });
