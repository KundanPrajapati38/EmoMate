import cv2
import numpy as np
from tensorflow.keras.models import load_model

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.clock import Clock
from kivy.graphics.texture import Texture

# Load face detector and emotion recognition model
# Make sure these files are in the same directory as your script
FACE_CASCADE_PATH = 'haarcascade_frontalface_default.xml'
MODEL_PATH = 'model.h5'

class EmotionDetectorLayout(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'

        # --- Model and Classifier Loading ---
        try:
            self.face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
            self.model = load_model(MODEL_PATH)
        except Exception as e:
            print(f"Error loading model or cascade file: {e}")
            # Add a label to show the error in the app
            error_label = Label(text=f"Error: Could not load model files.\nMake sure '{FACE_CASCADE_PATH}' and '{MODEL_PATH}' are present.")
            self.add_widget(error_label)
            return

        self.emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
        
        # --- Kivy Widgets ---
        # This Image widget will display the video feed from OpenCV
        self.camera_image = Image(size_hint=(1, 0.6))
        self.add_widget(self.camera_image)
        
        # Label to show the detected emotion
        self.emotion_label = Label(text='Detected Emotion: N/A', size_hint=(1, 0.2), font_size='20sp')
        self.add_widget(self.emotion_label)
        
        # Label for the AI's response
        self.ai_response_label = Label(text='AI Response: ', size_hint=(1, 0.2), font_size='20sp')
        self.add_widget(self.ai_response_label)

        self.capture = None

    def start_camera(self):
        self.capture = cv2.VideoCapture(0)
        if not self.capture.isOpened():
            print("Error: Could not open camera.")
            self.capture = None
            return
        Clock.schedule_interval(self.update, 1.0 / 30.0)

    def stop_camera(self):
        if self.capture:
            self.capture.release()
            self.capture = None
        Clock.unschedule(self.update)
    
    def update(self, dt):
        # Read a frame from the webcam
        if not self.capture:
            return
        ret, frame = self.capture.read()
        if not ret:
            return

        # --- Emotion Detection and Drawing Logic (from your second script) ---
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        detected_emotion = "N/A"
        
        for (x, y, w, h) in faces:
            # Draw rectangle around the face (from second script)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 255), 2)
            
            # Preprocess the face region for the model
            face_roi_gray = gray[y:y+h, x:x+w]
            face_roi_gray = cv2.resize(face_roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            
            if np.sum(face_roi_gray) != 0:
                # Normalize and expand dimensions for model prediction
                roi = face_roi_gray.astype('float') / 255.0
                roi = np.expand_dims(roi, axis=0)
                roi = np.expand_dims(roi, axis=-1)
                
                # Predict emotion
                prediction = self.model.predict(roi)[0]
                detected_emotion = self.emotion_labels[prediction.argmax()]
                
                # Put emotion label on the frame (from second script)
                label_position = (x, y - 10)
                cv2.putText(frame, detected_emotion, label_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Update the Kivy labels
        self.emotion_label.text = f'Detected Emotion: {detected_emotion}'
        self.ai_response_label.text = f'AI Response: {self.get_ai_response(detected_emotion)}'

        # --- Convert the processed OpenCV frame to a Kivy Texture ---
        # Flip the frame vertically (OpenCV's origin is top-left, Kivy's is bottom-left)
        frame = cv2.flip(frame, 0)
        # Convert the frame to a string of bytes
        buf = frame.tobytes()
        # Create a Kivy texture from the bytes
        texture = Texture.create(size=(frame.shape[1], frame.shape[0]), colorfmt='bgr')
        texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
        
        # Set the texture of the Kivy Image widget
        self.camera_image.texture = texture

    def get_ai_response(self, emotion):
        if emotion == 'Happy':
            return "That's great! Keep smiling!"
        elif emotion == 'Sad':
            return "I'm sorry you feel that way. I hope things get better."
        elif emotion == 'Angry':
            return "Take a deep breath. It's okay to feel angry."
        elif emotion == 'Neutral':
            return "You seem to be calm. How are you today?"
        elif emotion == 'Surprise':
            return "Oh, a surprise! What's on your mind?"
        elif emotion == 'Fear':
            return "It's okay to be scared sometimes. You are safe."
        elif emotion == 'Disgust':
            return "That's a strong feeling. What's bothering you?"
        else:
            return "" # Return empty string if no face is detected