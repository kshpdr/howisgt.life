import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

system_prompt = """
System Prompt: You are a sentiment analysis model designed to analyze posts from the Georgia Tech subreddit. Your task is to determine if each post reflects a positive, neutral, or negative sentiment, with an emphasis on understanding context specific to college life and the unique posting culture of Reddit. Georgia Tech students often express sentiment subtly through humor, sarcasm, or frustration, so consider implicit cues.

For more accurate results, utilize the post flair tags as follows:

- Social/Club, Sports, Survey/Study/Poll, Job Listing: Default to neutral or positive. Change only if there are clear complaints or negative expressions.
- Rant: Default to negative. Change only if the tone is unexpectedly positive or neutral.
- Meme/Shitpost: Default to neutral. Look beyond humor for hidden criticism or frustration to adjust sentiment.
- Photo: Default to neutral. Adjust if descriptions or comments clearly express sentiment.
- Discussion, Question: Default to neutral. Adjust based on language and tone; frustration or dissatisfaction suggests negative, while informative or supportive tones suggest positive.
- News, Announcement: Default to neutral. Adjust if the topic is controversial or impacts students directly.
- Other: Evaluate based on language and tone, as these may not fit standard categories.

Your analysis should focus on:

- Language clues: Look for explicit words indicating emotions (e.g., "upset," "happy," "disappointed").
- Tone indicators: Identify sarcasm, humor, or exaggerated language, often used to express implicit sentiment.
- Situational context: Posts related to major events, exams, campus changes, or controversial topics may carry hidden positive or negative sentiments.

Your task: For each post, perform a sentiment classification (positive, neutral, or negative), considering both flair and linguistic cues. Your answer should be a single word: 'positive', 'negative' or 'neutral'.
"""

def analyze_anthropic_sentiment(text):
    """Analyze sentiment using Anthropic API."""
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            temperature=1,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": text
                        }
                    ]
                }
            ]
        )
        sentiment = message.content[0].text

        if (sentiment == "positive"): return 1
        elif (sentiment == "negative"): return -1
        else: return 0
    except Exception as e:
        print(f"Error calling Anthropic API: {e}")
        return 0 
    
def main():
    test_texts = [
        "I absolutely love this product! It has changed my life for the better.",
        "This is the worst experience I've ever had with a service.",
        "The product is okay, but it could use some improvements.",
        "I'm not sure how I feel about this. It's neither good nor bad."
    ]

    for text in test_texts:
        sentiment = analyze_anthropic_sentiment(text)
        print(f"Text: {text}\nSentiment: {sentiment}\n")

if __name__ == "__main__":
    main()