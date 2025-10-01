'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/ui/StatusBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import { Deliverable } from '@/types/database';

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Deliverable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [historyLog, setHistoryLog] = useState([
    {
      id: 1,
      action: 'Task created',
      value: '',
      date: new Date().toLocaleDateString()
    },
    {
      id: 2,
      action: 'Status changed to',
      value: 'In Progress',
      date: new Date().toLocaleDateString()
    },
    {
      id: 3,
      action: 'Assigned to',
      value: 'Chawana Maseka',
      date: new Date().toLocaleDateString()
    }
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    assignee_name: '',
    project_area: '',
    due_date: '',
    week_number: 1,
    progress: 0,
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
    { value: '', label: 'Unassigned' },
    { value: 'Chawana Maseka', label: 'Chawana Maseka' },
    { value: 'Alice Johnson', label: 'Alice Johnson' },
    { value: 'Bob Williams', label: 'Bob Williams' },
    { value: 'Charlie Brown', label: 'Charlie Brown' },
    { value: 'David Lee', label: 'David Lee' },
    { value: 'Eva Wilson', label: 'Eva Wilson' },
  ];

  const projectAreaOptions = [
    { value: 'Strategy Layer', label: 'Strategy Layer' },
    { value: 'Branding & Identity', label: 'Branding & Identity' },
    { value: 'Social Media & Marketing', label: 'Social Media & Marketing' },
    { value: 'HR & People', label: 'HR & People' },
    { value: 'Finance & Administration', label: 'Finance & Administration' },
    { value: 'Operations & Systems', label: 'Operations & Systems' },
    { value: 'Client-Facing Readiness', label: 'Client-Facing Readiness' },
  ];

  const weekOptions = [
    { value: 1, label: 'Week 1' },
    { value: 2, label: 'Week 2' },
    { value: 3, label: 'Week 3' },
    { value: 4, label: 'Week 4' },
  ];

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/deliverables/${id}`);
        if (response.ok) {
          const taskData = await response.json();
          setTask(taskData);
          setFormData({
            title: taskData.title || '',
            description: taskData.description || '',
            status: taskData.status || 'not-started',
            assignee_name: taskData.assignee_name || '',
            project_area: taskData.project_area || '',
            due_date: taskData.due_date ? taskData.due_date.split('T')[0] : '',
            week_number: taskData.week_number || 1,
            progress: taskData.progress || 0,
            document_link: taskData.document_link || ''
          });
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original task data
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'not-started',
        assignee_name: task.assignee_name || '',
        project_area: task.project_area || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        week_number: task.week_number || 1,
        progress: task.progress || 0,
        document_link: task.document_link || ''
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/deliverables/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        
        // Add history log entry for the save action
        const newHistoryEntry = {
          id: historyLog.length + 1,
          action: 'Task updated',
          value: '',
          date: new Date().toLocaleDateString()
        };
        setHistoryLog(prev => [newHistoryEntry, ...prev]);
        
        setIsEditing(false);
      } else {
        console.error('Error updating task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#101922]">
        <Sidebar currentPage="deliverables" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading task details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-[#101922]">
        <Sidebar currentPage="deliverables" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">Task not found</p>
              <Button onClick={() => router.push('/deliverables')} className="mt-4">
                Back to Deliverables
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="deliverables" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Details</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  View and manage all details for the selected task.
                </p>
              </div>

              {/* Task Details - Read-only View */}
              {!isEditing ? (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Task Title</h3>
                      <p className="text-gray-700 dark:text-gray-300">{task?.title || 'No title'}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{task?.description || 'No description'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                      <StatusBadge status={task?.status || 'not-started'} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Assignee</h3>
                      <p className="text-gray-700 dark:text-gray-300">{task?.assignee_name || 'Unassigned'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Due Date</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {task?.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Week</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {task?.week_number ? `Week ${task.week_number}` : 'Not assigned'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Area</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {task?.project_area || 'Not assigned'}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Document Link</h3>
                      {task?.document_link ? (
                        <a 
                          href={task.document_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#1173d4] hover:underline"
                        >
                          {task.document_link}
                        </a>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">No document link</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Progress</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <ProgressBar progress={task?.progress || 0} />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {task?.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Task Form - Edit Mode */
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input 
                        label="Task Title" 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[100px]"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter task description..."
                      />
                    </div>

                    <Select 
                      label="Status" 
                      options={statusOptions}
                      value={formData.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const updates: Partial<typeof formData> = { status: newStatus };
                        
                        // Auto-update progress to 100% when status is set to "done"
                        if (newStatus === 'done') {
                          updates.progress = 100;
                        }
                        
                        setFormData({...formData, ...updates});
                      }}
                    />

                    <Select 
                      label="Assignee" 
                      options={assigneeOptions}
                      value={formData.assignee_name}
                      onChange={(e) => setFormData({...formData, assignee_name: e.target.value})}
                    />

                    <Input 
                      label="Due Date" 
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    />

                    <Select 
                      label="Week" 
                      options={weekOptions}
                      value={formData.week_number}
                      onChange={(e) => setFormData({...formData, week_number: parseInt(e.target.value)})}
                    />

                    <div className="md:col-span-2">
                      <Select 
                        label="Project Area" 
                        options={projectAreaOptions}
                        value={formData.project_area}
                        onChange={(e) => setFormData({...formData, project_area: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input 
                        label="Document Link" 
                        type="url"
                        placeholder="https://example.com/project-cr-docs"
                        value={formData.document_link}
                        onChange={(e) => setFormData({...formData, document_link: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Progress: {formData.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => {
                          const newProgress = parseInt(e.target.value);
                          const updates: Partial<typeof formData> = { progress: newProgress };
                          
                          // Suggest updating status to "done" when progress reaches 100%
                          if (newProgress === 100 && formData.status !== 'done') {
                            // Optional: Auto-update status to "done" when progress reaches 100%
                            // Uncomment the line below if you want automatic status update
                            // updates.status = 'done';
                          }
                          
                          setFormData({...formData, ...updates});
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="mt-2">
                        <ProgressBar progress={formData.progress} />
                      </div>
                      
                      {/* Progress completion suggestion */}
                      {formData.progress === 100 && formData.status !== 'done' && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-yellow-700 dark:text-yellow-300">
                              Progress is 100%. Consider updating status to &quot;Done&quot;.
                            </span>
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, status: 'done'})}
                              className="ml-auto text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
                            >
                              Mark as Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments/Notes Section */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comments/Notes</h2>
                <textarea
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[150px]"
                  placeholder="Enter your comments or notes here..."
                ></textarea>
              </div>

              {/* History Log Section */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">History Log</h2>
                <div className="space-y-4">
                  {historyLog.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {entry.action} {entry.value && <strong>{entry.value}</strong>}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/deliverables')}
                >
                  Back to Deliverables
                </Button>
                
                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button 
                      variant="primary" 
                      onClick={handleEdit}
                    >
                      Edit Task
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="secondary" 
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}