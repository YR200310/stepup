# update_passwords.py
import sqlite3
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def update_passwords():
    conn = sqlite3.connect('stepup.db')
    cursor = conn.cursor()

    # 現在のパスワードのハッシュを更新
    cursor.execute('SELECT id, password FROM users')
    users = cursor.fetchall()

    for user in users:
        user_id, plain_password = user
        hashed_password = hash_password(plain_password)
        cursor.execute('UPDATE users SET password = ? WHERE id = ?', (hashed_password, user_id))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    update_passwords()
