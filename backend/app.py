from flask import Flask, jsonify, request
from backend.models import get_posts
import logging
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/posts/', methods=['GET'])
def posts():
    """List all posts"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', type=int)

        # Convert date strings to datetime objects
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

        posts = get_posts(start_date=start_date, end_date=end_date, limit=limit)
        logger.info(f"Fetched posts: {posts}")  # Debugging line
        return jsonify(posts)
    except Exception as e:
        logger.error(f"Error fetching posts: {e}")
        return jsonify({"error": "An error occurred while fetching posts"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)