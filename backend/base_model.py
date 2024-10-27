def analyze_base_sentiment(text, title, flair):
    """Analyze sentiment using base model based on heuristics."""
    
    keyword_sentiments = {
        "happy": 1,
        "joy": 1,
        "love": 1,
        "great": 1,
        "excellent": 1,
        "sad": -1,
        "angry": -1,
        "hate": -1,
        "bad": -1,
        "terrible": -1,
    }

    tag_sentiments = {
        "Social/Club": 1,
        "Sports": 1,
        "Rant": -1,
        "Meme/Shitpost": 0,
        "Photo": 0,
        "Discussion": 0,
        "Question": 0,
        "Job Listing": 0,
        "Survey/Study/Poll": 0,
        "News": 0,
        "Announcement": 0,
        "Other": 0,
    }
    
    if text:
        for keyword, sentiment in keyword_sentiments.items():
            if keyword in text.lower():
                return sentiment

    if title:
        for keyword, sentiment in keyword_sentiments.items():
            if keyword in title.lower():
                return sentiment

    return tag_sentiments.get(flair, 0)
