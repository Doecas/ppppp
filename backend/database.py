from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db['users']
tweets_collection = db['tweets']
likes_collection = db['likes']
retweets_collection = db['retweets']
follows_collection = db['follows']
blocks_collection = db['blocks']
notifications_collection = db['notifications']


async def init_db():
    """Initialize database indexes"""
    # User indexes
    await users_collection.create_index('username', unique=True)
    await users_collection.create_index('email', unique=True)
    await users_collection.create_index('email_verification_token')
    await users_collection.create_index('password_reset_token')
    
    # Tweet indexes
    await tweets_collection.create_index('author_id')
    await tweets_collection.create_index('created_at')
    await tweets_collection.create_index('hashtags')
    await tweets_collection.create_index('parent_tweet_id')
    
    # Interaction indexes
    await likes_collection.create_index([('user_id', 1), ('tweet_id', 1)], unique=True)
    await retweets_collection.create_index([('user_id', 1), ('tweet_id', 1)], unique=True)
    await follows_collection.create_index([('follower_id', 1), ('following_id', 1)], unique=True)
    await blocks_collection.create_index([('blocker_id', 1), ('blocked_id', 1)], unique=True)
    
    # Notification indexes
    await notifications_collection.create_index('user_id')
    await notifications_collection.create_index('created_at')
    await notifications_collection.create_index([('user_id', 1), ('read', 1)])
