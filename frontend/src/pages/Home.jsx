import React, { useState } from 'react';
import { Sparkles, Image, Smile } from 'lucide-react';
import Layout from '../components/Layout';
import TweetCard from '../components/TweetCard';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { tweets as mockTweets, mockCreateTweet } from '../mock';
import { useToast } from '../hooks/use-toast';

const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState(mockTweets);
  const [isPosting, setIsPosting] = useState(false);

  const handlePostTweet = async () => {
    if (!tweetContent.trim()) return;

    setIsPosting(true);
    const result = await mockCreateTweet(tweetContent);
    if (result.success) {
      setTweets([result.tweet, ...tweets]);
      setTweetContent('');
      toast({
        title: 'Tweet posted!',
        duration: 2000
      });
    }
    setIsPosting(false);
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets(tweets.filter(t => t.id !== tweetId));
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 backdrop-blur-sm bg-opacity-90 z-10">
          <h1 className="text-xl font-bold text-gray-900">Home</h1>
        </div>

        {/* Create Tweet */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's happening?"
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                className="min-h-24 border-0 resize-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Image className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  onClick={handlePostTweet}
                  disabled={!tweetContent.trim() || isPosting}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} onDelete={handleDeleteTweet} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;