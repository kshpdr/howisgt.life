# a script to correct scores, if API anthropic balance was not sufficient to make API calls during regular polling
import psycopg2
import math
from datetime import datetime
import os
from dotenv import load_dotenv
from anthropic_api import analyze_anthropic_sentiment

load_dotenv()

db_uri = os.getenv('DATABASE_URI')

def calculate_weighted_sentiment(sentiment, score, num_comments):
    neutral_weight = 0.1
    sentiment_weight = sentiment if sentiment is not None else neutral_weight
    engagement_factor = (math.sqrt(score + 1) + math.sqrt(num_comments + 1)) / 2
    weighted_sentiment = sentiment_weight * engagement_factor
    clamped_score = max(-1, min(1, weighted_sentiment / 10))
    normalized_score = clamped_score * 100
    return normalized_score

def update_mood_scores(days=3):
    try:
        conn = psycopg2.connect(db_uri)
        cur = conn.cursor()

        fetch_query = """
        SELECT post_id, score, num_comments, title, selftext, flair 
        FROM posts 
        WHERE created_utc >= NOW() - INTERVAL '%s days';
        """ % days
        cur.execute(fetch_query)
        posts = cur.fetchall()

        update_query = """
        UPDATE posts
        SET anthropic_mood_score = %s, anthropic_sentiment = %s
        WHERE post_id = %s;
        """
        
        for post in posts:
            print(post)
            post_id, score, num_comments, title, selftext, flair = post
                        
            structured_message = f"""
            Title: {title}
            Flair: {flair or 'No flair'}
            Text: {selftext or 'No text'}
            """
            
            anthropic_sentiment = analyze_anthropic_sentiment(structured_message)
            
            anthropic_mood_score = calculate_weighted_sentiment(anthropic_sentiment, score, num_comments)
            cur.execute(update_query, (anthropic_mood_score, anthropic_sentiment, post_id))

        conn.commit()
        cur.close()
        conn.close()

        print(f"Updated mood scores for posts from the last {days} days at {datetime.now()}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    update_mood_scores(days=3) 