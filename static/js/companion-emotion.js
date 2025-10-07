// Emotion detection functionality for the companion page

let video = null;
let stream = null;
let isProcessing = false;
let emotionDetectionInterval = null;

// Start video capture
function startVideo() {
  video = document.getElementById('user-video');
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(mediaStream) {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
          // Start emotion detection after video starts
          startEmotionDetection();
        };
      })
      .catch(function(err) {
        console.error("Error accessing camera: ", err);
        addCompanionMessage("I couldn't access your camera. You can still chat with me!");
      });
  } else {
    console.error("getUserMedia not supported");
    addCompanionMessage("Video chat is not supported in your browser. You can still chat with me!");
  }
}

// Stop video capture
function stopVideo() {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
    stream = null;
  }
  
  if (emotionDetectionInterval) {
    clearInterval(emotionDetectionInterval);
    emotionDetectionInterval = null;
  }
}

// Start emotion detection
function startEmotionDetection() {
  // Run emotion detection every 3 seconds
  emotionDetectionInterval = setInterval(detectEmotion, 3000);
}

// Detect emotion from video
function detectEmotion() {
  if (!video || isProcessing || !stream) return;
  
  isProcessing = true;
  
  // Create canvas to capture video frame
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Convert canvas to blob
  canvas.toBlob(function(blob) {
    const formData = new FormData();
    formData.append('image', blob, 'emotion-detection.jpg');
    
    // Send to server for emotion detection
    fetch('/detect', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.emotion && data.emotion !== 'N/A') {
        // Update UI with detected emotion
        detectedEmotion.textContent = data.emotion;
        updateEmotionUI(data.emotion);
        
        // If the emotion is different from the current one, add a message
        if (currentEmotionText.textContent !== data.emotion) {
          addCompanionMessage(data.ai_response);
        }
      }
      isProcessing = false;
    })
    .catch(error => {
      console.error('Error detecting emotion:', error);
      isProcessing = false;
    });
  }, 'image/jpeg', 0.9);
}