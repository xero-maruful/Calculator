document.addEventListener('DOMContentLoaded', () => {
  const mainDisplay = document.getElementById('mainDisplay');
  const historyDisplay = document.getElementById('historyDisplay');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const container = document.querySelector('.calculator-container');
  const scientificPanel = document.getElementById('scientificPanel');
  const businessPanel = document.getElementById('businessPanel');
  const angleUnitBtn = document.getElementById('angleUnitBtn');

  let currentInput = '0';
  let historyInput = '';
  let isResultDisplayed = false;
  let isRadian = false;
  let grandTotal = 0;

  let costVal = null;
  let sellVal = null;

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      scientificPanel.classList.remove('show');
      businessPanel.classList.remove('show');
      container.classList.remove('scientific-active');

      if (mode === 'scientific') {
        scientificPanel.classList.add('show');
        container.classList.add('scientific-active');
      } else if (mode === 'business') {
        businessPanel.classList.add('show');
      }
    });
  });

  function appendNumber(num) {
    if (isResultDisplayed) {
      currentInput = num === '.' ? '0.' : num;
      isResultDisplayed = false;
    } else {
      if (num === '.' && currentInput.includes('.')) return;
      if (currentInput === '0' && num !== '.') {
        currentInput = num;
      } else {
        currentInput += num;
      }
    }
    updateDisplay();
  }

  function appendOperator(op) {
    if (isResultDisplayed) isResultDisplayed = false;
    currentInput += ` ${op} `;
    updateDisplay();
  }

  function updateDisplay() {
    mainDisplay.textContent = currentInput || '0';
    historyDisplay.textContent = historyInput;
  }

  function clearAll() {
    currentInput = '0';
    historyInput = '';
    isResultDisplayed = false;
    costVal = null;
    sellVal = null;
    updateDisplay();
  }

  function deleteLast() {
    if (isResultDisplayed) {
      clearAll();
      return;
    }
    currentInput = currentInput.trimEnd();
    if (currentInput.length <= 1) {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1).trimEnd();
    }
    updateDisplay();
  }

  function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  function evaluateExpression() {
    try {
      let expression = currentInput
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // সুরক্ষিত ও নির্ভুল হিসাব
      const result = Function(`'use strict'; return (${expression})`)();

      if (isNaN(result) || !isFinite(result)) {
        currentInput = 'Error';
      } else {
        historyInput = currentInput + ' =';
        const formattedResult = Number(result.toFixed(8)).toString();
        grandTotal += Number(result);
        currentInput = formattedResult;
      }
      isResultDisplayed = true;
      updateDisplay();
    } catch {
      currentInput = 'Error';
      updateDisplay();
    }
  }

  document.querySelector('.calc-keypad').addEventListener('click', (e) => {
    const target = e.target;
    if (!target.classList.contains('btn')) return;

    if (target.dataset.num !== undefined) {
      appendNumber(target.dataset.num);
      return;
    }

    if (target.dataset.op) {
      appendOperator(target.dataset.op);
      return;
    }

    const action = target.dataset.action;

    switch (action) {
      case 'clear':
        clearAll();
        break;

      case 'delete':
        deleteLast();
        break;

      case 'calculate':
        evaluateExpression();
        break;

      case 'percent':
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
        break;

      case 'sqrt':
        historyInput = `√(${currentInput})`;
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;

      case 'sin':
      case 'cos':
      case 'tan': {
        const val = parseFloat(currentInput);
        const rad = isRadian ? val : (val * Math.PI) / 180;
        let res;
        if (action === 'sin') res = Math.sin(rad);
        if (action === 'cos') res = Math.cos(rad);
        if (action === 'tan') res = Math.tan(rad);
        historyInput = `${action}(${currentInput})`;
        currentInput = Number(res.toFixed(8)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;
      }

      case 'deg-rad':
        isRadian = !isRadian;
        angleUnitBtn.textContent = isRadian ? 'Rad' : 'Deg';
        break;

      case 'ln':
        historyInput = `ln(${currentInput})`;
        currentInput = Math.log(parseFloat(currentInput)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;

      case 'log':
        historyInput = `log(${currentInput})`;
        currentInput = Math.log10(parseFloat(currentInput)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;

      case 'pow':
        appendOperator('**');
        break;

      case 'sqr':
        historyInput = `sqr(${currentInput})`;
        currentInput = Math.pow(parseFloat(currentInput), 2).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;

      case 'fact':
        historyInput = `${currentInput}!`;
        currentInput = factorial(parseInt(currentInput)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;

      case 'inv':
        historyInput = `1/(${currentInput})`;
        currentInput = (1 / parseFloat(currentInput)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;

      case 'pi':
        appendNumber(Math.PI.toFixed(6));
        break;

      case 'e':
        appendNumber(Math.E.toFixed(6));
        break;

      case 'open-paren':
        appendNumber('(');
        break;

      case 'close-paren':
        appendNumber(')');
        break;

      case 'abs':
        currentInput = Math.abs(parseFloat(currentInput)).toString();
        updateDisplay();
        break;

      case 'tax-plus': {
        const base = parseFloat(currentInput);
        historyInput = `${base} + 15% TAX`;
        currentInput = (base * 1.15).toFixed(2).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;
      }

      case 'tax-minus': {
        const base = parseFloat(currentInput);
        historyInput = `${base} − 15% TAX`;
        currentInput = (base / 1.15).toFixed(2).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;
      }

      case 'cost':
        costVal = parseFloat(currentInput);
        historyInput = `Cost: ${costVal}`;
        currentInput = '0';
        updateDisplay();
        break;

      case 'sell':
        sellVal = parseFloat(currentInput);
        historyInput = `Sell: ${sellVal}`;
        currentInput = '0';
        updateDisplay();
        break;

      case 'margin':
        if (costVal !== null && sellVal !== null) {
          const margin = (((sellVal - costVal) / sellVal) * 100).toFixed(2);
          historyInput = `Cost: ${costVal}, Sell: ${sellVal}`;
          currentInput = `Margin: ${margin}%`;
          isResultDisplayed = true;
          costVal = null;
          sellVal = null;
        } else {
          currentInput = 'Set Cost & Sell';
        }
        updateDisplay();
        break;

      case 'gt':
        historyInput = 'Grand Total';
        currentInput = Number(grandTotal.toFixed(4)).toString();
        isResultDisplayed = true;
        updateDisplay();
        break;
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
    } else if (e.key === '+') {
      appendOperator('+');
    } else if (e.key === '-') {
      appendOperator('-');
    } else if (e.key === '*') {
      appendOperator('×');
    } else if (e.key === '/') {
      appendOperator('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      evaluateExpression();
    } else if (e.key === 'Backspace') {
      deleteLast();
    } else if (e.key === 'Escape') {
      clearAll();
    }
  });
});