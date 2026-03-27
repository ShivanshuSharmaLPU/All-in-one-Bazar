# Fix Signup Email Issue - TODO List

## Task: Fix email not sending during signup (works in Postman but not frontend)

### Steps:
1. [x] 1. Update verifyEmail.js to add better error handling and TLS/SSL configuration for Gmail
2. [x] 2. Update sendOTPMail.js with same improvements (for forgot password)
3. [x] 3. Added detailed console logging to debug email sending issues
4. [ ] 4. IMPORTANT: Verify Gmail App Password is set correctly in backend/.env

### Critical Setup Required for Gmail:
- You need an **App Password**, not your regular Gmail password
- To create App Password:
  1. Go to Google Account → Security
  2. Enable 2-Step Verification
  3. Go to App Passwords (search in settings)
  4. Create new app password for "Mail"
  5. Use that 16-character password in MAIL_PASS in backend/.env

### Required backend/.env variables:
```
MAIL_USER=your_email@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx  (16-char App Password)
FRONTEND_URL=https://your-frontend-url.com
```

### To test:
1. Restart the backend server: `cd backend && npm start`
2. Try signup from frontend
3. Check backend terminal for detailed logs

