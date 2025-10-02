'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data when it's available
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setProfileImage(profile.avatar_url || null);
    }
  }, [profile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          bio: bio,
          avatar_url: profileImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully!');
      
      // Refresh the profile in the auth context
      await refreshProfile();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile values
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setProfileImage(profile.avatar_url || null);
    }
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Manage your personal information and security settings.
                </p>
              </div>

              {/* Profile Picture Section */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h2>
                  <div className="flex items-center gap-6">
                    {/* Profile Picture Display */}
                    <div className="relative">
                      {profileImage ? (
                        <Image 
                          src={profileImage} 
                          alt="Profile" 
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1173d4] to-[#0d5ba8] flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200 dark:border-gray-700">
                          CM
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Upload a new profile picture. JPG, PNG or GIF. Max file size 2MB.
                      </p>
                      <div className="flex gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={handleUploadClick}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload Photo
                        </Button>
                        {profileImage && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleRemoveImage}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                  
                  {/* Success Message */}
                  {successMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 text-sm">
                      {successMessage}
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-6">
                    <Input 
                      label="Name" 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input 
                      label="Email" 
                      type="email" 
                      value={profile?.email || ''}
                      disabled
                    />
                    <Input 
                      label="Role" 
                      type="text" 
                      value={profile?.role || 'Team Member'}
                      disabled
                    />
                    <Input 
                      label="Phone Number" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        className="w-full rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[100px]"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 px-6 py-4">
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Security</h2>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Last changed on Jan 1, 2024
                        </p>
                      </div>
                      <Button variant="secondary">Change Password</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}