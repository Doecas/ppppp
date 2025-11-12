import re
from bson import ObjectId
from typing import List
from datetime import datetime


def extract_hashtags(content: str) -> List[str]:
    """Extract hashtags from tweet content"""
    hashtag_pattern = r'#\w+'
    hashtags = re.findall(hashtag_pattern, content)
    return hashtags


def user_to_response(user_doc: dict, followers: int = 0, following: int = 0) -> dict:
    """Convert MongoDB user document to response format"""
    return {
        "id": str(user_doc['_id']),
        "username": user_doc['username'],
        "display_name": user_doc['display_name'],
        "email": user_doc['email'],
        "bio": user_doc.get('bio', ''),
        "avatar": user_doc.get('avatar', f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_doc['username']}"),
        "cover_image": user_doc.get('cover_image'),
        "location": user_doc.get('location'),
        "website": user_doc.get('website'),
        "is_private": user_doc.get('is_private', False),
        "email_verified": user_doc.get('email_verified', False),
        "followers": followers,
        "following": following,
        "created_at": user_doc.get('created_at', datetime.utcnow())
    }


async def get_user_response(user_doc: dict, follows_collection, current_user_id: str = None) -> dict:
    """Get user response with follower/following counts"""
    from database import follows_collection as follows_col
    
    user_id = user_doc['_id']
    
    # Count followers and following
    followers_count = await follows_col.count_documents({"following_id": user_id})
    following_count = await follows_col.count_documents({"follower_id": user_id})
    
    return user_to_response(user_doc, followers_count, following_count)


async def get_tweet_stats(tweet_id: ObjectId, likes_collection, retweets_collection, tweets_collection, current_user_id: ObjectId = None):
    """Get tweet interaction stats"""
    likes_count = await likes_collection.count_documents({"tweet_id": tweet_id})
    retweets_count = await retweets_collection.count_documents({"tweet_id": tweet_id})
    replies_count = await tweets_collection.count_documents({"parent_tweet_id": tweet_id})
    
    is_liked = False
    is_retweeted = False
    
    if current_user_id:
        is_liked = await likes_collection.find_one({"user_id": current_user_id, "tweet_id": tweet_id}) is not None
        is_retweeted = await retweets_collection.find_one({"user_id": current_user_id, "tweet_id": tweet_id}) is not None
    
    return {
        "likes": likes_count,
        "retweets": retweets_count,
        "replies": replies_count,
        "is_liked": is_liked,
        "is_retweeted": is_retweeted
    }
