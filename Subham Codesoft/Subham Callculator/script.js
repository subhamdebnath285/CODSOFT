document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentInput = '';
    let currentOperator = '';
    let previousInput = '';
    let expression = '';
    let isResultDisplayed = false;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    let oscillator;
    let gainNode;

    function initializeAudioContext() {
        audioCtx = new AudioContext();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
    }

    function playSound() {
        if (!audioCtx) {
            initializeAudioContext();
        }
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    }

    function appendNumber(number) {
        if (isResultDisplayed) {
            clearDisplay();
            isResultDisplayed = false;
        }
        currentInput += number;
        expression += number;
        updateDisplay();
        playSound();
    }

    function appendOperator(operator) {
        if (currentInput !== '') {
            if (currentOperator !== '') {
                calculate();
            }
            previousInput = currentInput;
            currentInput = '';
            currentOperator = operator;
            expression += ' ' + operator + ' ';
            updateDisplay();
        }
        playSound();
    }

    function calculate() {
        if (currentInput !== '' && previousInput !== '' && currentOperator !== '') {
            let result;
            switch (currentOperator) {
                case '+':
                    result = parseFloat(previousInput) + parseFloat(currentInput);
                    break;
                case '-':
                    result = parseFloat(previousInput) - parseFloat(currentInput);
                    break;
                case '*':
                    result = parseFloat(previousInput) * parseFloat(currentInput);
                    break;
                case '/':
                    result = parseFloat(previousInput) / parseFloat(currentInput);
                    break;
                case '^':
                    result = Math.pow(parseFloat(previousInput), parseFloat(currentInput));
                    break;
                case '√':
                    result = Math.sqrt(parseFloat(currentInput));
                    break;
                case '!':
                    result = factorial(parseFloat(currentInput));
                    break;
                case 'sin':
                    result = Math.sin(parseFloat(currentInput));
                    break;
                case 'cos':
                    result = Math.cos(parseFloat(currentInput));
                    break;
                case 'tan':
                    result = Math.tan(parseFloat(currentInput));
                    break;
                case 'abs':
                    result = Math.abs(parseFloat(currentInput));
                    break;
                case 'asin':
                    result = Math.asin(parseFloat(currentInput));
                    break;
                case 'acos':
                    result = Math.acos(parseFloat(currentInput));
                    break;
                case 'atan':
                    result = Math.atan(parseFloat(currentInput));
                    break;
                case '%':
                    result = parseFloat(previousInput) * (parseFloat(currentInput) / 100);
                    break;
                case 'ln':
                    result = Math.log(parseFloat(currentInput));
                    break;
                case 'log':
                    result = Math.log10(parseFloat(currentInput));
                    break;
                case '∛':
                    result = Math.cbrt(parseFloat(currentInput));
                    break;
                case 'degToRad':
                    result = parseFloat(currentInput) * (Math.PI / 180);
                    break;
            }
            currentInput = result.toString();
            currentOperator = '';
            previousInput = '';
            expression = currentInput;
            updateDisplay();
            isResultDisplayed = true;
            playSound();
        }
    }

    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function clearDisplay() {
        currentInput = '';
        currentOperator = '';
        previousInput = '';
        expression = '';
        updateDisplay();
        playSound();
    }

    function updateDisplay() {
        if (expression.length > 12) {
            display.textContent = expression.substring(expression.length - 12);
        } else {
            display.textContent = expression || '0';
        }
    }

    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('onclick');
            if (action) {
                eval(action);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key >= '0' && key <= '9') {
            appendNumber(key);
        } else if (key === '.') {
            appendNumber(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '^') {
            appendOperator(key);
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Backspace') {
            clearDisplay();
        }
    });

    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
    });
});