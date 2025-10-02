export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          role?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          role?: string
        }
      }
      deliverables: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'not-started' | 'to-do' | 'in-progress' | 'in-review' | 'done'
          assignee_id: string | null
          assignee_name: string | null
          project_area: string
          due_date: string | null
          week_number: number | null
          document_link: string | null
          progress: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'not-started' | 'to-do' | 'in-progress' | 'in-review' | 'done'
          assignee_id?: string | null
          assignee_name?: string | null
          project_area: string
          due_date?: string | null
          week_number?: number | null
          document_link?: string | null
          progress?: number
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'not-started' | 'to-do' | 'in-progress' | 'in-review' | 'done'
          assignee_id?: string | null
          assignee_name?: string | null
          project_area?: string
          due_date?: string | null
          week_number?: number | null
          document_link?: string | null
          progress?: number
          created_by?: string | null
        }
      }
      project_phases: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          start_date: string | null
          due_date: string | null
          status: 'not-started' | 'in-progress' | 'completed'
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          start_date?: string | null
          due_date?: string | null
          status?: 'not-started' | 'in-progress' | 'completed'
          order_index: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          start_date?: string | null
          due_date?: string | null
          status?: 'not-started' | 'in-progress' | 'completed'
          order_index?: number
        }
      }
      team_members: {
        Row: {
          id: string
          profile_id: string
          role: string
          assigned_tasks: string | null
          is_active: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          role: string
          assigned_tasks?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          profile_id?: string
          role?: string
          assigned_tasks?: string | null
          is_active?: boolean
        }
      }
      deliverable_comments: {
        Row: {
          id: string
          deliverable_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          deliverable_id: string
          author_id: string
          content: string
        }
        Update: {
          id?: string
          deliverable_id?: string
          author_id?: string
          content?: string
        }
      }
      deliverable_history: {
        Row: {
          id: string
          deliverable_id: string
          action: string
          old_value: string | null
          new_value: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          deliverable_id: string
          action: string
          old_value?: string | null
          new_value?: string | null
          changed_by?: string | null
        }
        Update: {
          id?: string
          deliverable_id?: string
          action?: string
          old_value?: string | null
          new_value?: string | null
          changed_by?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'task_assigned' | 'task_completed' | 'task_status_changed' | 'comment_added' | 'due_date_reminder' | 'task_updated'
          title: string
          message: string
          is_read: boolean
          related_deliverable_id: string | null
          related_user_id: string | null
          metadata: any
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'task_assigned' | 'task_completed' | 'task_status_changed' | 'comment_added' | 'due_date_reminder' | 'task_updated'
          title: string
          message: string
          is_read?: boolean
          related_deliverable_id?: string | null
          related_user_id?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'task_assigned' | 'task_completed' | 'task_status_changed' | 'comment_added' | 'due_date_reminder' | 'task_updated'
          title?: string
          message?: string
          is_read?: boolean
          related_deliverable_id?: string | null
          related_user_id?: string | null
          metadata?: any
          read_at?: string | null
        }
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Deliverable = Database['public']['Tables']['deliverables']['Row']
export type ProjectPhase = Database['public']['Tables']['project_phases']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type Comment = Database['public']['Tables']['deliverable_comments']['Row']
export type HistoryEntry = Database['public']['Tables']['deliverable_history']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Insert types
export type NewProfile = Database['public']['Tables']['profiles']['Insert']
export type NewDeliverable = Database['public']['Tables']['deliverables']['Insert']
export type NewProjectPhase = Database['public']['Tables']['project_phases']['Insert']
export type NewTeamMember = Database['public']['Tables']['team_members']['Insert']
export type NewComment = Database['public']['Tables']['deliverable_comments']['Insert']
export type NewHistoryEntry = Database['public']['Tables']['deliverable_history']['Insert']
export type NewNotification = Database['public']['Tables']['notifications']['Insert']

// Update types
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateDeliverable = Database['public']['Tables']['deliverables']['Update']
export type UpdateProjectPhase = Database['public']['Tables']['project_phases']['Update']
export type UpdateTeamMember = Database['public']['Tables']['team_members']['Update']
export type UpdateComment = Database['public']['Tables']['deliverable_comments']['Update']
export type UpdateHistoryEntry = Database['public']['Tables']['deliverable_history']['Update']
export type UpdateNotification = Database['public']['Tables']['notifications']['Update']
