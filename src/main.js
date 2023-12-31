'use strict';

// general displayed string
const displaySection = document.querySelector('.display-section');
const displayContainer = document.querySelector('.display');

const displayMain = document.getElementById('displayMain');

// lists and variables of button elements
const BUTTONS = document.querySelectorAll('.keyboard li button');

const NUMBERS = Array.from(document.querySelectorAll('[data-component-type="number"]'));
const OPERATORS = Array.from(document.querySelectorAll('[data-component-type="operator"]'));

const BACKSPACE = document.querySelector('[data-component-type="backspace"]');
const CLEAR = document.querySelector('[data-component-type="clear"]');

const EQUAL = document.querySelector('[data-component-type="enter"]');

// default font-size function

function defaultDisplayFontSize() {
  displayMain.style.fontSize = '3.5rem';
}

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
    if (button.value === event.key) {
      pressButtonStyle(button);
    }
  });
});

document.addEventListener('keyup', event => {
  BUTTONS.forEach(button => {
    if (button.value === event.key) releaseButtonStyle(button);
  });
});

// variable for tracking current pressed and released with mouse element for rendering animation
let targetElement = null;

// rendering mouse animation
document.addEventListener('mousedown', event => {
  const closestButton = event.target.closest('button');
  if (closestButton) {
    targetElement = closestButton;
    pressButtonStyle(closestButton);
  }
});

document.addEventListener('mouseup', () => {
  if (targetElement) {
    releaseButtonStyle(targetElement);
    targetElement = null;
  }
});

// ---- Main Logic ----:

// General logic variables
const defaultFontSize = 16;
const maxFontSizeInRem = 3.5;

let displayValue = '0';
let isDot = false;
let isResultEqual = false;
let hasFirstOperandAfterEqual = false;
let hasFirstOperatorAfterEqual = false;
const operators = ['+', '-', '×', '÷'];
displayMain.textContent = displayValue;

// Numbers handler function
function numbersHandler(element) {
  if (isResultEqual) {
    hasFirstOperandAfterEqual = true;
  }
  if (isResultEqual && hasFirstOperandAfterEqual && element.value !== '.') {
    isResultEqual = false;
    displayValue = '';
    defaultDisplayFontSize();
  }
  if (isResultEqual && !displayValue.includes('.')) {
    isResultEqual = false;
    isDot = true;
  }

  if (displayValue === '0' && element.value !== '.') displayValue = '';

  if (displayValue.endsWith('0') && operators.includes(displayValue[displayValue.length - 2])) {
    if (element.value !== '.') {
      displayValue = displayValue.slice(0, -1).concat(element.value);
      displayMain.textContent = displayValue;
      return;
    } else {
      isDot = false;
    }
  }

  if (element.value === '.' && !isDot) {
    displayValue += element.value;
    displayMain.textContent = displayValue;
    isDot = true;
    return;
  }

  displayValue += element.value;
  displayMain.textContent = displayValue;
}

// Operators handler function
function operatorsHandler(element) {
  if (isResultEqual) hasFirstOperatorAfterEqual = true;
  if (isResultEqual && hasFirstOperatorAfterEqual) isResultEqual = false;

  if (operators.includes(displayValue[displayValue.length - 1])) {
    return;
  }

  isDot = false;

  displayValue += element.textContent;
  displayMain.textContent = displayValue;
}

// Backspace (deleting last element) function
function backspaceHandler() {
  if (displayValue[displayValue.length - 1] === '.') isDot = false;

  displayValue = displayValue.slice(0, -1);
  if (displayValue === '') displayValue = '0';
  displayMain.textContent = displayValue;
}

// Clear characters function
function clearHandler() {
  isDot = false;
  isResultEqual = false;
  hasFirstOperandAfterEqual = false;
  hasFirstOperatorAfterEqual = false;

  defaultDisplayFontSize();
  displayValue = '0';
  displayMain.textContent = displayValue;
}

