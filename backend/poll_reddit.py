import praw
import psycopg2
from datetime import datetime
import time
import os
from dotenv import load_dotenv
from anthropic_api import analyze_anthropic_sentiment

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

db_uri = os.getenv('DATABASE_URI')

polling_interval = int(os.getenv('POLLING_INTERVAL', 3600)) # 86400 daily, 3600 hourly 

def poll_reddit():
    while True:
        try:
            conn = psycopg2.connect(db_uri)
            cur = conn.cursor()
            
            insert_query = """
            INSERT INTO posts (post_id, author, created_utc, num_comments, score, selftext, title, subreddit, post_type, url, permalink, anthropic_sentiment)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (post_id) 
            DO UPDATE SET 
                anthropic_sentiment = EXCLUDED.anthropic_sentiment;
            """

            for submission in reddit.subreddit("gatech").new(limit=1000):
                post_type = 'text' if submission.is_self else 'link'
                
                structured_message = f"""
                Title: {submission.title}
                Flair: {submission.link_flair_text or 'No flair'}
                Text: {submission.selftext or 'No text'}
                """    
                anthropic_sentiment = analyze_anthropic_sentiment(structured_message)
                # print(structured_message)
                # print(anthropic_sentiment)
            
                cur.execute(insert_query, (
                    submission.id,
                    str(submission.author),
                    datetime.utcfromtimestamp(submission.created_utc),
                    submission.num_comments,
                    submission.score,
                    submission.selftext,
                    submission.title,
                    submission.subreddit.display_name,
                    post_type,
                    submission.url,
                    submission.permalink,
                    anthropic_sentiment
                ))

            conn.commit()

            cur.close()
            conn.close()

            print(f"Polled and inserted new posts at {datetime.now()}")

        except Exception as e:
            print(f"An error occurred: {e}")

        time.sleep(polling_interval)

if __name__ == '__main__':
    poll_reddit()