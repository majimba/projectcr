'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function CreateTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    assignee_id: '',
    assignee_name: '',
    project_area: 'frontend',
    due_date: '',
    week_number: '',
    document_link: ''
  });
  const statusOptions = [
    { value: 'not-started', label: 'Not Started' },
    { value: 'to-do', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  const assigneeOptions = [
    { value: '', label: 'Select assignee' },
    { value: 'john', label: 'John Doe' },
    { value: 'alex', label: 'Alex Johnson' },
    { value: 'bob', label: 'Bob Williams' },
    { value: 'charlie', label: 'Charlie Brown' },
  ];

  const projectAreaOptions = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design', label: 'Design' },
    { value: 'testing', label: 'Testing' },
    { value: 'devops', label: 'DevOps' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/deliverables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          week_number: formData.week_number ? parseInt(formData.week_number) : null,
        }),
      });

      if (response.ok) {
        router.push('/deliverables');
      } else {
        const error = await response.json();
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="deliverables" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Task</h1>
              
              <div className="space-y-6">
                {/* Task Title */}
                <Input 
                  label="Task Title" 
                  type="text" 
                  placeholder="e.g., Design the new dashboard"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[100px]"
                    placeholder="Describe the task in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                {/* Status and Assignee Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select 
                    label="Status" 
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  />

                  <Select 
                    label="Assignee" 
                    options={assigneeOptions}
                    value={formData.assignee_id}
                    onChange={(e) => {
                      const selectedOption = assigneeOptions.find(opt => opt.value === e.target.value);
                      handleInputChange('assignee_id', e.target.value);
                      handleInputChange('assignee_name', selectedOption?.label || '');
                    }}
                  />
                </div>

                {/* Due Date and Week Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Due Date" 
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                  />

                  <Input 
                    label="Week" 
                    type="number"
                    placeholder="e.g., 42"
                    value={formData.week_number}
                    onChange={(e) => handleInputChange('week_number', e.target.value)}
                  />
                </div>

                {/* Project Area */}
                <Select 
                  label="Project Area" 
                  options={projectAreaOptions}
                  value={formData.project_area}
                  onChange={(e) => handleInputChange('project_area', e.target.value)}
                />

                {/* Document Link */}
                <Input 
                  label="Document Link" 
                  type="url"
                  placeholder="https://example.com/doc"
                  value={formData.document_link}
                  onChange={(e) => handleInputChange('document_link', e.target.value)}
                />

                {/* Create Button */}
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="min-w-[200px]"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {loading ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}