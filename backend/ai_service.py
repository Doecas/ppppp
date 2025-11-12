import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
import logging

load_dotenv()
logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')


async def generate_tweet_content(prompt: str, max_length: int = 280) -> str:
    """Generate tweet content using Claude"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="tweet-generation",
            system_message=f"You are a helpful AI assistant that creates engaging social media content. Generate tweets that are concise, engaging, and under {max_length} characters. Do not include hashtags unless specifically requested."
        ).with_model("anthropic", "claude-3-7-sonnet-20250219")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Trim to max length if needed
        content = response.strip()
        if len(content) > max_length:
            content = content[:max_length-3] + "..."
        
        return content
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise Exception("Failed to generate content")


async def suggest_hashtags(content: str) -> list:
    """Suggest relevant hashtags for tweet content"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="hashtag-suggestion",
            system_message="You are a helpful AI assistant that suggests relevant hashtags for social media posts. Return only the hashtags, one per line, with the # symbol. Suggest 3-5 relevant hashtags."
        ).with_model("anthropic", "claude-3-7-sonnet-20250219")
        
        prompt = f"Suggest relevant hashtags for this tweet: '{content}'"
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse hashtags from response
        hashtags = []
        for line in response.strip().split('\n'):
            line = line.strip()
            if line.startswith('#'):
                # Extract just the hashtag part
                tag = line.split()[0] if ' ' in line else line
                hashtags.append(tag)
        
        return hashtags[:5]  # Return max 5 hashtags
    except Exception as e:
        logger.error(f"Error suggesting hashtags: {str(e)}")
        return []


async def analyze_tweet(tweet_content: str) -> dict:
    """Analyze tweet for sentiment, topics, and engagement potential"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="tweet-analysis",
            system_message="You are a helpful AI assistant that analyzes social media content. Provide sentiment (positive/neutral/negative), topics (2-3 keywords), engagement prediction (low/medium/high), and 2-3 actionable suggestions to improve the tweet. Format your response as: SENTIMENT: [sentiment]\nTOPICS: [topic1, topic2, topic3]\nENGAGEMENT: [prediction]\nSUGGESTIONS: [suggestion1] | [suggestion2] | [suggestion3]"
        ).with_model("anthropic", "claude-3-7-sonnet-20250219")
        
        prompt = f"Analyze this tweet: '{tweet_content}'"
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse response
        analysis = {
            "sentiment": "neutral",
            "topics": [],
            "engagement_prediction": "medium",
            "suggestions": []
        }
        
        for line in response.strip().split('\n'):
            if line.startswith('SENTIMENT:'):
                analysis['sentiment'] = line.split(':', 1)[1].strip().lower()
            elif line.startswith('TOPICS:'):
                topics_str = line.split(':', 1)[1].strip()
                analysis['topics'] = [t.strip() for t in topics_str.split(',')]
            elif line.startswith('ENGAGEMENT:'):
                analysis['engagement_prediction'] = line.split(':', 1)[1].strip().lower()
            elif line.startswith('SUGGESTIONS:'):
                suggestions_str = line.split(':', 1)[1].strip()
                analysis['suggestions'] = [s.strip() for s in suggestions_str.split('|')]
        
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing tweet: {str(e)}")
        return {
            "sentiment": "neutral",
            "topics": [],
            "engagement_prediction": "medium",
            "suggestions": ["Unable to analyze at this time"]
        }
