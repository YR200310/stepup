# register_user.py
import sqlite3
import hashlib

def register_user(username, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    conn = sqlite3.connect('stepup.db')
    cursor = conn.cursor()
    
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    register_user('test', 'test')
