// Mock data for Clone X application

export const currentUser = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  email: 'john@example.com',
  bio: 'Software developer | Tech enthusiast | Coffee lover ☕',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
  followers: 1234,
  following: 567,
  isPrivate: false,
  emailVerified: true,
  createdAt: '2023-01-15T10:30:00Z'
};

export const users = [
  {
    id: '2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    bio: 'Designer | UI/UX Expert | Creating beautiful experiences',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    followers: 2341,
    following: 432,
    isPrivate: false,
    emailVerified: true
  },
  {
    id: '3',
    username: 'techguru',
    displayName: 'Tech Guru',
    bio: 'Tech blogger | AI enthusiast | Sharing daily tech insights',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    followers: 5678,
    following: 234,
    isPrivate: false,
    emailVerified: true
  },
  {
    id: '4',
    username: 'sarahsmith',
    displayName: 'Sarah Smith',
    bio: 'Product Manager | Building the future',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    followers: 987,
    following: 654,
    isPrivate: true,
    emailVerified: true
  }
];

export const tweets = [
  {
    id: '1',
    content: 'Just launched my new project! Check it out and let me know what you think. #coding #webdev',
    author: users[0],
    createdAt: '2025-07-20T14:30:00Z',
    likes: 45,
    retweets: 12,
    replies: 8,
    isLiked: false,
    isRetweeted: false,
    hashtags: ['coding', 'webdev'],
    media: []
  },
  {
    id: '2',
    content: 'The future of AI is here and it\'s absolutely fascinating! Can\'t wait to see where this technology takes us. #AI #MachineLearning #Tech',
    author: users[1],
    createdAt: '2025-07-20T13:15:00Z',
    likes: 156,
    retweets: 34,
    replies: 23,
    isLiked: true,
    isRetweeted: false,
    hashtags: ['AI', 'MachineLearning', 'Tech'],
    media: []
  },
  {
    id: '3',
    content: 'Just finished reading an amazing book on design thinking. Highly recommend it to anyone in the creative field!',
    author: users[0],
    createdAt: '2025-07-20T10:45:00Z',
    likes: 89,
    retweets: 23,
    replies: 15,
    isLiked: false,
    isRetweeted: true,
    hashtags: [],
    media: []
  },
  {
    id: '4',
    content: 'Working on something exciting today! Stay tuned for updates. #ProductDevelopment',
    author: users[2],
    createdAt: '2025-07-20T09:20:00Z',
    likes: 234,
    retweets: 45,
    replies: 34,
    isLiked: true,
    isRetweeted: false,
    hashtags: ['ProductDevelopment'],
    media: []
  },
  {
    id: '5',
    content: 'Beautiful sunset today! 🌅',
    author: users[1],
    createdAt: '2025-07-19T19:30:00Z',
    likes: 567,
    retweets: 89,
    replies: 45,
    isLiked: false,
    isRetweeted: false,
    hashtags: [],
    media: ['https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&h=400&fit=crop']
  }
];

export const notifications = [
  {
    id: '1',
    type: 'like',
    user: users[1],
    tweet: tweets[0],
    createdAt: '2025-07-20T15:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'follow',
    user: users[2],
    createdAt: '2025-07-20T14:20:00Z',
    read: false
  },
  {
    id: '3',
    type: 'retweet',
    user: users[0],
    tweet: tweets[1],
    createdAt: '2025-07-20T13:10:00Z',
    read: true
  },
  {
    id: '4',
    type: 'reply',
    user: users[1],
    tweet: tweets[2],
    content: 'Great insight! Thanks for sharing.',
    createdAt: '2025-07-20T12:00:00Z',
    read: true
  }
];

export const trendingHashtags = [
  { tag: 'AI', count: 12453 },
  { tag: 'WebDev', count: 8934 },
  { tag: 'Tech', count: 7821 },
  { tag: 'Coding', count: 6543 },
  { tag: 'Design', count: 5432 }
];

export const whoToFollow = users.slice(0, 3);

// Helper functions for mock interactions
export const mockLogin = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('user', JSON.stringify(currentUser));
        resolve({ success: true, user: currentUser });
      } else {
        resolve({ success: false, error: 'Invalid credentials' });
      }
    }, 500);
  });
};

export const mockRegister = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        followers: 0,
        following: 0,
        emailVerified: false,
        createdAt: new Date().toISOString()
      };
      resolve({ success: true, user: newUser });
    }, 500);
  });
};

export const mockToggleLike = (tweetId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

export const mockToggleFollow = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

export const mockCreateTweet = (content, media = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTweet = {
        id: Date.now().toString(),
        content,
        author: currentUser,
        createdAt: new Date().toISOString(),
        likes: 0,
        retweets: 0,
        replies: 0,
        isLiked: false,
        isRetweeted: false,
        hashtags: content.match(/#\w+/g) || [],
        media
      };
      resolve({ success: true, tweet: newTweet });
    }, 500);
  });
};