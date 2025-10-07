// static/js/companion-speech.js

// -- 1. Speech Synthesis (Text-to-Speech) --
// Yeh function AI ke text ko aawaz dega

// static/js/companion-speech.js

// static/js/companion-speech.js

function speakText(text, gender) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Jab AI bolna shuru kare
    utterance.onstart = () => {
        console.log("Speech started, playing talking animation.");
        // Call the new function from companion-3d.js
        if (typeof playAnimation === 'function' && typeof isAnimationLoaded === 'function') {
            const checkAnimation = () => {
                if (isAnimationLoaded('Talking')) {
                    playAnimation('Talking');
                } else {
                    console.warn("Talking animation not yet loaded. Retrying in 100ms.");
                    setTimeout(checkAnimation, 100);
                }
            };
            checkAnimation();
        }
    };

    // Jab AI bolna band kar de
    utterance.onend = () => {
        console.log("Speech ended, returning to idle animation.");
        // Call the new function from companion-3d.js
        if (typeof playAnimation === 'function') {
            playAnimation('Idle');
        }
    };
    
    let selectedVoice = getVoiceByGender(gender);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
}

let availableVoices = [];

function loadVoices() {
    availableVoices = window.speechSynthesis.getVoices();

}

// Load voices when they change (e.g., after page load)
window.speechSynthesis.onvoiceschanged = loadVoices;

// Also try to load voices immediately in case the event already fired
loadVoices();

function getVoiceByGender(gender) {

    let selectedVoice = null;

    // Try to find a specific Indian voice first
    if (gender === 'female') {
        selectedVoice = availableVoices.find(voice => voice.name === 'Microsoft Heera - English (India)');
    } else if (gender === 'male') {
        selectedVoice = availableVoices.find(voice => voice.name === 'Microsoft Ravi - English (India)');
    }

    // If no specific Indian voice found, try to find a general Indian voice by gender
    if (!selectedVoice) {
        if (gender === 'female') {
            selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en-IN') && voice.name.toLowerCase().includes('female'));
        } else if (gender === 'male') {
            selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en-IN') && voice.name.toLowerCase().includes('male'));
        }
    }

    // If no Indian voice found, try to find a general English voice by gender
    if (!selectedVoice) {
        if (gender === 'female') {
            selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'));
        } else if (gender === 'male') {
            selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male'));
        }
    }

    // Fallback to Google US English if no specific voice is found
    if (!selectedVoice) {
        selectedVoice = availableVoices.find(voice => voice.name === 'Google US English');
    }

    return selectedVoice;
}

// ... baaki ka speech recognition code ...


// -- 2. Speech Recognition (Speech-to-Text) --
// Yeh user ki aawaz ko text mein badlega

const voiceInputBtn = document.getElementById('voice-input-btn');
const userInput = document.getElementById('user-input');

// Browser support check
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // निरंतर भाषण इनपुट की अनुमति दें
        recognition.lang = 'hi-IN';    // भाषा सेट करें (हिंदी)
        recognition.interimResults = true; // अंतरिम परिणाम दिखाएं

        let isRecognitionStoppedManually = false;

        voiceInputBtn.addEventListener('click', () => {
            if (voiceInputBtn.classList.contains('recording')) {
                isRecognitionStoppedManually = true;
                recognition.stop();
            } else {
                isRecognitionStoppedManually = false;
                recognition.start();
            }
        });

        // जब recognition शुरू हो
        recognition.onstart = () => {
            voiceInputBtn.classList.add('recording');
            userInput.placeholder = 'सुन रहा हूँ...';
            isRecognitionStoppedManually = false; // Reset the flag on start
        };

        // जब recognition खत्म हो
        recognition.onend = () => {
            voiceInputBtn.classList.remove('recording');
            userInput.placeholder = 'अपना संदेश टाइप करें...';
            if (recognition.continuous && !isRecognitionStoppedManually) {
                // If continuous and not stopped manually, restart after a short delay
                setTimeout(() => {
                    recognition.start();
                }, 100); // Small delay to prevent immediate restart issues
            }
        };

        // जब अंतरिम परिणाम उपलब्ध हों
        recognition.oninterimresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    // अंतिम परिणाम को onresult में संभाला जाएगा
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            userInput.value = interimTranscript; // अंतरिम परिणाम दिखाएं
        };

        // जब अंतिम परिणाम उपलब्ध हो
        recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            userInput.value = transcript;
            window.sendMessage(); // संदेश भेजें
            // recognition.stop(); // संदेश भेजने के बाद पहचान रोकें - इसे हटा दिया गया है ताकि निरंतर पहचान हो सके
        };

        // Error handle करना
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = 'वॉयस इनपुट में त्रुटि: ';
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                errorMessage += 'माइक्रोफ़ोन अनुमति से इनकार कर दिया गया। कृपया अपने ब्राउज़र सेटिंग्स में अनुमति दें।';
            } else if (event.error === 'no-speech') {
                errorMessage += 'कोई भाषण नहीं सुना गया। कृपया फिर से प्रयास करें।';
            } else if (event.error === 'audio-capture') {
                errorMessage += 'ऑडियो कैप्चर करने में समस्या। सुनिश्चित करें कि माइक्रोफ़ोन ठीक से जुड़ा हुआ है।';
            } else {
                errorMessage += event.error;
            }
            userInput.placeholder = errorMessage;
            voiceInputBtn.classList.remove('recording');
            isRecognitionStoppedManually = true; // Treat error as a manual stop for onend logic
        };

    } else {
        console.warn('Speech Recognition not supported in this browser.');
        voiceInputBtn.style.display = 'none'; // अगर support नहीं है तो button hide कर दें
    }

// Thodi styling add karein jab recording ho rahi ho
const style = document.createElement('style');
style.innerHTML = `
    #voice-input-btn.recording {
        color: #fff;
        background-color: #dc3545; /* Red color */
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
    }
`;
document.head.appendChild(style);