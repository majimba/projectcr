'use client';

import React from 'react';
import { Deliverable } from '@/types/database';

interface ProjectProgressStatusBarProps {
  deliverables: Deliverable[];
  className?: string;
}

interface StatusBreakdown {
  notStarted: number;
  toDo: number;
  inProgress: number;
  inReview: number;
  done: number;
}

const ProjectProgressStatusBar: React.FC<ProjectProgressStatusBarProps> = ({
  deliverables,
  className = ""
}) => {
  // Calculate status breakdown
  const calculateStatusBreakdown = (deliverables: Deliverable[]): StatusBreakdown => {
    const breakdown = {
      notStarted: 0,
      toDo: 0,
      inProgress: 0,
      inReview: 0,
      done: 0
    };

    deliverables.forEach(deliverable => {
      switch (deliverable.status) {
        case 'not-started':
          breakdown.notStarted++;
          break;
        case 'to-do':
          breakdown.toDo++;
          break;
        case 'in-progress':
          breakdown.inProgress++;
          break;
        case 'in-review':
          breakdown.inReview++;
          break;
        case 'done':
          breakdown.done++;
          break;
      }
    });

    return breakdown;
  };

  // Calculate overall progress using weighted method
  const calculateOverallProgress = (deliverables: Deliverable[]): number => {
    if (deliverables.length === 0) return 0;

    const statusWeights = {
      'done': 100,
      'in-review': 90,
      'in-progress': 50,
      'to-do': 10,
      'not-started': 0
    };

    const totalWeight = deliverables.reduce((sum, d) => sum + statusWeights[d.status], 0);
    return Math.round(totalWeight / deliverables.length);
  };

  // Determine project health status
  const determineProjectHealth = (progress: number): { status: string; color: string; bgColor: string } => {
    if (progress >= 80) {
      return {
        status: 'On Track',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      };
    } else if (progress >= 60) {
      return {
        status: 'At Risk',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      };
    } else {
      return {
        status: 'Behind Schedule',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      };
    }
  };

  // Calculate progress bar segments
  const calculateProgressSegments = (breakdown: StatusBreakdown, total: number) => {
    if (total === 0) return [];

    const segments = [
      { status: 'done', color: '#10B981', count: breakdown.done, label: 'Done' },
      { status: 'in-review', color: '#3B82F6', count: breakdown.inReview, label: 'In Review' },
      { status: 'in-progress', color: '#F59E0B', count: breakdown.inProgress, label: 'In Progress' },
      { status: 'to-do', color: '#6B7280', count: breakdown.toDo, label: 'To Do' },
      { status: 'not-started', color: '#EF4444', count: breakdown.notStarted, label: 'Not Started' }
    ];

    return segments.map(segment => ({
      ...segment,
      width: Math.round((segment.count / total) * 100)
    }));
  };

  const breakdown = calculateStatusBreakdown(deliverables);
  const totalDeliverables = deliverables.length;
  const overallProgress = calculateOverallProgress(deliverables);
  const projectHealth = determineProjectHealth(overallProgress);
  const progressSegments = calculateProgressSegments(breakdown, totalDeliverables);

  return (
    <div className={`bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project CR
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${projectHealth.bgColor} ${projectHealth.color}`}>
            {projectHealth.status}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {overallProgress}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Overall Progress
          </div>
        </div>
      </div>

      {/* Progress Bar Visualization */}
      <div className="mb-4">
        <div className="flex h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {progressSegments.map((segment, index) => (
            segment.count > 0 && (
              <div
                key={segment.status}
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${segment.width}%`,
                  backgroundColor: segment.color
                }}
                title={`${segment.label}: ${segment.count} (${segment.width}%)`}
              />
            )
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">{breakdown.done}</span> Done
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">{breakdown.inReview}</span> In Review
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">{breakdown.inProgress}</span> In Progress
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">{breakdown.toDo}</span> To Do
          </span>
        </div>
        {breakdown.notStarted > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">{breakdown.notStarted}</span> Not Started
            </span>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {totalDeliverables} total deliverables • {breakdown.done + breakdown.inReview} completed or in review
      </div>
    </div>
  );
};

export default ProjectProgressStatusBar;
