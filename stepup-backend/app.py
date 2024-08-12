from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import logging
import json

app = Flask(__name__)

# CORS設定
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})
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
        traits TEXT,
        completed BOOLEAN DEFAULT FALSE,
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
    user_id = request.args.get('user_id')
    sort_by = request.args.get('sort_by', 'due_date')
    order = request.args.get('order', 'ASC')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT * FROM goals WHERE user_id = ? ORDER BY {sort_by} {order}"
    cursor.execute(query, (user_id,))
    goals = cursor.fetchall()
    conn.close()

    return jsonify([dict(row) for row in goals])

# 目標を追加するエンドポイント
@app.route('/goals', methods=['POST'])
def add_goal():
    try:
        new_goal = request.json
        user_id = new_goal.get('user_id')
        traits = new_goal.get('traits', [])

        if not new_goal.get('title') or not user_id:
            logging.error("Title or user_id is missing in the request")
            return jsonify({'message': 'Title and user_id are required'}), 400

        logging.info(f"Adding goal for user_id: {user_id}")

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO goals (title, description, due_date, user_id, traits) 
            VALUES (?, ?, ?, ?, ?)
        ''', (new_goal['title'], new_goal.get('description'), new_goal.get('due_date'), user_id, json.dumps(traits)))
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
    logging.info(f"Received DELETE request to remove goal with id: {id}")

    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM goals WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return '', 204
    except Exception as e:
        logging.error(f"Error deleting goal: {str(e)}")
        return jsonify({'message': 'Error deleting goal'}), 500

# 目標を更新するエンドポイント
@app.route('/goals/<int:id>', methods=['PUT'])
def update_goal(id):
    updated_goal = request.json

    logging.info(f"Received PUT request to update goal with id: {id} with data: {updated_goal}")

    try:
        conn = get_db_connection()
        conn.execute('''
            UPDATE goals
            SET title = ?, description = ?, due_date = ?, traits = ?
            WHERE id = ?
        ''', (updated_goal.get('title'), updated_goal.get('description'), updated_goal.get('due_date'), json.dumps(updated_goal.get('traits', [])), id))
        conn.commit()
        conn.close()
        return '', 204
    except Exception as e:
        logging.error(f"Error updating goal: {str(e)}")
        return jsonify({'message': 'Error updating goal'}), 500

# ユーザー登録エンドポイント
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    logging.info(f"Received POST request to register user: {username}")

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
        logging.error(f"Username {username} already exists")
        return jsonify({'message': 'Username already exists'}), 400

# ログインエンドポイント
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    logging.info(f"Received POST request to login user: {username}")

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, hashed_password)).fetchone()
        conn.close()

        if user:
            logging.info(f"Login successful for user: {username}")
            return jsonify({'message': 'Login successful', 'user_id': user['id']}), 200
        else:
            logging.warning(f"Login failed for user: {username}")
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        return jsonify({'message': 'Error during login'}), 500

# Traitsの集計を取得するエンドポイント
@app.route('/traits_summary', methods=['GET'])
def traits_summary():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'message': 'User ID required'}), 400

    trait_mapping = {
        'ストレス': 'neuroticism',
        '新規性': 'openness',
        '外向性': 'extroversion',
        '協調性': 'agreeableness',
        '計画性': 'conscientiousness'
    }

    try:
        conn = get_db_connection()
        goals = conn.execute('SELECT traits FROM goals WHERE user_id = ?', (user_id,)).fetchall()
        conn.close()

        counts = {
            'extroversion': 0,
            'neuroticism': 0,
            'openness': 0,
            'agreeableness': 0,
            'conscientiousness': 0
        }

        for goal in goals:
            traits = json.loads(goal['traits']) if goal['traits'] else []
            for trait in traits:
                mapped_trait = trait_mapping.get(trait)
                if mapped_trait:
                    counts[mapped_trait] += 1

        summary_message = determine_summary_message(counts)

        return jsonify({'counts': counts, 'summary_message': summary_message})
    except Exception as e:
        logging.error(f"Error fetching traits summary: {str(e)}")
        return jsonify({'message': 'Error fetching traits summary'}), 500


def determine_summary_message(trait_counts):
    # 性格特性に応じたメッセージを返す関数
    extroversion = trait_counts.get('extroversion', 0)
    neuroticism = trait_counts.get('neuroticism', 0)
    openness = trait_counts.get('openness', 0)
    agreeableness = trait_counts.get('agreeableness', 0)
    conscientiousness = trait_counts.get('conscientiousness', 0)

    # 特性とそのカウントをタプルにしてリストにする
    traits = [
        ('extroversion', extroversion),
        ('neuroticism', neuroticism),
        ('openness', openness),
        ('agreeableness', agreeableness),
        ('conscientiousness', conscientiousness)
    ]

    # カウントでソートし、上位2つを取得
    sorted_traits = sorted(traits, key=lambda x: x[1], reverse=True)
    highest_trait = sorted_traits[0][0]  # 1番高い
    second_highest_trait = sorted_traits[1][0]  # 2番目に高い

    # メッセージを決定
    if (highest_trait == 'agreeableness' and second_highest_trait == 'conscientiousness') or (second_highest_trait == 'agreeableness' and highest_trait == 'conscientiousness'):
        return "協調性と誠実性が高い人は、他人に対して優しく協力的で、かつ計画的で責任感が強いです。このタイプの人は、チームでの協力を重視しながらも、自分の仕事に対しては慎重に取り組み、目標に向かって着実に努力することができます。そのため、教育職やプロジェクトマネージャーなどの職業が向いています。教育職では、生徒との良好な関係を築きながら、計画的に授業を進める能力が活かされます。"
    elif (highest_trait == 'openness' and second_highest_trait == 'conscientiousness') or (second_highest_trait == 'openness' and highest_trait == 'conscientiousness'):
        return "開放性と誠実性が高い人は、新しい経験やアイデアに対する興味が強く、かつ計画的で責任感が強いです。この組み合わせの特徴として、創造的な活動に対する好奇心と、詳細に注意を払いながら目標を達成する能力があります。このタイプの人には、研究職や戦略コンサルタントなどが向いています。研究職では、新しいアイデアや技術に対する探求心を活かしつつ、計画的に実験や研究を進めることが求められます。戦略コンサルタントでは、創造的な解決策を考えながら、クライアントのビジネス課題に対して計画的にアプローチする能力が役立ちます。"
    elif (highest_trait == 'extroversion' and second_highest_trait == 'agreeableness') or (second_highest_trait == 'extroversion' and highest_trait == 'agreeableness'):
        return "このタイプの人は、社交的で人との関係を大切にし、他人に対して優しく、協力的な態度を持っています。教育職やカウンセラーが向いています。教育職では、生徒との良好な関係を築くことができ、カウンセラーやセラピストでは、人の話をよく聞き、支援することが得意です。どちらも対人関係が重要な職業で、他人との関係を築く能力が活かされます。"
    elif (highest_trait == 'neuroticism' and second_highest_trait == 'openness') or (second_highest_trait == 'neuroticism' and highest_trait == 'openness'):
        return "新しい経験やアイデアに対する好奇心が強い一方で、心配や不安を感じやすいこのタイプの人は、研究職やアート関連の職業に向いています。新しい挑戦や創造的な活動に対する興味を活かすことができる一方で、自己管理やストレス管理が重要です。これらの職業では、新しいアイデアや挑戦を追求しながらも、心の安定を保つための方法を見つけることが成功の鍵となります。"
    # 他の条件も追加する
    elif (highest_trait == 'agreeableness' and second_highest_trait == 'openness') or (second_highest_trait == 'agreeableness' and highest_trait == 'openness'):
        return "協調性と外向性が高い人は、社交的で人との関係を築くのが得意であり、他人に対して優しく協力的な態度を持っています。この組み合わせの特徴は、対人関係のスキルが高く、チームでの協力やコミュニケーションが自然である点です。このタイプの人には、教育職やカウンセリング、営業職が向いています。教育職では、生徒や同僚と良好な関係を築きながら、協力的に授業を進めることができます。カウンセリングでは、他人の気持ちに共感しながら、サポートを提供することが得意です。"
    elif (highest_trait == 'openness' and second_highest_trait == 'extroversion') or (second_highest_trait == 'openness' and highest_trait == 'extroversion'):
        return "このタイプの人は、社交的で、楽しいことや新しい経験を好む一方、創造的で新しいアイデアに対してオープンです。マーケティングやPRの職業が向いており、社交的なスキルと創造力を活かせます。クリエイティブな職業、例えばデザイナーやアーティストも適しています。どちらも新しい挑戦やアイデアを楽しむ性格が活かされる仕事です。"
    elif (highest_trait == 'neuroticism' and second_highest_trait == 'agreeableness') or (second_highest_trait == 'neuroticism' and highest_trait == 'agreeableness'):
        return "他人に対して優しく協力的でありながら、心配や不安を感じやすいこのタイプの人は、支援職やカウンセリングの職業が向いています。人をサポートし、共感や支援を自然に行うことができるため、対人支援の役割において大きな価値を発揮します。ただし、感情の安定を保ち、ストレスをうまく管理するためのサポート体制が必要です。"
    elif (highest_trait == 'conscientiousness' and second_highest_trait == 'extroversion') or (second_highest_trait == 'conscientiousness' and highest_trait == 'extroversion'):
        return "このタイプの人は、社交的で活動的でありながら、計画的で責任感が強いです。プロジェクトマネージャーや営業職が向いています。プロジェクトマネージャーでは、計画を立ててチームをリードし、営業職では、人との関係を築きながら目標を達成することができます。どちらも計画性と社交的なスキルが求められる職業です。"
    elif (highest_trait == 'conscientiousness' and second_highest_trait == 'neuroticism') or (second_highest_trait == 'conscientiousness' and highest_trait == 'neuroticism'):
        return "計画的で責任感が強い一方で、心配や不安を感じやすいこのタイプの人は、詳細に注意を払う必要がある職業（例えば、品質管理やアナリスト）が向いています。責任感を持って物事を進める能力がありながらも、ストレス管理が重要です。細部に気を配りつつ、心の安定を保ちながら仕事をすることで、高い成果を上げることができるでしょう。"
    elif (highest_trait == 'extroversion' and second_highest_trait == 'neuroticism') or (second_highest_trait == 'extroversion' and highest_trait == 'neuroticism'):
        return "このタイプの人は、社交的でエネルギッシュですが、ストレスや心配に敏感で、感情が不安定になることがあります。こうした特徴を活かせる職業としては、カスタマーサポートやイベントプランナーが考えられます。カスタマーサポートでは社交的なスキルを活かせますし、イベントプランナーでは人と関わることが多く、エネルギーを持って取り組むことができます。ただし、ストレス管理のスキルが必要です。"
    else:
        return "特定の傾向が見られませんが、全体的にバランスが取れているようです。"
    



if __name__ == '__main__':
    app.run(debug=True)
