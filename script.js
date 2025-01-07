let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('startPause');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const toggleModeButton = document.getElementById('toggleMode');
const addTimeButton = document.getElementById('addTime');
const focusModal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');
const focusSubmit = document.getElementById('focus-submit');
const focusDisplay = document.getElementById('focus-display');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    minutesDisplay.textContent = minutesStr;
    secondsDisplay.textContent = secondsStr;
    document.title = `${minutesStr}:${secondsStr} - Pomodoro Timer`;
}

function startTimer() {
    if (isWorkTime) {
        focusModal.style.display = 'flex';
        return;
    }
    startTimerExecution();
}

function startTimerExecution() {
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
        }
    }, 1000);
    startPauseButton.textContent = 'Pause';
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startPauseButton.textContent = 'Start';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    focusDisplay.textContent = '';
    focusDisplay.classList.remove('has-focus');
    startPauseButton.textContent = 'Start';
    updateDisplay();
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    
    // Update mode class
    if (isWorkTime) {
        toggleModeButton.classList.remove('rest-mode');
        toggleModeButton.classList.add('work-mode');
    } else {
        toggleModeButton.classList.remove('work-mode');
        toggleModeButton.classList.add('rest-mode');
    }
    
    updateDisplay();
    focusDisplay.textContent = '';
    focusDisplay.classList.remove('has-focus');
}

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes (300 seconds)
    updateDisplay();
}

// Initialize
timeLeft = 25 * 60;
updateDisplay();

// Event listeners
startPauseButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        pauseTimer();
    }
});
resetButton.addEventListener('click', resetTimer);
toggleModeButton.addEventListener('click', () => {
    if (timerId === null) {
        toggleMode();
    }
});
addTimeButton.addEventListener('click', () => {
    if (timerId === null) {  // Only allow adding time when timer is paused
        addFiveMinutes();
    }
});

focusSubmit.addEventListener('click', () => {
    const focusText = focusInput.value.trim();
    if (focusText) {
        focusDisplay.textContent = `Focus: ${focusText}`;
        focusDisplay.classList.add('has-focus');
        focusModal.style.display = 'none';
        focusInput.value = '';
        startTimerExecution();
    }
});

window.addEventListener('click', (e) => {
    if (e.target === focusModal) {
        focusModal.style.display = 'none';
    }
});

focusInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        focusSubmit.click();
    }
}); 