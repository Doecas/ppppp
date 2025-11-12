import React, { useState } from 'react';
import { Heart, Repeat2, MessageCircle, Share, MoreHorizontal, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockToggleLike } from '../mock';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '../hooks/use-toast';

const TweetCard = ({ tweet, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(tweet.isLiked);
  const [isRetweeted, setIsRetweeted] = useState(tweet.isRetweeted);
  const [likes, setLikes] = useState(tweet.likes);
  const [retweets, setRetweets] = useState(tweet.retweets);

  const handleLike = async (e) => {
    e.stopPropagation();
    await mockToggleLike(tweet.id);
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleRetweet = async (e) => {
    e.stopPropagation();
    setIsRetweeted(!isRetweeted);
    setRetweets(isRetweeted ? retweets - 1 : retweets + 1);
    toast({
      title: isRetweeted ? 'Retweet removed' : 'Retweeted!',
      duration: 2000
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    toast({
      title: 'Link copied to clipboard!',
      duration: 2000
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(tweet.id);
    toast({
      title: 'Tweet deleted',
      duration: 2000
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const isOwnTweet = user?.id === tweet.author.id;

  return (
    <div
      className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/tweet/${tweet.id}`)}
    >
      <div className="flex space-x-3">
        <Avatar
          className="w-12 h-12 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${tweet.author.username}`);
          }}
        >
          <AvatarImage src={tweet.author.avatar} />
          <AvatarFallback>{tweet.author.displayName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${tweet.author.username}`);
              }}
            >
              <span className="font-semibold text-gray-900 hover:underline">
                {tweet.author.displayName}
              </span>
              <span className="text-gray-500 text-sm">@{tweet.author.username}</span>
              <span className="text-gray-500 text-sm">· {formatTime(tweet.createdAt)}</span>
            </div>

            {isOwnTweet && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-gray-900 mb-3 whitespace-pre-wrap">{tweet.content}</p>

          {tweet.media && tweet.media.length > 0 && (
            <div className="mb-3 rounded-xl overflow-hidden">
              <img
                src={tweet.media[0]}
                alt="Tweet media"
                className="w-full object-cover max-h-96"
              />
            </div>
          )}

          {tweet.hashtags && tweet.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tweet.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/hashtag/${tag.replace('#', '')}`);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between max-w-md mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tweet/${tweet.id}`);
              }}
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">{tweet.replies}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-green-50 ${
                isRetweeted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
              }`}
              onClick={handleRetweet}
            >
              <Repeat2 className="w-5 h-5 mr-1" />
              <span className="text-sm">{retweets}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-red-50 ${
                isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleShare}
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;