// Equal results function
function equalHandler() {
  // Working with results
  function calculateExpression(expression) {
    // Replacing '×' and '÷' to * and /
    let expressionString = expression.replace(/×/g, '*').replace(/÷/g, '/');
    const operators = ['+', '-', '*', '/'];

    if (operators.includes(expressionString[expressionString.length - 1])) expressionString = expressionString.slice(0, -1);

    // Parse string in the comfortable array format to work with
    function prepareMathExpression(expression) {
      let counter = 0;
      let separatedString = '';

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
    return Number(result.toFixed(10));
  }

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

  isResultEqual = true;
}

// Max characters checking function

function checkMaxLength() {
  BUTTONS.forEach(button => releaseButtonStyle(button));
  displayValue = displayValue.slice(0, -1);
  displayMain.textContent = displayValue;
  alert('you cannot add more than 24 characters');
  return;
}

// initial validation function
let isValidationReturned = false;

function initialValidation(value) {
  if (isResultEqual) {
    displayMain.textContent = displayValue;
  }

  if (displayValue.length < 2) isDot = false;

  if (displayValue === '0' && value === '-') {
    displayValue = '-';
    displayMain.textContent = displayValue;
  }

  if (value === '0' && displayValue === '0') {
    isValidationReturned = true;
    return;
  }

  if (value === '.' && operators.includes(displayValue[displayValue.length - 1])) {
    isValidationReturned = true;
    return;
  }

  if (value === '.' && isDot) {
    isValidationReturned = true;
    return;
  }

  isValidationReturned = false;
}

function changeFontSize() {
  const displaySectionWidth = displaySection.offsetWidth;
  const displayContainerWidth = displayContainer.offsetWidth;

  const currentFontSizeInRem = parseFloat(window.getComputedStyle(displayMain).fontSize) / defaultFontSize;

  if (displayContainerWidth + 8 > displaySectionWidth) {
    displayMain.style.fontSize = `${currentFontSizeInRem - 0.2}rem`;
  }

  if (displayContainerWidth + 8 < displaySectionWidth && currentFontSizeInRem < maxFontSizeInRem) {
    if (displayValue.length > 15) return;
    displayMain.style.fontSize = `${currentFontSizeInRem + 0.2}rem`;
  }
}

// -- KEYBOARD LOGIC --

document.addEventListener('keyup', event => {
  // VALIDATION CHECK

  initialValidation(event.key);
  if (isValidationReturned) return;

  // MAX LENGTH
  if (displayValue.length >= 24 && event.key !== 'Backspace' && event.key !== 'c') {
    checkMaxLength();
    return;
  }

  // BACKSPACE
  if (event.key === BACKSPACE.value) {
    backspaceHandler();
    changeFontSize();
    return;
  }

  // CLEAR
  if (event.key === CLEAR.value) {
    clearHandler();
    changeFontSize();
    return;
  }

  // EQUAL
  if (event.key === EQUAL.value) {
    equalHandler();
    changeFontSize();
    return;
  }

  // NUMBERS

  const currentNumber = NUMBERS.find(number => event.key === number.value);

  if (currentNumber) {
    numbersHandler(currentNumber);
    changeFontSize();
    return;
  }

  // OPERATORS

  const currentOperator = OPERATORS.find(operator => event.key === operator.value);

  if (currentOperator) {
    operatorsHandler(currentOperator);
    changeFontSize();
    return;
  }
});

// -- MOUSE LOGIC --

let currentClickedButton = null;

document.addEventListener('mousedown', event => {
  const closestButton = event.target.closest('button');
  closestButton ? (currentClickedButton = closestButton) : (currentClickedButton = null);
});

document.addEventListener('mouseup', () => {
  if (currentClickedButton === null) return;

  // Validation Checking
  initialValidation(currentClickedButton.value);
  if (isValidationReturned) return;

  // MAX LENGTH
  if (displayValue.length >= 24 && currentClickedButton.value !== 'Backspace' && currentClickedButton.value !== 'c') {
    checkMaxLength();
    return;
  }

  // BACKSPACE
  if (currentClickedButton.value === BACKSPACE.value) {
    backspaceHandler();
    changeFontSize();
    return;
  }

  // CLEAR
  if (currentClickedButton.value === CLEAR.value) {
    clearHandler();
    changeFontSize();
    return;
  }

  // EQUAL
  if (currentClickedButton.value === EQUAL.value) {
    equalHandler();
    changeFontSize();
    return;
  }

  // NUMBERS

  const currentNumber = NUMBERS.find(number => currentClickedButton.value === number.value);

  if (currentNumber) {
    numbersHandler(currentNumber);
    changeFontSize();
    return;
  }

  // OPERATORS

  const currentOperator = OPERATORS.find(operator => currentClickedButton.value === operator.value);

  if (currentOperator) {
    operatorsHandler(currentOperator);
    changeFontSize();
    return;
  }
});
