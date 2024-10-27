# howisgt.life

The idea of the project is to analyze Georgia Tech's subreddit to understand the overall mood on the campus. The endproduct is the website where one can see a mood meter: a graph over time that indicated the mood on campus on a given point of time. We  want to analyze every post, assign it a score and based on this adjust overall mood on the campus. We want to analyze text from the post, photo/video, and up- and down-votes. 

## Scoring methology

Sentiment score: -1, 0, 1
Engagement weight: weight = log(upvotes + 1) - log(downvotes + 1)


## Architecture 

1. Take a snapshot of a day daily.
2. Calculate all the scores for a given day. 
3. Put them in the database.

## Data scheme 
### Table: `posts`

Stores Reddit submissions for sentiment analysis.

- **`post_id`** (`VARCHAR(20)`): Unique post ID. Primary key.
- **`author`** (`VARCHAR(50)`): Post author's username.
- **`created_utc`** (`TIMESTAMP`): Post creation time (UTC).
- **`num_comments`** (`INTEGER`): Number of comments.
- **`score`** (`INTEGER`): Upvote count.
- **`selftext`** (`TEXT`): Post content (if selfpost).
- **`title`** (`TEXT`): Post title.
- **`subreddit`** (`VARCHAR(50)`): Subreddit name.
- **`post_type`** (`VARCHAR(20)`): 'text', 'media', or 'link'.
- **`sentiment_score`** (`FLOAT`): Calculated sentiment score.

### Table: `daily_mood_scores`

Tracks daily mood trends.

- **`date`** (`DATE`): Date of mood score. Primary key.
- **`mood_score`** (`FLOAT`): Daily mood score (-100 to 100).
- **`num_posts`** (`INTEGER`): Posts analyzed.
- **`num_comments`** (`INTEGER`): Comments analyzed.