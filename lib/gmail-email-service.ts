import nodemailer from 'nodemailer';
import { Deliverable } from '@/types/database';

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
    },
  });
};

// Email mapping for team members - ORIGINAL MAPPINGS RESTORED
const getTeamMemberEmail = (name: string): string => {
  const emailMap: Record<string, string> = {
    'Chawana Masaka': 'chawana.maseka@gmail.com',
    'Maynard Muchangwe': 'maynarjfilms@gmail.com',
    'Emmanuel Kapili': 'risendream@gmail.com',
    'Munsanje Hachamba': 'pandazm76@gmail.com',
    'Delphine Mwape': 'delphinemwape2@gmail.com',
  };
  return emailMap[name] || '';
};

// Email templates (same as before)
export const emailTemplates = {
  taskAssignment: (taskData: Deliverable, assigneeName: string) => ({
    subject: `🎯 New Task Assigned: ${taskData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1173d4, #0ea5e9); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Task Assigned</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Project CR Dashboard</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${assigneeName},</h2>
          
          <p style="color: #6b7280; margin: 0 0 20px 0;">You've been assigned a new task for Project CR:</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📋 ${taskData.title}</h3>
            ${taskData.description ? `<p style="color: #6b7280; margin: 0 0 15px 0;">${taskData.description}</p>` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
              <div>
                <strong style="color: #374151;">📅 Due Date:</strong><br>
                <span style="color: #6b7280;">${taskData.due_date ? new Date(taskData.due_date).toLocaleDateString() : 'No due date set'}</span>
              </div>
              <div>
                <strong style="color: #374151;">📊 Project Area:</strong><br>
                <span style="color: #6b7280;">${taskData.project_area}</span>
              </div>
              <div>
                <strong style="color: #374151;">📅 Week:</strong><br>
                <span style="color: #6b7280;">Week ${taskData.week_number || 'N/A'}</span>
              </div>
              <div>
                <strong style="color: #374151;">📈 Progress:</strong><br>
                <span style="color: #6b7280;">${taskData.progress || 0}%</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/task/${taskData.id}" 
               style="background: #1173d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              View Task Details
            </a>
          </div>
          
          <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 14px;">
            Best regards,<br>
            Project CR Team
          </p>
        </div>
      </div>
    `,
  }),

  congratulations: (taskData: Deliverable, assigneeName: string) => ({
    subject: `🎉 Congratulations! Task Completed: ${taskData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Task Successfully Completed</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${assigneeName},</h2>
          
          <p style="color: #6b7280; margin: 0 0 20px 0;">Excellent work! You've successfully completed:</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">✅ ${taskData.title}</h3>
            ${taskData.description ? `<p style="color: #6b7280; margin: 0 0 15px 0;">${taskData.description}</p>` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
              <div>
                <strong style="color: #374151;">📊 Project Area:</strong><br>
                <span style="color: #6b7280;">${taskData.project_area}</span>
              </div>
              <div>
                <strong style="color: #374151;">📅 Completed:</strong><br>
                <span style="color: #6b7280;">${new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-weight: 600;">
              🏆 Your contribution to Project CR is greatly appreciated!
            </p>
          </div>
          
          <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 14px;">
            Keep up the great work!<br>
            Project CR Team
          </p>
        </div>
      </div>
    `,
  }),

  taskCompletion: (taskData: Deliverable, assigneeName: string) => ({
    subject: `✅ Task Completed: ${taskData.title} - Project CR Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Task Completed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Project CR Dashboard Update</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Project CR Team,</h2>
          
          <p style="color: #6b7280; margin: 0 0 20px 0;">A task has been completed:</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">✅ ${taskData.title}</h3>
            ${taskData.description ? `<p style="color: #6b7280; margin: 0 0 15px 0;">${taskData.description}</p>` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
              <div>
                <strong style="color: #374151;">👤 Completed by:</strong><br>
                <span style="color: #6b7280;">${assigneeName}</span>
              </div>
              <div>
                <strong style="color: #374151;">📊 Project Area:</strong><br>
                <span style="color: #6b7280;">${taskData.project_area}</span>
              </div>
              <div>
                <strong style="color: #374151;">📅 Completed:</strong><br>
                <span style="color: #6b7280;">${new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <strong style="color: #374151;">📈 Progress:</strong><br>
                <span style="color: #6b7280;">${taskData.progress || 100}%</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              View Project Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 14px;">
            Project CR Dashboard<br>
            Automated Notification System
          </p>
        </div>
      </div>
    `,
  }),

  companyTaskAssignment: (taskData: Deliverable, assigneeName: string) => ({
    subject: `📋 Task Assignment Alert: ${assigneeName} assigned to ${taskData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">📋 Task Assignment Alert</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Project CR Management Notification</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello Luminary Co Team,</h2>
          
          <p style="color: #6b7280; margin: 0 0 20px 0;">A new task has been assigned and requires your attention:</p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📋 ${taskData.title}</h3>
            ${taskData.description ? `<p style="color: #6b7280; margin: 0 0 15px 0;">${taskData.description}</p>` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
              <div>
                <strong style="color: #374151;">👤 Assigned to:</strong><br>
                <span style="color: #6b7280; font-weight: 600;">${assigneeName}</span>
              </div>
              <div>
                <strong style="color: #374151;">📅 Due Date:</strong><br>
                <span style="color: #6b7280;">${taskData.due_date ? new Date(taskData.due_date).toLocaleDateString() : 'No due date set'}</span>
              </div>
              <div>
                <strong style="color: #374151;">📊 Project Area:</strong><br>
                <span style="color: #6b7280;">${taskData.project_area}</span>
              </div>
              <div>
                <strong style="color: #374151;">📅 Week:</strong><br>
                <span style="color: #6b7280;">Week ${taskData.week_number || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="color: #1e40af; margin: 0; font-weight: 600;">
              📌 <strong>Action Required:</strong> Please monitor progress and ensure ${assigneeName} has all necessary resources to complete this task on time.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/task/${taskData.id}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              View Task Details
            </a>
          </div>
          
          <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 14px;">
            Best regards,<br>
            Project CR Management System<br>
            <em>Automated Notification</em>
          </p>
        </div>
      </div>
    `,
  }),
};

