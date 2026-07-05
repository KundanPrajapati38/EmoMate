// static/js/companion-ui.js (Final Version)

document.addEventListener('DOMContentLoaded', () => {

    // -- DOM Elements --
    let currentCompanionGender = null;
    const selectButtons = document.querySelectorAll('.select-btn');
    const interactionContainer = document.querySelector('.interaction-container');
    const emotionalStateContainer = document.querySelector('.emotional-state-container');
    const companionSelectionContainer = document.querySelector('.companion-selection-container');
    const selectedAvatar = document.getElementById('selected-avatar');
    const companionName = document.getElementById('companion-name');
    const currentEmotionIcon = document.getElementById('current-emotion-icon');
    const currentEmotionText = document.getElementById('current-emotion-text');
    const targetEmotion = document.getElementById('target-emotion');
    const setTargetBtn = document.getElementById('set-target-btn');
    const emotionProgress = document.getElementById('emotion-progress');
    const progressText = document.getElementById('progress-text');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    const emotionIcons = { 'Happy': '<i class="fas fa-face-laugh-beam text-warning"></i>', 'Sad': '<i class="fas fa-face-sad-tear text-info"></i>', 'Angry': '<i class="fas fa-face-angry text-danger"></i>', 'Neutral': '<i class="fas fa-face-meh text-secondary"></i>', 'Surprise': '<i class="fas fa-face-surprise text-primary"></i>', 'Fear': '<i class="fas fa-face-grimace text-dark"></i>', 'Disgust': '<i class="fas fa-face-frown text-success"></i>', 'calm': '<i class="fas fa-face-smile text-info"></i>', 'energetic': '<i class="fas fa-face-grin-stars text-danger"></i>', 'focused': '<i class="fas fa-face-meh text-primary"></i>', 'relaxed': '<i class="fas fa-face-smile-relaxed text-success"></i>' };

    // Gender selection buttons
    const genderSelectButtons = document.querySelectorAll('.select-btn');

    function disableGenderSelectionButtons() {
        genderSelectButtons.forEach(button => {
            button.disabled = true;
            console.log(`Disabling button: ${button.getAttribute('data-companion')}, disabled: ${button.disabled}`);
        });
    }

    function enableGenderSelectionButtons() {
        genderSelectButtons.forEach(button => {
            button.disabled = false;
            console.log(`Enabling button: ${button.getAttribute('data-companion')}, disabled: ${button.disabled}`);
        });
    }

    // -- Event Listeners with Null Checks --

    if (selectButtons.length > 0) {
        selectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const companionType = button.getAttribute('data-companion');
                if (companionType === 'female') {
                    selectedAvatar.className = 'companion-avatar female-avatar';
                    companionName.textContent = 'Sophia';
                    currentCompanionGender = 'female';
                } else {
                    selectedAvatar.className = 'companion-avatar male-avatar';
                    companionName.textContent = 'Ethan';
                    currentCompanionGender = 'male';
                }
                // companionSelectionContainer.style.display = 'none'; // Removed this line
                disableGenderSelectionButtons(); // Disable gender selection buttons when a default model is selected
                interactionContainer.style.display = 'block';
                emotionalStateContainer.style.display = 'block';
                setTimeout(() => {
                    const welcomeMessage = `Hi, I'm ${companionName.textContent}! How can I help you today?`;
                    addCompanionMessage(welcomeMessage);
                    if (typeof speakText === 'function') speakText(welcomeMessage, companionType);
                }, 500);
                if (typeof setAvatarModel === 'function') setAvatarModel(companionType);
                if (typeof startAvatar === 'function') startAvatar();
            });
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', window.sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.sendMessage();
        });
    }
    
    if (setTargetBtn) {
        setTargetBtn.addEventListener('click', () => {
            const target = targetEmotion.value;
            progressText.textContent = `Working toward: ${target.charAt(0).toUpperCase() + target.slice(1)}`;
            emotionProgress.style.width = '10%';
            const goalMessage = `Great! I'll help you feel more ${target}. Let's work on this together.`;
            addCompanionMessage(goalMessage);
            if (typeof speakText === 'function') speakText(goalMessage, companionType);
        });
    }

    // Custom Model Upload Logic
    const customModelUpload = document.getElementById('custom-model-upload');
    const uploadModelBtn = document.getElementById('upload-model-btn');
    const customModelStatus = document.getElementById('custom-model-status');
    const resetModelBtn = document.getElementById('reset-model-btn');

    if (uploadModelBtn && customModelUpload) {
        uploadModelBtn.addEventListener('click', () => {
            customModelUpload.click(); // Trigger the hidden file input
        });

        customModelUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log('Selected file:', file.name);
                if (typeof loadCustomModel === 'function') {
                    loadCustomModel(file);
                    if (customModelStatus) customModelStatus.style.display = 'block';
                    if (resetModelBtn) resetModelBtn.style.display = 'block';
                    disableGenderSelectionButtons(); // Disable gender selection buttons
                } else {
                    console.error('loadCustomModel function not found in companion-3d.js');
                }
            }
        });
    }

    if (resetModelBtn) {
        resetModelBtn.addEventListener('click', () => {
            if (typeof resetToDefaultModel === 'function') {
                resetToDefaultModel(currentCompanionGender);
                if (customModelStatus) customModelStatus.style.display = 'none';
                if (resetModelBtn) resetModelBtn.style.display = 'none';
                enableGenderSelectionButtons(); // Enable gender selection buttons
            } else {
                console.error('resetToDefaultModel function not found in companion-3d.js');
            }
        });
    }

    // -- Functions --
    
    function addUserMessage(message) {
        if (chatMessages) {
            chatMessages.innerHTML = ''; // Clear previous messages
            const messageElement = document.createElement('div');
            messageElement.className = 'message user-message animate__animated animate__fadeInRight';
            messageElement.innerHTML = `<div class="message-content">${message}</div>`;
            chatMessages.appendChild(messageElement);
        }
    }

    function addCompanionMessage(message) {
        if (chatMessages) {
            chatMessages.innerHTML = ''; // Clear previous messages
            const messageElement = document.createElement('div');
            messageElement.className = 'message companion-message animate__animated animate__fadeInLeft';
            messageElement.innerHTML = `<div class="message-content">${message}</div>`;
            chatMessages.appendChild(messageElement);
        }
    }

    async function processUserMessage(message) { try { const response = await fetch('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }), }); if (!response.ok) { throw new Error('Network response was not ok'); } const data = await response.json(); const aiReply = data.reply; const detectedEmotionValue = data.emotion; addCompanionMessage(aiReply); updateEmotionUI(detectedEmotionValue); if (typeof speakText === 'function') speakText(aiReply, currentCompanionGender); updateProgress(); } catch (error) { console.error('Error:', error); const errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later."; addCompanionMessage(errorMessage); if (typeof speakText === 'function') speakText(errorMessage, currentCompanionGender); } }
    function updateEmotionUI(emotion) { if (!currentEmotionIcon || !currentEmotionText) return; const emotionKey = emotion in emotionIcons ? emotion : 'Neutral'; currentEmotionIcon.innerHTML = emotionIcons[emotionKey]; currentEmotionText.textContent = emotion; }
    function updateProgress() {
        if (!emotionProgress || !progressText) return;
        const currentWidth = parseInt(emotionProgress.style.width) || 0;
        const newWidth = Math.min(currentWidth + 15, 100);
        emotionProgress.style.width = `${newWidth}%`;
        if (newWidth >= 100) {
            progressText.textContent = 'Goal achieved! Well done!';
            const congratsMessage = "Congratulations! You've made great progress. How do you feel now?";
            addCompanionMessage(congratsMessage);
            if (typeof speakText === 'function') speakText(congratsMessage, currentCompanionGender);
            fetchAndRenderEmotionHistory(); // Update chart when goal is achieved
        }
    }

    let emotionChart = null; // To store the Chart.js instance

    async function fetchAndRenderEmotionHistory() {
        try {
            const response = await fetch('/emotion_history');
            if (!response.ok) {
                throw new Error('Failed to fetch emotion history');
            }
            const history = await response.json();

            if (history.length > 0) {
                document.querySelector('.emotional-progress-report-container').style.display = 'block';
                const labels = history.map(entry => new Date(entry.timestamp).toLocaleString());
                const emotions = history.map(entry => entry.emotion);

                const emotionCounts = {};
                emotions.forEach(emotion => {
                    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
                });

                const chartLabels = Object.keys(emotionCounts);
                const chartData = Object.values(emotionCounts);

                const ctx = document.getElementById('emotion-chart').getContext('2d');

                if (emotionChart) {
                    emotionChart.destroy(); // Destroy existing chart before creating a new one
                }

                emotionChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Emotion Frequency',
                            data: chartData,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(255, 159, 64, 0.6)',
                                'rgba(199, 199, 199, 0.6)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(199, 199, 199, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Detections'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Emotion'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Your Emotional Journey Over Time'
                            }
                        }
                    }
                });
                document.querySelector('.emotional-progress-report-container').style.display = 'block';
            } else {
                document.querySelector('.emotional-progress-report-container').style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching or rendering emotion history:', error);
            document.querySelector('.emotional-progress-report-container').style.display = 'none';
        }
    }

    // --- UPDATED FUNCTIONS ---
    window.sendMessage = function() { if (userInput) { const message = userInput.value.trim(); if (message) { addUserMessage(message); userInput.value = ''; processUserMessage(message); } } }
    // --- END OF UPDATED FUNCTIONS ---

    enableGenderSelectionButtons(); // Ensure gender selection buttons are enabled on page load
    console.log('DOMContentLoaded event finished. Gender selection buttons should be enabled.');
    fetchAndRenderEmotionHistory(); // Fetch and render emotion history on page load
});