# Google Login Setup Guide

## ✅ Implementation Status

### Working Components:
- ✅ Backend OAuth2 implementation (using `google-auth-library`)
- ✅ Frontend Google Sign-In button integration
- ✅ API endpoints configured (`/api/auth/google`)
- ✅ Token verification and user creation/login flow
- ✅ Cookie-based session management (FIXED)
- ✅ Role-based authentication support

## ⚠️ Required Configuration

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** or **Google Identity Services**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - Application name: `Edusathi`
   - Authorized domains: Add your domain (e.g., `edusathi.net`)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://edusathi.net` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://edusathi.net` (for production)
7. Copy the **Client ID**

### Step 2: Update Environment Variables

#### Client-side (.env)
```env
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE
```

**Current value (NEEDS UPDATE):**
```
VITE_GOOGLE_CLIENT_ID=your_clint_id  ❌ This is a placeholder
```

#### Server-side (.env)
```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE
```

**Current value (NEEDS UPDATE):**
```
GOOGLE_CLIENT_ID=  ❌ This is empty
```

**⚠️ IMPORTANT:** Both client and server must use the **SAME** Google Client ID.

### Step 3: Restart Services

After updating the environment variables:

```bash
# Restart backend server
cd server
npm run dev

# Restart frontend (in another terminal)
cd client
npm run dev
```

## 🔍 How It Works

### Frontend Flow:
1. User clicks "Continue with Google" button
2. Google Sign-In popup opens
3. User selects Google account
4. Google returns `credential` (JWT token)
5. Frontend sends token to backend via `/api/auth/google`

### Backend Flow:
1. Receives `id_token` from frontend
2. Verifies token using `OAuth2Client.verifyIdToken()`
3. Extracts user info (email, name, picture)
4. Checks if user exists in database
5. If not exists, creates new user with random password
6. Generates JWT access & refresh tokens
7. Sets HTTP-only cookies
8. Returns user data and tokens

### Code References:

**Backend Controller:**
- File: `server/controllers/auth.controller.js`
- Function: `googleAuth` (lines 167-199)

**Frontend Integration:**
- File: `client/pages/Auth.tsx`
- Google button render: lines 155-191
- Callback handler: lines 162-186

**API Configuration:**
- File: `client/Api/api.ts`
- Endpoint: lines 230-235

**Route:**
- File: `server/routes/auth.routes.js`
- Route: `POST /api/auth/google` (line 10)

## 🧪 Testing

After configuration, test the flow:

1. Open the app in browser
2. Go to auth page (e.g., `/auth?role=student`)
3. Click "Continue with Google" button
4. Select Google account
5. Verify successful login and redirect

## 🐛 Troubleshooting

### Issue: "Invalid Google token" error
- **Cause:** Client ID mismatch or invalid token
- **Fix:** Ensure both client and server use the same Client ID

### Issue: Google button not rendering
- **Cause:** Missing or invalid `VITE_GOOGLE_CLIENT_ID`
- **Fix:** Update client `.env` with valid Client ID

### Issue: "No email in token" error
- **Cause:** Google account doesn't have email or scope issue
- **Fix:** Ensure email scope is requested in OAuth consent

### Issue: CORS errors
- **Cause:** Domain not authorized in Google Console
- **Fix:** Add your domain to "Authorized JavaScript origins"

## 📝 Recent Changes

### Fixed (Oct 26, 2025):
- ✅ Added cookie setting in `googleAuth` controller for consistent session management
- ✅ Now matches behavior of regular login/register methods

### Previous Fixes:
- ✅ Resolved Git merge conflicts in auth files (Oct 20, 2025)
- ✅ Merged OAuth2Client and cookieOptions imports

## 🔐 Security Notes

- Google Client ID is **public** (safe to expose in frontend)
- Never expose Client Secret in frontend code
- Backend verifies token authenticity with Google
- HTTP-only cookies prevent XSS attacks
- Tokens expire after configured duration (45m for access, 7d for refresh)

## 📚 Dependencies

**Backend:**
- `google-auth-library`: OAuth2 token verification

**Frontend:**
- Google Identity Services (GSI) script loaded in `index.html`

---

**Status:** ⚠️ Awaiting Google Client ID configuration
**Next Step:** Add valid Google OAuth Client ID to both `.env` files