// Email sending functions using Gmail SMTP
export const sendTaskAssignmentEmail = async (taskData: Deliverable, assigneeName: string) => {
  const recipientEmail = getTeamMemberEmail(assigneeName);
  if (!recipientEmail) {
    console.warn(`No email found for team member: ${assigneeName}`);
    return { success: false, error: 'No email found for team member' };
  }

  try {
    const transporter = createTransporter();
    const template = emailTemplates.taskAssignment(taskData, assigneeName);
    
    // Send email to the assigned team member
    const teamMemberInfo = await transporter.sendMail({
      from: `"Project CR" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log('Assignment email sent to team member:', teamMemberInfo.messageId);

    // Send notification to company
    const companyTemplate = emailTemplates.companyTaskAssignment(taskData, assigneeName);
    const companyInfo = await transporter.sendMail({
      from: `"Project CR" <${process.env.GMAIL_USER}>`,
      to: 'hello@luminaryco.co',
      subject: companyTemplate.subject,
      html: companyTemplate.html,
    });

    console.log('Company notification sent:', companyInfo.messageId);
    
    return { 
      success: true, 
      data: { 
        teamMemberMessageId: teamMemberInfo.messageId,
        companyMessageId: companyInfo.messageId
      } 
    };
  } catch (error) {
    console.error('Error sending assignment emails:', error);
    return { success: false, error: 'Failed to send emails' };
  }
};

export const sendCongratulationsEmail = async (taskData: Deliverable, assigneeName: string) => {
  const recipientEmail = getTeamMemberEmail(assigneeName);
  if (!recipientEmail) {
    console.warn(`No email found for team member: ${assigneeName}`);
    return { success: false, error: 'No email found for team member' };
  }

  try {
    const transporter = createTransporter();
    const template = emailTemplates.congratulations(taskData, assigneeName);
    
    const info = await transporter.sendMail({
      from: `"Project CR" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log('Congratulations email sent successfully:', info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error('Error sending congratulations email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

export const sendTaskCompletionEmail = async (taskData: Deliverable, assigneeName: string) => {
  const companyEmail = 'hello@luminaryco.co';

  try {
    const transporter = createTransporter();
    const template = emailTemplates.taskCompletion(taskData, assigneeName);
    
    const info = await transporter.sendMail({
      from: `"Project CR" <${process.env.GMAIL_USER}>`,
      to: companyEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log('Completion email sent successfully:', info.messageId);
    return { success: true, data: { messageId: info.messageId } };
  } catch (error) {
    console.error('Error sending completion email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};
