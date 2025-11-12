import React, { useState } from 'react';
import { Heart, Repeat2, UserPlus, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { notifications as mockNotifications } from '../mock';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications] = useState(mockNotifications);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-8 h-8 text-red-600 fill-current" />;
      case 'retweet':
        return <Repeat2 className="w-8 h-8 text-green-600" />;
      case 'follow':
        return <UserPlus className="w-8 h-8 text-blue-600" />;
      case 'reply':
        return <MessageCircle className="w-8 h-8 text-blue-600" />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.user.displayName} liked your post`;
      case 'retweet':
        return `${notification.user.displayName} retweeted your post`;
      case 'follow':
        return `${notification.user.displayName} followed you`;
      case 'reply':
        return `${notification.user.displayName} replied to your post`;
      default:
        return '';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 backdrop-blur-sm bg-opacity-90 z-10">
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>

        {/* Notifications List */}
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                if (notification.tweet) {
                  navigate(`/tweet/${notification.tweet.id}`);
                } else if (notification.type === 'follow') {
                  navigate(`/profile/${notification.user.username}`);
                }
              }}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-semibold">{notification.user.displayName}</span>
                        {' '}
                        <span className="text-gray-600">
                          {notification.type === 'like' && 'liked your post'}
                          {notification.type === 'retweet' && 'retweeted your post'}
                          {notification.type === 'follow' && 'followed you'}
                          {notification.type === 'reply' && 'replied to your post'}
                        </span>
                      </p>
                      {notification.content && (
                        <p className="text-gray-600 mt-1">{notification.content}</p>
                      )}
                      {notification.tweet && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {notification.tweet.content}
                        </p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">{formatTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold">No notifications yet</p>
            <p className="text-sm">When someone interacts with your posts, you'll see it here</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;