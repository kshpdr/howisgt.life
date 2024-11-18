# a script to correct scores, if API anthropic balance was not sufficient to make API calls during regular polling
import psycopg2
import math
from datetime import datetime
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
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

def update_mood_scores(days, sentiment_function):
    try:
        conn = psycopg2.connect(db_uri)
        cur = conn.cursor()

        function_name = sentiment_function.__name__
        function_base_name = function_name.rsplit('_sentiment', 1)[0]
        sentiment_column = f"{function_base_name}_sentiment"
        mood_score_column = f"{function_base_name}_mood_score"

        cur.execute(f"""
        ALTER TABLE posts 
        ADD COLUMN IF NOT EXISTS {sentiment_column} FLOAT,
        ADD COLUMN IF NOT EXISTS {mood_score_column} FLOAT;
        """)

        fetch_query = """
        SELECT post_id, score, num_comments, title, selftext, flair 
        FROM posts 
        WHERE created_utc >= NOW() - INTERVAL '%s days';
        """ % days
        cur.execute(fetch_query)
        posts = cur.fetchall()

        update_query = f"""
        UPDATE posts
        SET {sentiment_column} = %s, {mood_score_column} = %s
        WHERE post_id = %s;
        """
        
        for post in posts:
            print(post)
            post_id, score, num_comments, title, selftext, flair = post
                        
            structured_message = f"""
            {title} | Selftext: {selftext or 'No text'} | Flair: {flair or 'No flair'}
            """
            
            sentiment = int(sentiment_function(structured_message))
            mood_score = int(calculate_weighted_sentiment(sentiment, score, num_comments))
            
            cur.execute(update_query, (sentiment, mood_score, post_id))

        conn.commit()
        cur.close()
        conn.close()

        print(f"Updated mood scores for posts from the last {days} days at {datetime.now()}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    
    from reddit_sentiment_analysis.models.logistic_regression.logistic_regression import logistic_regression_sentiment
    from reddit_sentiment_analysis.models.bert.bert import bert_sentiment
    update_mood_scores(days=365, sentiment_function=bert_sentiment)