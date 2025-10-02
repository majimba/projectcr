'use client';

import { useState } from 'react';
import Button from './ui/Button';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  tasks: string;
  avatar_url?: string | null;
  bio: string;
  phone: string;
  is_active: boolean;
  joined_at: string;
}

interface TeamMemberDetailProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberDetail({ member, isOpen, onClose }: TeamMemberDetailProps) {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Bio */}
            {member.bio && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Assigned Tasks */}
            {member.tasks && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Assigned Tasks
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.tasks}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16">
                    Email:
                  </span>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
                {member.phone && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16">
                      Phone:
                    </span>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Status and Join Date */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20">
                    Status:
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20">
                    Joined:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {new Date(member.joined_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // TODO: Implement edit functionality
                console.log('Edit member:', member.id);
              }}
            >
              Edit Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}




