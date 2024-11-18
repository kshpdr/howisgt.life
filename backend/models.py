import psycopg2
from backend.config import Config
from datetime import datetime

def get_db_connection():
    conn = psycopg2.connect(Config.DATABASE_URI)
    return conn

def get_posts(start_date=None, end_date=None, limit=None):
    conn = get_db_connection()
    cur = conn.cursor()

    # Fetch all columns dynamically
    query = 'SELECT * FROM posts WHERE 1=1'
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

    # Fetch column names
    colnames = [desc[0] for desc in cur.description]

    cur.close()
    conn.close()

    # Convert rows to list of dictionaries using column names
    posts = []
    for row in rows:
        post = {colname: value for colname, value in zip(colnames, row)}
        posts.append(post)

    return posts