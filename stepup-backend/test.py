from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash
import sqlite3

app = Flask(__name__)

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute(query, args)
    result = cursor.fetchone() if one else cursor.fetchall()
    conn.close()
    return result

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # データベースからユーザー情報を取得
    user = query_db('SELECT * FROM users WHERE username = ?', [username], one=True)

    if user is None:
        return jsonify({'error': 'User not found'}), 404

    # パスワードの検証
    if not check_password_hash(user[2], password):  # user[2]はパスワードハッシュ
        return jsonify({'error': 'Invalid password'}), 401

    return jsonify({'message': 'Login successful', 'user_id': user[0]})  # user[0]はユーザーID

if __name__ == '__main__':
    app.run(debug=True)
