import { NextRequest, NextResponse } from 'next/server';
import { sendTaskAssignmentEmail, sendCongratulationsEmail, sendTaskCompletionEmail } from '@/lib/gmail-email-service';
import { Deliverable } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const { type, taskData, assigneeName } = await request.json();

    if (!type || !taskData || !assigneeName) {
      return NextResponse.json(
        { error: 'Missing required fields: type, taskData, assigneeName' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'assignment':
        result = await sendTaskAssignmentEmail(taskData as Deliverable, assigneeName);
        break;
      case 'congratulations':
        result = await sendCongratulationsEmail(taskData as Deliverable, assigneeName);
        break;
      case 'completion':
        result = await sendTaskCompletionEmail(taskData as Deliverable, assigneeName);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Must be: assignment, congratulations, or completion' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        data: result.data 
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
