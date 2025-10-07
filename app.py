# app.py (Final Version)

import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session, send_from_directory
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import logging
import json
from database import add_user, find_user, get_all_users
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logging.getLogger('tensorflow').setLevel(logging.ERROR)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'a-very-strong-and-long-secret-key'

# --- Groq AI Client ---
try:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    print("Groq AI client initialized successfully!")
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    client = None

# --- Translation Setup ---
with open('static/translations.json', 'r', encoding='utf-8') as f:
    TRANSLATIONS = json.load(f)

@app.before_request
def set_language_and_theme():
    if 'lang' not in session:
        session['lang'] = 'en'
    if 'theme' not in session:
        session['theme'] = 'light-mode'

@app.context_processor
def inject_theme():
    return dict(current_theme=session.get('theme', 'light-mode'))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'assets'),
                               'favicon.svg',
                               mimetype='image/svg+xml')

# --- Login Manager Setup ---
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, id, username, email=None, theme='light-mode'):
        self.id = id
        self.username = username
        self.email = email if email else f'{username}@example.com'
        self.theme = theme

    @staticmethod
    def get(user_id):
        users = get_all_users()
        # Assuming user_id passed here is the username
        user_data = users.get(user_id)
        if user_data:
            return User(user_data['username'], user_data['username'], user_data['email'], user_data.get('theme', 'light-mode'))
        return None

@login_manager.user_loader
def load_user(user_id):
    # user_id here is the username
    return User.get(user_id)

def load_users_from_json():
    return get_all_users()

# --- Pre-load Image Emotion Detection Models ---
try:
    FACE_CASCADE = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    EMOTION_MODEL = load_model('model.h5')
    EMOTION_LABELS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
    print("Image emotion models loaded successfully!")
except Exception as e:
    print(f"Error loading image emotion models: {e}")
    FACE_CASCADE = None
    EMOTION_MODEL = None

def get_canned_ai_response(emotion):
    responses = TRANSLATIONS.get(session.get('lang', 'en'), {}).get('canned_responses', {})
    return responses.get(emotion, "How are you feeling today?")

# --- Page Routes ---
@app.route('/')
def home():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    lang = session.get('lang', 'en')
    translations = TRANSLATIONS.get(lang, TRANSLATIONS['en'])
    return render_template('index.html', translations=translations)

@app.route('/set_language/<lang_code>')
def set_language_route(lang_code):
    if lang_code in TRANSLATIONS:
        session['lang'] = lang_code
    return redirect(request.referrer or url_for('home'))

@app.route('/set_theme/<theme_code>')
def set_theme_route(theme_code):
    if theme_code in ['light-mode', 'dark-mode']:
        session['theme'] = theme_code
    return redirect(request.referrer or url_for('home'))

@app.route('/companion')
@login_required
def companion_page():
    return render_template('companion.html')

@app.route('/about')
def about_page():
    lang = session.get('lang', 'en')
    translations = TRANSLATIONS.get(lang, TRANSLATIONS['en'])
    return render_template('about.html', current_user=current_user, translations=translations)

@app.route('/emotion')
@login_required
def emotion_page():
    session['lang'] = 'en' # Ensure emotion page always defaults to English
    lang = session.get('lang', 'en')
    translations = TRANSLATIONS.get(lang, TRANSLATIONS['en'])
    return render_template('emotion.html', translations=translations)

@app.route('/settings')
@login_required
def settings_page():
    lang = session.get('lang', 'en')
    translations = TRANSLATIONS.get(lang, TRANSLATIONS['en'])
    return render_template('settings_page.html', current_language=lang, translations=translations)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        if add_user(username, password, email):
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Username already exists. Please choose a different one.', 'danger')
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_data = find_user(username, password)
        if user_data:
            user = User(user_data['username'], user_data['username'], user_data['email'], user_data.get('theme', 'light'))
            login_user(user, remember=True)
            session['lang'] = 'en'  # Set language to English after successful login
            return redirect(url_for('emotion_page'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/header')
def header():
    return render_template('header.html')

@app.route('/footer')
def footer():
    return render_template('footer.html')

# --- API Routes ---
@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "Groq AI client not initialized."}), 500
    try:
        user_message = request.json['message']
        if not user_message:
            return jsonify({"error": "Empty message"}), 400

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an empathetic AI companion. Your goal is to help the user with their emotional wellbeing. Detect their primary emotion and provide a short, supportive, conversational response (max 30 words). Your final output must be a JSON object with two keys: \"emotion\" and \"reply\"."
                },
                { "role": "user", "content": user_message }
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
        )
        ai_response = chat_completion.choices[0].message.content
        response_data = json.loads(ai_response)
        detected_emotion = response_data.get('emotion')
        if detected_emotion and current_user.is_authenticated:
            from datetime import datetime
            add_emotion_entry(current_user.id, detected_emotion, datetime.now().isoformat())
        return ai_response
    except Exception as e:
        print(f"An error occurred in /chat route: {e}")
        return jsonify({"error": "Sorry, I'm having trouble connecting to the AI."}), 500

@app.route('/detect', methods=['POST'])
def detect_emotion():
    if not FACE_CASCADE or not EMOTION_MODEL:
        return jsonify({'emotion': 'N/A', 'ai_response': 'Detection model not available.'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No selected image file'}), 400

    try:
        # Read the image file
        in_memory_file = image_file.read()
        np_img = np.frombuffer(in_memory_file, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = FACE_CASCADE.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) > 0:
            # Assuming only one face for simplicity, or take the largest one
            (x, y, w, h) = faces[0]
            roi_gray = gray_frame[y:y + h, x:x + w]
            
            # Resize for the model
            resized_roi = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            
            # Normalize and reshape for model input
            normalized_roi = resized_roi / 255.0
            reshaped_roi = np.reshape(normalized_roi, (1, 48, 48, 1))

            # Predict emotion
            emotion_prediction = EMOTION_MODEL.predict(reshaped_roi)
            max_index = np.argmax(emotion_prediction[0])
            predicted_emotion = EMOTION_LABELS[max_index]

            # Get AI response
            ai_response = get_canned_ai_response(predicted_emotion)

            return jsonify({'emotion': predicted_emotion, 'ai_response': ai_response})
        else:
            return jsonify({'emotion': 'Neutral', 'ai_response': get_canned_ai_response('Neutral')})

    except Exception as e:
        print(f"Error during emotion detection: {e}")
        return jsonify({'error': 'Error processing image for emotion detection.'}), 500

@app.route('/emotion_history')
@login_required
def emotion_history():
    try:
        history = get_emotion_history(current_user.id)
        return jsonify(history)
    except Exception as e:
        print(f"Error fetching emotion history for user {current_user.id}: {e}")
        return jsonify({'error': 'Failed to fetch emotion history.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)