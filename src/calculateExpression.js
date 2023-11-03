export default function calculateExpression(expression) {
  // Replacing '×' and '÷' to * and /

  expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

  // Parse string in the comfortable array format to work with

  function splitExpressionString(expression) {
    let counter = 0;
    let separatedString = '';

    if (expression[0].startsWith('-')) {
      counter = 1;
      // Parsing anyway the first operand if it is negative (starts with the '-' operator)
      separatedString += expression[0];
    }
    for (counter; counter < expression.length; counter++) {
      if (expression[counter] !== '+' && expression[counter] !== '-' && expression[counter] !== '*' && expression[counter] !== '/') {
        separatedString += expression[counter];
      } else {
        separatedString += ' ';
        separatedString += expression[counter];
        separatedString += ' ';
      }
    }
    return separatedString;
  }

  const parsedExpression = splitExpressionString(expression);

  const expressionArray = parsedExpression.split(' ');
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

  multiplyOrDevideOperands(expressionArray, '*');
  multiplyOrDevideOperands(expressionArray, '/');

  // calculating result

  let result = parseFloat(expressionArray[0]);

  for (let i = 1; i < expressionArray.length; i += 2) {
    const operator = expressionArray[i];
    const operand = parseFloat(expressionArray[i + 1]);
    operator === '+' ? (result += operand) : (result -= operand);
  }
  return result;
}
