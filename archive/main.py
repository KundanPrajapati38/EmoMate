import kivy
kivy.require('2.1.0') # Best practice to specify Kivy version

from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, FadeTransition
from kivy.lang import Builder
import os # Operating system module to handle file paths

# --- Apni saari screen classes ko yahan import karein ---
# Yeh maanke chal rahe hain ki aapne project structure sahi banaya hai
from screens.auth_screen import AuthScreen
from screens.home_screen import HomeScreen
from screens.emotion_screen import EmotionDetectorScreen

class MainApp(App):
    """
    Yeh application ki main class hai.
    Iska kaam sirf ScreenManager banana aur saari screens ko load karna hai.
    """
    def build(self):
        # ScreenManager alag-alag screens ko manage karta hai.
        # FadeTransition screens ke beech ek smooth animation deta hai.
        sm = ScreenManager(transition=FadeTransition())
        
        # --- Saari screens ko ScreenManager mein add karein ---
        # Har screen ko ek unique 'name' dein. Isi naam se hum unke beech switch karenge.
        sm.add_widget(AuthScreen(name='auth'))
        sm.add_widget(HomeScreen(name='home'))
        sm.add_widget(EmotionDetectorScreen(name='emotion_detector'))

        # App shuru hone par kaunsi screen sabse pehle dikhegi.
        # 'auth' screen (login/signup) se shuru karna sabse logical hai.
        sm.current = 'auth'
        
        return sm

if __name__ == '__main__':
    # --- Saari .kv design files ko yahan load karein ---
    # Isse Kivy ko pata chalta hai ki aapka UI design kahan rakha hai.
    # Hum ek 'kv' folder mein saari design files rakhenge.
    kv_path = 'kv'
    Builder.load_file(os.path.join(kv_path, 'auth.kv'))
    Builder.load_file(os.path.join(kv_path, 'home.kv'))
    Builder.load_file(os.path.join(kv_path, 'emotion_screen.kv'))
    
    # App ko run karein
    MainApp().run()