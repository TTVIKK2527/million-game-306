document.addEventListener('DOMContentLoaded', function() {
  const num1Input = document.getElementById('num1');
  const num2Input = document.getElementById('num2');
  const operatorSelect = document.getElementById('operator');
  const calculateBtn = document.getElementById('calculate-btn');
  const resultDisplay = document.getElementById('result');
  const errorDisplay = document.getElementById('error');

  calculateBtn.addEventListener('click', function() {
    errorDisplay.classList.remove('show');
    errorDisplay.textContent = '';

    const num1 = parseFloat(num1Input.value);
    const num2 = parseFloat(num2Input.value);
    const operator = operatorSelect.value;

    if (isNaN(num1) || isNaN(num2)) {
      showError('Palun sisesta mõlemad arvud korrektselt!');
      return;
    }

    if (operator === '/' && num2 === 0) {
      showError('Jagamine nulliga ei ole lubatud!');
      resultDisplay.textContent = 'Viga';
      return;
    }

    const result = calculate(num1, num2, operator);
    resultDisplay.textContent = result;
  });

  function calculate(a, b, op) {
    switch(op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return 0;
    }
  }

  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.classList.add('show');
  }
});
