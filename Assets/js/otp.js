
let timeInSeconds = 60;
    let timerInterval;

    function updateTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = timeInSeconds;
        timeInSeconds--;

        if (timeInSeconds < 0) {
            clearInterval(timerInterval);
            document.getElementById('timerLabel').textContent = 'Time Expired';
           return showResendButton();
        }
    }

    function showResendButton() {
         const submitButton=document.getElementById('submitButton')
         submitButton.style.display='none';
        const resendBtnContainer = document.getElementById('resendBtnContainer');
        resendBtnContainer.style.display = 'block';

        const resendBtn = document.getElementById('resendBtn');
        resendBtn.addEventListener('click', handleResendClick);
    }

    function handleResendClick() {
        // Add logic to resend OTP
        // For now, let's reset the timer and simulate a new OTP being sent
        resetTimer();
        console.log('Resending OTP...');
    }

    function resetTimer() {
        timeInSeconds = 60;
        document.getElementById('timerLabel').textContent = 'Time Remaining: <span id="timer">60</span> seconds';
        hideResendButton();
        startTimer();
    }

    function hideResendButton() {
        const resendBtnContainer = document.getElementById('resendBtnContainer');
        resendBtnContainer.style.display = 'none';
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Start the timer initially
    startTimer();