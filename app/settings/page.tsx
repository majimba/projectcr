'use client';

import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';

export default function SettingsPage() {
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
  ];

  const themeOptions = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              </div>

              {/* Account Section */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account</h2>
                  <div className="space-y-4">
                    <Input 
                      label="Name" 
                      type="text" 
                      placeholder="Enter your name"
                      defaultValue="Chawana Maseka"
                    />
                    <Input 
                      label="Email" 
                      type="email" 
                      placeholder="Enter your email"
                      defaultValue="chawana@luminaryco.co"
                    />
                    <Input 
                      label="Password" 
                      type="password" 
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="mt-6">
                    <Button>Update Account</Button>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>
                  <div className="space-y-6">
                    <Toggle 
                      label="Task Assignments"
                      description="Receive email notifications for new tasks assigned to you."
                      defaultChecked={false}
                    />
                    <Toggle 
                      label="Task Updates"
                      description="Get notified when a task you're following is updated."
                      defaultChecked={true}
                    />
                    <Toggle 
                      label="Deadline Reminders"
                      description="Receive alerts for upcoming task deadlines."
                      defaultChecked={false}
                    />
                  </div>
                  <div className="mt-6">
                    <Button>Save Notifications</Button>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
                  <div className="space-y-4">
                    <Select 
                      label="Language" 
                      options={languageOptions}
                      defaultValue="en"
                    />
                    <Select 
                      label="Theme" 
                      options={themeOptions}
                      defaultValue="dark"
                    />
                  </div>
                  <div className="mt-6">
                    <Button>Save Preferences</Button>
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