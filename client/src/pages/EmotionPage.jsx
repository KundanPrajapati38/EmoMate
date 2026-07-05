import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext, API_URL } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/emotion.css';

export const EmotionPage = () => {
  const { t, getCannedResponse } = useContext(AuthContext);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [emotion, setEmotion] = useState('Waiting for detection...');
  const [aiResponse, setAiResponse] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Map face-api.js emotions to our standard labels
  const emotionMap = {
    angry: 'Angry',
    disgusted: 'Disgust',
    fearful: 'Fear',
    happy: 'Happy',
    neutral: 'Neutral',
    sad: 'Sad',
    surprised: 'Surprise'
  };

  const emotionIcons = {
    'Happy': <i className="fas fa-face-laugh-beam text-warning"></i>,
    'Sad': <i className="fas fa-face-sad-tear text-primary"></i>,
    'Angry': <i className="fas fa-face-angry text-danger"></i>,
    'Surprise': <i className="fas fa-face-surprise text-info"></i>,
    'Fear': <i className="fas fa-face-frown text-secondary"></i>,
    'Disgust': <i className="fas fa-face-dizzy text-success"></i>,
    'Neutral': <i className="fas fa-face-meh text-dark"></i>,
    'N/A': <i className="fas fa-face-question text-muted"></i>
  };

  // Load face-api.js models from CDN
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Wait for faceapi global object to be loaded from CDN script in index.html
        const checkFaceApi = setInterval(async () => {
          if (window.faceapi) {
            clearInterval(checkFaceApi);
            const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/weights';
            await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            setModelLoaded(true);
            setCameraLoading(false);
            console.log('face-api.js models loaded successfully!');
          }
        }, 500);
      } catch (err) {
        console.error('Failed to load face-api models', err);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setDetecting(true);
      setEmotion(t('starting_detection'));
      
      // Start processing frame every 3 seconds (faster than original 5s, feels responsive!)
      detectionIntervalRef.current = setInterval(detectEmotion, 3000);
    } catch (err) {
      console.error('Error accessing webcam', err);
      alert(t('camera_access_error') || 'Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setDetecting(false);
    setEmotion('Waiting for detection...');
    setAiResponse(t('ai_is_ready'));
  };

  const detectEmotion = async () => {
    if (!videoRef.current || !window.faceapi || !modelLoaded) return;

    try {
      const detection = await window.faceapi
        .detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection && detection.expressions) {
        // Find expression with highest probability
        let highestExpression = 'neutral';
        let highestVal = 0;
        
        Object.entries(detection.expressions).forEach(([expr, val]) => {
          if (val > highestVal) {
            highestVal = val;
            highestExpression = expr;
          }
        });

        const mappedEmotion = emotionMap[highestExpression] || 'Neutral';
        setEmotion(mappedEmotion);
        
        const responseText = getCannedResponse(mappedEmotion);
        setAiResponse(responseText);

        // Save emotion to history in backend
        await axios.post(`${API_URL}/auth/emotion-history`, { emotion: mappedEmotion });
      } else {
        setEmotion('Neutral');
        setAiResponse(getCannedResponse('Neutral'));
      }
    } catch (err) {
      console.error('Detection frame processing error:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      <Header />
      
      <div className="container page-container mt-4">
        <div className="py-4">
          <h1 className="display-4 fw-bold main-title text-center animate__animated animate__fadeInDown">
            {t('emotion_detection')}
          </h1>
          <p className="lead mb-4 text-center animate__animated animate__fadeInUp">
            <strong>Real-time emotion detection powered by client-side AI</strong>
          </p>
          
          <div className="row">
            <div className="col-lg-12 mb-4">
              <div className="info-box animate__animated animate__fadeInLeft">
                <h3 className="info-title"><i className="fas fa-info-circle me-2"></i>How It Works</h3>
                <p>Our AI system analyzes your facial expressions in real-time right inside your browser and determines your emotional state. The system can detect 7 different emotions with high accuracy.</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            {/* Camera Frame */}
            <div className="col-lg-8 mb-4">
              <div className="camera-container h-100 animate__animated animate__zoomIn border rounded overflow-hidden" style={{ minHeight: '400px', position: 'relative', backgroundColor: '#000' }}>
                {(!detecting || cameraLoading) && (
                  <div className="camera-loading d-flex flex-column justify-content-center align-items-center w-100 h-100 position-absolute" style={{ zIndex: 2, background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                    <div id="three-d-animation" className="mb-3">
                      <div className="face-front"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                      <div className="face-back"><img src="/static/images/face_icon.svg" alt="Face Icon" /></div>
                    </div>
                    <p className="mt-2">{!modelLoaded ? 'Loading Neural Networks...' : 'Start Camera to Detect Emotion'}</p>
                  </div>
                )}
                
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: detecting ? 'block' : 'none' }}
                />
              </div>
            </div>

            {/* Results Sidebar */}
            <div className="col-lg-4 mb-4">
              <div className="detection-container border rounded p-4 bg-light shadow-sm h-100 d-flex flex-column justify-content-between">
                <div className="emotion-result text-center animate__animated animate__fadeInLeft">
                  <div className="emotion-icon fs-1 mb-3">
                    {emotionIcons[emotion] || emotionIcons['N/A']}
                  </div>
                  <div id="result-box" className="p-3 mb-3 bg-white border rounded fw-bold text-uppercase">
                    {t('predicted_emotion')} {emotion}
                  </div>
                </div>

                <div className="p-3 mb-3 bg-white border rounded text-center animate__animated animate__fadeInLeft" style={{ minHeight: '80px' }}>
                  <div className="text-muted small mb-1">{t('ai_response')}</div>
                  <div id="ai-response-box" className="fw-medium">{aiResponse || t('ai_is_ready')}</div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    onClick={startCamera} 
                    disabled={detecting || !modelLoaded}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-camera me-2"></i>{t('start_detection')}
                  </button>
                  <button 
                    onClick={stopCamera} 
                    disabled={!detecting}
                    className="btn btn-outline-secondary"
                  >
                    <i className="fas fa-stop me-2"></i>{t('stop')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row">
            <div className="col-lg-12 mb-4">
              <div className="emotion-stats mt-4 d-flex justify-content-around flex-wrap gap-3">
                <div className="stat-card p-3 border rounded text-center bg-white shadow-sm flex-fill" style={{ maxWidth: '300px' }}>
                  <i className="fas fa-bolt text-warning fs-3 mb-2"></i>
                  <h5>{t('fast_analysis')}</h5>
                  <p className="text-muted mb-0">{t('results_in_seconds')}</p>
                </div>
                <div className="stat-card p-3 border rounded text-center bg-white shadow-sm flex-fill" style={{ maxWidth: '300px' }}>
                  <i className="fas fa-brain text-primary fs-3 mb-2"></i>
                  <h5>{t('ai_powered')}</h5>
                  <p className="text-muted mb-0">{t('deep_learning_model')}</p>
                </div>
                <div className="stat-card p-3 border rounded text-center bg-white shadow-sm flex-fill" style={{ maxWidth: '300px' }}>
                  <i className="fas fa-chart-pie text-success fs-3 mb-2"></i>
                  <h5>{t('seven_emotions')}</h5>
                  <p className="text-muted mb-0">{t('comprehensive_detection')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </>
  );
};
export default EmotionPage;
