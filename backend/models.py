import psycopg2
from backend.config import Config
from datetime import datetime

def get_db_connection():
    conn = psycopg2.connect(Config.DATABASE_URI)
    return conn

def get_posts(start_date=None, end_date=None, limit=None):
    conn = get_db_connection()
    cur = conn.cursor()

    query = 'SELECT post_id, author, created_utc, num_comments, score, selftext, title, subreddit, post_type, url, permalink, anthropic_sentiment, flair, anthropic_mood_score, base_mood_score, base_sentiment FROM posts WHERE 1=1'
    params = []

    if start_date:
        query += ' AND created_utc >= %s'
        params.append(start_date)

    if end_date:
        query += ' AND created_utc <= %s'
        params.append(end_date)

    if limit:
        query += ' ORDER BY created_utc DESC LIMIT %s'
        params.append(limit)

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Convert rows to list of dictionaries
    posts = []
    for row in rows:
        post = {
            'post_id': row[0],
            'author': row[1],
            'created_utc': row[2],
            'num_comments': row[3],
            'score': row[4],
            'selftext': row[5],
            'title': row[6],
            'subreddit': row[7],
            'post_type': row[8],
            'url': row[9],
            'permalink': row[10],
            'anthropic_sentiment': row[11],
            'flair': row[12],
            'anthropic_mood_score': row[13],
            'base_mood_score': row[14],
            'base_sentiment': row[15],
        }
        posts.append(post)

    return posts