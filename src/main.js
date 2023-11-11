'use strict';

// general displayed string
const displayMain = document.getElementById('displayMain');

// lists and variables of button elements
const BUTTONS = document.querySelectorAll('.keyboard li button');

const NUMBERS = document.querySelectorAll('[data-component-type="number"]');
const OPERATORS = document.querySelectorAll('[data-component-type="operator"]');

const BACKSPACE = document.querySelector('[data-component-type="backspace"]');
const CLEAR = document.querySelector('[data-component-type="clear"]');

const EQUAL = document.querySelector('[data-component-type="enter"]');

// Rendering click animation functions and listeners
function pressButtonStyle(element) {
  element.classList.add('button--clicked');
}

function releaseButtonStyle(element) {
  element.classList.remove('button--clicked');
}

// rendering keyboard animation
document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value === event.key || button.dataset.operators === event.key) {
      pressButtonStyle(button);
    }
  });
});

document.addEventListener('keyup', event => {
  BUTTONS.forEach(button => {
    if (button.value === event.key || button.dataset.operators === event.key) releaseButtonStyle(button);
  });
});

// variable for tracking current pressed and released with mouse element
let targetElement = null;

// rendering mouse animation
document.addEventListener('mousedown', event => {
  if (event.target.closest('button')) {
    targetElement = event.target.closest('button');
    pressButtonStyle(event.target.closest('button'));
  }
});

document.addEventListener('mouseup', () => {
  if (targetElement) {
    releaseButtonStyle(targetElement);
    targetElement = null;
  }
});

// Main Logic

// General logic variables
let displayValue = '0';
let isDot = false;
let isResultEqual = false;
let hasFirstOperandAfterEqual = false;
let hasFirstOperatorAfterEqual = false;
const operators = ['+', '-', '×', '÷', '.'];

displayMain.textContent = displayValue;

// Numbers handler function
function numbersHandler(number) {
  if (isResultEqual) hasFirstOperandAfterEqual = true;
  if (isResultEqual && hasFirstOperandAfterEqual) {
    isResultEqual = false;
    displayValue = '';
  }

  if (displayValue === '0' && number.value !== '.') displayValue = '';
  if (displayValue.endsWith('0') && operators.includes(displayValue[displayValue.length - 2])) {
    if (number.key !== '.') {
      displayValue = displayValue.slice(0, -1).concat(number.value);
      displayMain.textContent = displayValue;
      return;
    } else {
      isDot = false;
    }
  }
  if (number.value === '.' && !isDot) {
    displayValue += number.value;
    displayMain.textContent = displayValue;
    isDot = true;
    return;
  }

  displayValue += number.value;
  displayMain.textContent = displayValue;
}

document.addEventListener('keyup', event => {
  if (isResultEqual) {
    displayMain.textContent = displayValue;
  }

  if (displayValue.length < 2) isDot = false;
  // NUMBERS

  if (event.key === '0' && displayValue === '0') {
    return;
  }
  if (event.key === '.' && operators.includes(displayValue[displayValue.length - 1])) {
    return;
  }
  if (event.key === '.' && isDot) {
    return;
  }

  if (event.key === NUMBERS.button.value) {
    console.log('number');
    numbersHandler(button);
    return;
  }

  // OPERATORS
  if (button.dataset.operators === event.key) {
    if (isResultEqual) hasFirstOperatorAfterEqual = true;
    if (isResultEqual && hasFirstOperatorAfterEqual) isResultEqual = false;
    if (operators.includes(displayValue[displayValue.length - 1])) {
      return;
    }
    isDot = false;

    displayValue += button.value;
    displayMain.textContent = displayValue;
  }

  if (button.dataset.deleting === event.key) {
    if (button.dataset.deleting === 'Backspace') {
      if (displayValue[displayValue.length - 1] === '.') isDot = false;

      displayValue = displayValue.slice(0, -1);
      if (displayValue === '') displayValue = '0';
      displayMain.textContent = displayValue;
    } else {
      isDot = false;
      isResultEqual = false;
      hasFirstOperandAfterEqual = false;
      hasFirstOperatorAfterEqual = false;

      displayValue = '0';
      displayMain.textContent = displayValue;
    }
  }
  if (button.dataset.equal === event.key) {
    if (operators.includes(displayValue[displayValue.length - 1])) return;

    // Working with results

    function calculateExpression(expression) {
      // Replacing '×' and '÷' to * and /

      const expressionString = expression.replace(/×/g, '*').replace(/÷/g, '/');

      // Parse string in the comfortable array format to work with

      function prepareMathExpression(expression) {
        let counter = 0;
        let separatedString = '';
        const operators = ['+', '-', '*', '/'];

        if (expression[0].startsWith('-')) {
          counter = 1;
          // Parsing anyway the first operand if it is negative (starts with the '-' operator)
          separatedString += expression[0];
        }
        for (counter; counter < expression.length; counter++) {
          !operators.includes(expression[counter]) ? (separatedString += expression[counter]) : (separatedString += ` ${expression[counter]} `);
        }
        return separatedString.split(' ');
      }

      const mathExpressionArray = prepareMathExpression(expressionString);
      // mutating expression array with calculating results * and / operands pairs

      function multiplyOrDivideOperands(expression, operator) {
        while (expression.includes(`${operator}`)) {
          for (let i = 1; i < expression.length; i += 2) {
            const currentOperator = expression[i];
            if (currentOperator === `${operator}`) {
              let result = 0;
              if (operator === '*') {
                result = expression[i - 1] * expression[i + 1];
              } else if (operator === '/') {
                result = expression[i - 1] / expression[i + 1];
              }
              expression.splice(i - 1, 3, result);
            }
          }
        }
      }

      multiplyOrDivideOperands(mathExpressionArray, '*');
      multiplyOrDivideOperands(mathExpressionArray, '/');

      // calculating result

      let result = parseFloat(mathExpressionArray[0]);

      for (let i = 1; i < mathExpressionArray.length; i += 2) {
        const operator = mathExpressionArray[i];
        const operand = parseFloat(mathExpressionArray[i + 1]);
        operator === '+' ? (result += operand) : (result -= operand);
      }
      return result;
    }

    const expressionResult = calculateExpression(displayValue);
    console.log(displayValue);
    console.log(expressionResult);

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

    isResultEqual = true;
  }

  if (displayValue.length >= 24) {
    BUTTONS.forEach(button => button.classList.remove('button--clicked'));
    displayValue = displayValue.slice(0, -1);
    displayMain.textContent = displayValue;
    alert('you cannot add more than 24 characters');
    return;
  }
});
