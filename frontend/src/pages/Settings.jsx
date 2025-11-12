import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Shield, Bell as BellIcon } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: '',
    website: ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [privacy, setPrivacy] = useState({
    isPrivate: user?.isPrivate || false,
    allowTagging: true,
    allowDirectMessages: true
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUser(profile);
    toast({
      title: 'Profile updated!',
      description: 'Your changes have been saved.',
      duration: 2000
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }
    toast({
      title: 'Password updated!',
      description: 'Your password has been changed successfully.',
      duration: 2000
    });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handlePrivacyUpdate = (key, value) => {
    setPrivacy({ ...privacy, [key]: value });
    if (key === 'isPrivate') {
      updateUser({ isPrivate: value });
    }
    toast({
      title: 'Privacy settings updated',
      duration: 2000
    });
  };

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
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
            >
              <Lock className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="p-4">
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Where are you based?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            </form>
          </TabsContent>

          {/* Password Settings */}
          <TabsContent value="password" className="p-4">
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Change Password
              </Button>
            </form>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="p-4">
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Private Account</h3>
                  <p className="text-sm text-gray-500">Only approved followers can see your posts</p>
                </div>
                <Switch
                  checked={privacy.isPrivate}
                  onCheckedChange={(checked) => handlePrivacyUpdate('isPrivate', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Allow Tagging</h3>
                  <p className="text-sm text-gray-500">Let others tag you in posts</p>
                </div>
                <Switch
                  checked={privacy.allowTagging}
                  onCheckedChange={(checked) => handlePrivacyUpdate('allowTagging', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Direct Messages</h3>
                  <p className="text-sm text-gray-500">Allow direct messages from anyone</p>
                </div>
                <Switch
                  checked={privacy.allowDirectMessages}
                  onCheckedChange={(checked) => handlePrivacyUpdate('allowDirectMessages', checked)}
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Blocked Accounts</h3>
                <p className="text-sm text-gray-500 mb-4">Manage users you've blocked</p>
                <Button variant="outline">View Blocked Accounts</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;