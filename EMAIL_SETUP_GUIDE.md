# 📧 Email Notification System Setup Guide

## Environment Variables Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Email Service Configuration
RESEND_API_KEY=your_resend_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Company Configuration
COMPANY_EMAIL=hello@luminaryco.co
COMPANY_NAME=Luminary Co
PROJECT_NAME=Project CR

# Team Member Emails (CORRECTED MAPPINGS)
TEAM_EMAIL_CHAWANA=chawana.maseka@gmail.com
TEAM_EMAIL_MAYNARD=maynarjfilms@gmail.com
TEAM_EMAIL_EMMANUEL=risendream@gmail.com
TEAM_EMAIL_MUNSANJE=pandazm76@gmail.com
TEAM_EMAIL_DELPHINE=delphinemwape2@gmail.com
```

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Resend**
   - Sign up at [resend.com](https://resend.com)
   - Get your API key
   - Add it to `.env.local` as `RESEND_API_KEY`

3. **Update App URL**
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`

4. **Verify Email Mappings**
   - Chawana Masaka: chawana.maseka@gmail.com
   - Maynard Muchangwe: maynarjfilms@gmail.com
   - Emmanuel Kapili: risendream@gmail.com
   - Munsanje Hachamba: pandazm76@gmail.com
   - Delphine Mwape: delphinemwape2@gmail.com

## Testing the System

1. **Test Task Assignment**
   - Go to dashboard
   - Assign a task to any team member
   - Check console logs for email sending confirmation

2. **Test Task Completion**
   - Go to task details page
   - Change status to "Done"
   - Check console logs for both congratulations and completion emails

## Email Templates

The system includes three email templates:
- **Task Assignment**: Sent to team member when assigned
- **Congratulations**: Sent to team member when task completed
- **Completion Confirmation**: Sent to company when task completed

## Troubleshooting

- Check console logs for email sending status
- Verify Resend API key is correct
- Ensure all environment variables are set
- Check Resend dashboard for delivery status
