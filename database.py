import json
import os

DATABASE_FILE = 'users.json'

def _load_users():
    if os.path.exists(DATABASE_FILE):
        with open(DATABASE_FILE, 'r') as f:
            try:
                data = json.load(f)
                if isinstance(data, list):
                    # Convert list of users to a dictionary keyed by username
                    return {user['username']: user for user in data}
                return data
            except json.JSONDecodeError:
                return {}
    return {}

def _save_users(users):
    # Convert the dictionary of users back to a list for saving
    users_list = list(users.values())
    with open(DATABASE_FILE, 'w') as f:
        json.dump(users_list, f, indent=4)

def add_user(username, password, email, theme='light'):
    users = _load_users()
    if username in users:
        return False  # User already exists
    users[username] = {'username': username, 'password': password, 'email': email, 'theme': theme, 'emotional_history': []}
    _save_users(users)
    return True

def add_emotion_entry(user_id, emotion, timestamp):
    users = _load_users()
    # Find the user by their username (which is used as user_id)
    user_found = None
    for username, user_data in users.items():
        if user_data['username'] == user_id:
            user_found = user_data
            break

    if user_found:
        user_found['emotional_history'].append({'emotion': emotion, 'timestamp': timestamp})
        _save_users(users)
        return True
    return False

def get_emotion_history(user_id):
    users = _load_users()
    # Find the user by their username (which is used as user_id)
    user_found = None
    for username, user_data in users.items():
        if user_data['username'] == user_id:
            user_found = user_data
            break

    if user_found:
        return user_found.get('emotional_history', [])
    return []

def find_user(username, password):
    users = _load_users()
    user = users.get(username)
    if user and user['password'] == password:
        return user  # Return the user dictionary
    return None

def get_all_users():
    return _load_users()