-- データベースファイルを開く
.open stepup.db

-- 表示モードをboxに変更
.mode box

-- goalsテーブルを削除（存在する場合）
DROP TABLE IF EXISTS goals;

-- goalsテーブルを作成
CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    user_id INTEGER NOT NULL,
    traits TEXT -- traits列を追加
);

-- goalsテーブルにデータを挿入
INSERT INTO goals (title, description, due_date, user_id)
VALUES ('test', 'test', '2024-08-11', 37022500);

-- goalsテーブルのデータを確認
SELECT * FROM goals;

-- usersテーブルを削除（存在する場合）
DROP TABLE IF EXISTS users;

-- usersテーブルを作成
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_id INTEGER
);

-- usersテーブルにデータを挿入
-- パスワードはハッシュ化されるべきで、平文ではない
INSERT INTO users (username, password, user_id)
VALUES ('test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 37022500);

-- usersテーブルのデータを確認
SELECT * FROM users;

-- typesテーブルを削除（存在する場合）
DROP TABLE IF EXISTS types;

-- typesテーブルを作成
CREATE TABLE types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    ele INTEGER
);

-- typesテーブルにデータを挿入
INSERT INTO types (user_id, type, ele)
VALUES (37022500, '1', 0);

-- typesテーブルのデータを確認
SELECT * FROM types;
