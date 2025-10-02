'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationDropdown from '@/app/components/ui/NotificationDropdown';

export default function TopBar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { unreadCount, error: notificationsError } = useNotifications();

  return (
    <header className="h-16 bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between px-6">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <Image
            src="/assets/logos/luminary-logo-2000x2000.png"
            alt="Luminary Co. Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Project CR</h1>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            className="w-64 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500" 
            placeholder="Search..." 
            type="text"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification Badge - only show if there are unread notifications and no error */}
            {!notificationsError && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          <NotificationDropdown 
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1173d4] to-[#0d5ba8] flex items-center justify-center text-white text-sm font-medium">
                {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>
            )}
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1173d4] to-[#0d5ba8] flex items-center justify-center text-white text-sm font-medium">
                      {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {profile?.full_name || user?.email || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>
              <Link 
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setShowProfileMenu(false)}
              >
                Your Profile
              </Link>
              <Link 
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setShowProfileMenu(false)}
              >
                Settings
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2"></div>
              <button 
                onClick={signOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
