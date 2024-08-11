from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import logging
import json  # JSONモジュールをインポート

app = Flask(__name__)

# CORSの設定を追加（HTTPメソッドやオリジンをすべて許可）
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# ログ設定
logging.basicConfig(level=logging.INFO)

def get_db_connection():
    conn = sqlite3.connect('stepup.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    conn.execute('''
    CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        user_id INTEGER NOT NULL,
        traits TEXT,  -- 性格特性を保存するための新しい列
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    conn.close()

@app.before_first_request
def setup():
    init_db()

# 目標を取得するエンドポイント
@app.route('/goals', methods=['GET'])
def get_goals():
    user_id = request.args.get('user_id')  # クエリパラメータからユーザーIDを取得

    logging.info(f"Received GET request for goals with user_id: {user_id}")  # ログに出力

    if not user_id:
        return jsonify({'message': 'User ID required'}), 400

    try:
        conn = get_db_connection()
        goals = conn.execute('SELECT * FROM goals WHERE user_id = ?', (user_id,)).fetchall()
        conn.close()
        
        goals_list = [dict(goal) for goal in goals]
        for goal in goals_list:
            goal['traits'] = json.loads(goal['traits'])  # 性格特性をデコード

        return jsonify(goals_list)
    except Exception as e:
        logging.error(f"Error fetching goals: {str(e)}")  # エラーログを出力
        return jsonify({'message': 'Error fetching goals'}), 500

# 目標を追加するエンドポイント
@app.route('/goals', methods=['POST'])
def add_goal():
    try:
        new_goal = request.json
        user_id = new_goal.get('user_id')
        traits = new_goal.get('traits', [])

        if not new_goal['title'] or not user_id:
            logging.error("Title or user_id is missing in the request")
            return jsonify({'message': 'Title and user_id are required'}), 400

        logging.info(f"Adding goal for user_id: {user_id}")

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO goals (title, description, due_date, user_id, traits) 
            VALUES (?, ?, ?, ?, ?)
        ''', (new_goal['title'], new_goal['description'], new_goal['due_date'], user_id, json.dumps(traits)))
        conn.commit()
        conn.close()

        logging.info("Goal added successfully")
        return '', 201
    except Exception as e:
        logging.error(f"Error adding goal: {str(e)}")
        return jsonify({'message': f'Error adding goal: {str(e)}'}), 500


# 目標を削除するエンドポイント
@app.route('/goals/<int:id>', methods=['DELETE'])
def delete_goal(id):
    logging.info(f"Received DELETE request to remove goal with id: {id}")  # ログに出力

    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM goals WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return '', 204
    except Exception as e:
        logging.error(f"Error deleting goal: {str(e)}")  # エラーログを出力
        return jsonify({'message': 'Error deleting goal'}), 500

# 目標を更新するエンドポイント
@app.route('/goals/<int:id>', methods=['PUT'])
def update_goal(id):
    updated_goal = request.json

    logging.info(f"Received PUT request to update goal with id: {id} with data: {updated_goal}")  # ログに出力

    try:
        conn = get_db_connection()
        conn.execute('''
            UPDATE goals
            SET title = ?, description = ?, due_date = ?, traits = ?
            WHERE id = ?
        ''', (updated_goal['title'], updated_goal['description'], updated_goal['due_date'], json.dumps(updated_goal.get('traits', [])), id))
        conn.commit()
        conn.close()
        return '', 204
    except Exception as e:
        logging.error(f"Error updating goal: {str(e)}")  # エラーログを出力
        return jsonify({'message': 'Error updating goal'}), 500

# ユーザー登録エンドポイント
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    logging.info(f"Received POST request to register user: {username}")  # ログに出力

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        logging.error(f"Username {username} already exists")  # エラーログを出力
        return jsonify({'message': 'Username already exists'}), 400

# ログインエンドポイント
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    logging.info(f"Received POST request to login user: {username}")  # ログに出力

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, hashed_password)).fetchone()
        conn.close()

        if user:
            logging.info(f"Login successful for user: {username}")  # ログに出力
            return jsonify({'message': 'Login successful', 'user_id': user['id']}), 200
        else:
            logging.warning(f"Login failed for user: {username}")  # 警告ログを出力
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        logging.error(f"Error during login: {str(e)}")  # エラーログを出力
        return jsonify({'message': 'Error during login'}), 500

if __name__ == '__main__':
    app.run(debug=True)
