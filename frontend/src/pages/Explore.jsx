import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import TweetCard from '../components/TweetCard';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { tweets, users, trendingHashtags, mockToggleFollow } from '../mock';

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], tweets: [] });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const foundUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.displayName.toLowerCase().includes(query) ||
        user.bio?.toLowerCase().includes(query)
    );

    const foundTweets = tweets.filter((tweet) =>
      tweet.content.toLowerCase().includes(query)
    );

    setSearchResults({ users: foundUsers, tweets: foundTweets });
    setHasSearched(true);
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 backdrop-blur-sm bg-opacity-90 z-10">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Explore</h1>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for people, topics, or posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50"
              />
            </div>
          </form>
        </div>

        {hasSearched ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
              >
                People
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
              >
                Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {searchResults.users.length === 0 && searchResults.tweets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-semibold">No results found</p>
                  <p className="text-sm">Try searching for something else</p>
                </div>
              ) : (
                <div>
                  {searchResults.users.length > 0 && (
                    <div className="border-b border-gray-200">
                      <h3 className="px-4 py-3 font-semibold text-gray-900">People</h3>
                      {searchResults.users.map((user) => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  )}
                  {searchResults.tweets.length > 0 && (
                    <div>
                      <h3 className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-200">Posts</h3>
                      {searchResults.tweets.map((tweet) => (
                        <TweetCard key={tweet.id} tweet={tweet} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="people" className="mt-0">
              {searchResults.users.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No users found</p>
                </div>
              ) : (
                searchResults.users.map((user) => <UserCard key={user.id} user={user} />)
              )}
            </TabsContent>

            <TabsContent value="posts" className="mt-0">
              {searchResults.tweets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No posts found</p>
                </div>
              ) : (
                searchResults.tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            {/* Trending Section */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Now
              </h2>
              <div className="space-y-1">
                {trendingHashtags.map((hashtag, index) => (
                  <button
                    key={hashtag.tag}
                    onClick={() => navigate(`/hashtag/${hashtag.tag}`)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">#{index + 1} Trending</p>
                        <p className="font-bold text-gray-900 text-lg">#{hashtag.tag}</p>
                        <p className="text-sm text-gray-500">{hashtag.count.toLocaleString()} posts</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="border-t border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Who to follow</h2>
              <div className="space-y-1">
                {users.slice(0, 3).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async (e) => {
    e.stopPropagation();
    await mockToggleFollow(user.id);
    setIsFollowing(!isFollowing);
  };

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/profile/${user.username}`)}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900">{user.displayName}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
          {user.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{user.bio}</p>}
        </div>
      </div>
      <Button
        size="sm"
        className={`rounded-full ${
          isFollowing
            ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        onClick={handleFollow}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
};

export default Explore;