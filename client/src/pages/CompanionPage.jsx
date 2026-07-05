import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext, API_URL } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/companion.css';

export const CompanionPage = () => {
  const { t, language, token } = useContext(AuthContext);
  const [selectedCompanion, setSelectedCompanion] = useState(null); // 'female' or 'male'
  const [chatMessages, setChatMessages] = useState([
    { sender: 'companion', text: "Hello! I'm your AI companion. I'm here to help you. How are you feeling today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');
  const [targetEmotion, setTargetEmotion] = useState('happy');
  const [emotionHistory, setEmotionHistory] = useState([]);
  
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);

  // Audio/Speech Synthesis
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => {
      playAnimation('Talking');
    };
    
    utterance.onend = () => {
      playAnimation('Idle');
    };

    // Voice Selection
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (selectedCompanion === 'female') {
      selectedVoice = voices.find(v => v.name.includes('Heera') || (v.lang.startsWith('en') && v.name.toLowerCase().includes('female')));
    } else {
      selectedVoice = voices.find(v => v.name.includes('Ravi') || (v.lang.startsWith('en') && v.name.toLowerCase().includes('male')));
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.name.includes('Google US English') || v.lang.startsWith('en'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Play animation helper
  const playAnimation = (name) => {
    const actions = actionsRef.current;
    const newAction = actions[name];
    if (!newAction) return;

    if (activeActionRef.current === newAction) return;

    if (activeActionRef.current) {
      activeActionRef.current.fadeOut(0.3);
    }

    newAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.3).play();
    activeActionRef.current = newAction;
  };

  // Load Emotion History
  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/auth/emotion-history`)
        .then(res => setEmotionHistory(res.data))
        .catch(err => console.error('Error fetching emotion history:', err));
    }
  }, [token]);

  // Web Speech API - Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      rec.interimResults = false;

      rec.onstart = () => {
        setRecording(true);
        setInputText(language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...');
      };

      rec.onend = () => {
        setRecording(false);
      };

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setRecording(false);
        setInputText('');
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    if (recording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Initialize Three.js Scene
  const init3D = (gender) => {
    if (!canvasRef.current || !window.THREE) return;

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    const clock = new THREE.Clock();
    clockRef.current = clock;

    const width = canvasRef.current.clientWidth || 300;
    const height = canvasRef.current.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0.6, 2);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Lights
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Fallback beautiful glowing orb for 3D simulation
    const geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: gender === 'female' ? 0xff4d94 : 0x3399ff,
      roughness: 0.2,
      metalness: 0.8,
      emissive: gender === 'female' ? 0x660033 : 0x003366,
    });
    const fallbackMesh = new THREE.Mesh(geometry, material);
    fallbackMesh.position.set(0, 0.6, 0);
    scene.add(fallbackMesh);
    modelRef.current = fallbackMesh;

    // Load actual FBX Model if available
    if (THREE.FBXLoader) {
      const loader = new THREE.FBXLoader();
      const idleModelPath = `/static/models/${gender}_idle.fbx`;
      const talkingModelPath = `/static/models/${gender}_talking.fbx`;

      loader.load(idleModelPath, (fbx) => {
        scene.remove(fallbackMesh); // Remove placeholder
        modelRef.current = fbx;
        fbx.scale.set(0.02, 0.02, 0.02);
        fbx.position.y = -2.2;
        scene.add(fbx);

        const mixer = new THREE.AnimationMixer(fbx);
        mixerRef.current = mixer;

        if (fbx.animations && fbx.animations[0]) {
          actionsRef.current['Idle'] = mixer.clipAction(fbx.animations[0]);
        }

        // Load talking animation
        loader.load(talkingModelPath, (talkFbx) => {
          if (talkFbx.animations && talkFbx.animations[0]) {
            actionsRef.current['Talking'] = mixer.clipAction(talkFbx.animations[0]);
          }
          playAnimation('Idle');
        }, undefined, (err) => console.log('Talking FBX load failed, using fallback animation.'));

      }, undefined, (err) => console.log('Idle FBX load failed, utilizing beautiful glowing 3D orb fallback instead.'));
    }

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      // Rotate glowing orb as fallback animation if no mixer
      if (modelRef.current && !mixerRef.current) {
        modelRef.current.rotation.y += 0.01;
        modelRef.current.rotation.x += 0.005;
      }

      if (mixerRef.current && clockRef.current) {
        mixerRef.current.update(clockRef.current.getDelta());
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  };

  const handleSelectCompanion = (gender) => {
    setSelectedCompanion(gender);
    setTimeout(() => {
      init3D(gender);
    }, 100);
  };

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || inputText;
    if (!message || !message.trim()) return;

    // Add user message to UI
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    setInputText('');

    try {
      const res = await axios.post(`${API_URL}/chat`, { message });
      const { reply, emotion } = res.data;

      // Add AI reply to UI
      setChatMessages(prev => [...prev, { sender: 'companion', text: reply }]);
      if (emotion) setCurrentEmotion(emotion);

      // Play voice speak
      speakText(reply);
    } catch (err) {
      console.error(err);
      toast.error('AI is offline or busy. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <Toaster />
      <div className="container page-container mt-4">
        <div className="py-4">
          <h1 className="display-4 fw-bold main-title text-center animate__animated animate__fadeInDown">
            {t('virtualAICompanionHeading') || 'Virtual AI Companion'}
          </h1>
          <p className="lead mb-4 text-center animate__animated animate__fadeInUp">
            <strong>Your personalized emotional support AI that adapts to your needs</strong>
          </p>

          {!selectedCompanion ? (
            <div className="companion-selection-container p-5 border rounded text-center bg-light animate__animated animate__fadeIn shadow">
              <h3 className="mb-4"><i className="fas fa-robot me-2"></i>Choose Your Companion</h3>
              <div className="d-flex justify-content-center gap-5 flex-wrap">
                <div className="companion-card p-4 border rounded bg-white shadow-sm" style={{ width: '200px' }}>
                  <div className="avatar-circle bg-pink mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ffe6f0' }}>
                    <i className="fas fa-user-tie text-danger fs-1"></i>
                  </div>
                  <h4>Female</h4>
                  <button onClick={() => handleSelectCompanion('female')} className="btn btn-outline-primary mt-2">Select</button>
                </div>
                <div className="companion-card p-4 border rounded bg-white shadow-sm" style={{ width: '200px' }}>
                  <div className="avatar-circle bg-blue mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e6f0ff' }}>
                    <i className="fas fa-user-astronaut text-primary fs-1"></i>
                  </div>
                  <h4>Male</h4>
                  <button onClick={() => handleSelectCompanion('male')} className="btn btn-outline-primary mt-2">Select</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Interaction Canvas and Chat */}
              <div className="col-lg-8 mb-4">
                <div className="interaction-container border rounded p-4 bg-light shadow-sm">
                  <div className="companion-header d-flex align-items-center mb-3">
                    <div className="avatar-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                      <i className={selectedCompanion === 'female' ? 'fas fa-user-tie' : 'fas fa-user-astronaut'}></i>
                    </div>
                    <div className="ms-3">
                      <h4 className="mb-0 text-capitalize">{selectedCompanion} Companion</h4>
                      <p className="small text-success mb-0"><span className="status-dot"></span> Online and ready to help</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-5 mb-3">
                      <div className="avatar-canvas-container border rounded bg-dark overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                      </div>
                    </div>
                    
                    <div className="col-md-7 d-flex flex-column justify-content-between">
                      <div className="chat-messages-container border rounded p-3 mb-3 bg-white overflow-auto" style={{ height: '280px' }}>
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`d-flex mb-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-2 rounded max-w-75 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="input-group">
                        <button 
                          className={`btn ${recording ? 'btn-danger' : 'btn-outline-secondary'}`} 
                          onClick={toggleRecording}
                          title="Voice Input"
                        >
                          <i className="fas fa-microphone"></i>
                        </button>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Type message or speak..." 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="btn btn-primary" onClick={() => handleSendMessage()}>
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotional State Panel */}
              <div className="col-lg-4 mb-4">
                <div className="emotional-state-container border rounded p-4 bg-light shadow-sm h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="section-title"><i className="fas fa-heart-pulse me-2"></i>Emotional Journey</h3>
                    <div className="current-emotion-display text-center p-4 bg-white border rounded my-3">
                      <h5 className="text-muted">Detected Emotion</h5>
                      <h2 className="text-primary mt-2">{currentEmotion}</h2>
                    </div>
                    
                    <div className="target-goal-container mt-4">
                      <h5>Target Emotional State</h5>
                      <select 
                        className="form-select mt-2"
                        value={targetEmotion}
                        onChange={(e) => setTargetEmotion(e.target.value)}
                      >
                        <option value="happy">Happy</option>
                        <option value="calm">Calm</option>
                        <option value="energetic">Energetic</option>
                        <option value="focused">Focused</option>
                        <option value="relaxed">Relaxed</option>
                      </select>
                      <button 
                        onClick={() => toast.success(`Emotional goal set to: ${targetEmotion}`)} 
                        className="btn btn-success w-100 mt-2"
                      >
                        Set Goal
                      </button>
                    </div>
                  </div>

                  <button onClick={() => setSelectedCompanion(null)} className="btn btn-outline-danger mt-4">
                    Change Companion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CompanionPage;
