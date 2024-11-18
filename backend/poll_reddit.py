import praw
import psycopg2
from datetime import datetime
import time
import os
import math
from dotenv import load_dotenv
from anthropic_api import analyze_anthropic_sentiment
from base_model import analyze_base_sentiment

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

db_uri = os.getenv('DATABASE_URI')

polling_interval = int(os.getenv('POLLING_INTERVAL', 86400)) # 86400 daily, 3600 hourly 

def poll_reddit():
    while True:
        try:
            conn = psycopg2.connect(db_uri)
            cur = conn.cursor()
            
            insert_query = """
            INSERT INTO posts (post_id, author, created_utc, num_comments, score, selftext, title, subreddit, post_type, url, permalink, anthropic_sentiment, flair, anthropic_mood_score, base_mood_score, base_sentiment)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (post_id) 
            DO NOTHING;
            """
            
            check_query = "SELECT 1 FROM posts WHERE post_id = %s;"

            def calculate_weighted_sentiment(sentiment, score, num_comments):
                neutral_weight = 0.1
                sentiment_weight = sentiment if sentiment is not None else neutral_weight
                engagement_factor = (math.sqrt(score + 1) + math.sqrt(num_comments + 1)) / 2
                weighted_sentiment = sentiment_weight * engagement_factor
                clamped_score = max(-1, min(1, weighted_sentiment / 10))
                normalized_score = clamped_score * 100
                return normalized_score

            for submission in reddit.subreddit("gatech").new(limit=100):
                print(f"Processing submission: {submission.id} - {submission.title}")
                cur.execute(check_query, (submission.id,))
                if cur.fetchone():
                    print(f"Post {submission.id} already exists in the database. Stopping polling.")
                    break

                post_type = 'text' if submission.is_self else 'link'
                
                structured_message = f"""
                Title: {submission.title}
                Flair: {submission.link_flair_text or 'No flair'}
                Text: {submission.selftext or 'No text'}
                """
                score, num_comments = submission.score, submission.num_comments
                anthropic_sentiment = analyze_anthropic_sentiment(structured_message)
                anthropic_mood_score = calculate_weighted_sentiment(
                    anthropic_sentiment, score, num_comments
                )
                
                base_sentiment = analyze_base_sentiment(submission.selftext, submission.title, submission.link_flair_text)
                base_mood_score = calculate_weighted_sentiment(
                    base_sentiment, score, num_comments
                )
            
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
                    anthropic_sentiment,
                    submission.link_flair_text,
                    anthropic_mood_score,
                    base_mood_score,
                    base_sentiment,
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