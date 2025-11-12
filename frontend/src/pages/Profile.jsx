import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon, Settings } from 'lucide-react';
import Layout from '../components/Layout';
import TweetCard from '../components/TweetCard';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { users, tweets as mockTweets, mockToggleFollow } from '../mock';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  // Find the profile user
  const profileUser = username === currentUser?.username 
    ? currentUser 
    : users.find(u => u.username === username);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(profileUser?.followers || 0);

  // Get user's tweets
  const userTweets = mockTweets.filter(t => t.author.username === username);

  const isOwnProfile = currentUser?.username === username;

  const handleFollow = async () => {
    await mockToggleFollow(profileUser.id);
    setIsFollowing(!isFollowing);
    setFollowers(isFollowing ? followers - 1 : followers + 1);
  };

  if (!profileUser) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 backdrop-blur-sm bg-opacity-90 z-10">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profileUser.displayName}</h1>
              <p className="text-sm text-gray-500">{userTweets.length} posts</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600">
          {profileUser.coverImage && (
            <img
              src={profileUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback className="text-3xl">{profileUser.displayName[0]}</AvatarFallback>
            </Avatar>
            
            {isOwnProfile ? (
              <Button
                variant="outline"
                className="mt-16 rounded-full"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button
                className={`mt-16 rounded-full ${
                  isFollowing
                    ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{profileUser.displayName}</h2>
            <p className="text-gray-500">@{profileUser.username}</p>
            {profileUser.isPrivate && (
              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                Private Account
              </span>
            )}
          </div>

          {profileUser.bio && (
            <p className="text-gray-900 mb-4">{profileUser.bio}</p>
          )}

          <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Joined January 2023</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <button className="hover:underline">
              <span className="font-bold text-gray-900">{profileUser.following}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-gray-900">{followers}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="tweets"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8"
            >
              Replies
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8"
            >
              Media
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-8"
            >
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tweets" className="mt-0">
            {userTweets.length > 0 ? (
              userTweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No posts yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="replies" className="mt-0">
            <div className="p-8 text-center text-gray-500">
              <p>No replies yet</p>
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-0">
            <div className="p-8 text-center text-gray-500">
              <p>No media yet</p>
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-0">
            <div className="p-8 text-center text-gray-500">
              <p>No likes yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;