# Google OAuth Configuration for Vercel Deployment

## Issue: Google Sign-In Button Loading Indefinitely

The Google Sign-In button is showing a loading state but not opening the OAuth flow on your Vercel deployment. This is typically caused by domain restrictions in your Google OAuth client configuration.

## Solution: Configure Google OAuth Client for Vercel Domain

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"

### Step 2: Find Your OAuth 2.0 Client
- Look for client ID: `715647564219-ebiebv3t4dhnj7gdkn1v9n0arbt579v6.apps.googleusercontent.com`
- Click on it to edit

### Step 3: Add Authorized Domains
In the "Authorized JavaScript origins" section, add:
- `https://your-app-name.vercel.app` (replace with your actual Vercel domain)
- `https://ghar-frontend.vercel.app` (if this is your domain)
- `http://localhost:3000` (for local development)
- `https://localhost:3000` (for local development with HTTPS)

### Step 4: Add Authorized Redirect URIs
In the "Authorized redirect URIs" section, add:
- `https://your-app-name.vercel.app`
- `https://ghar-frontend.vercel.app`
- `http://localhost:3000`

### Step 5: Save Changes
Click "Save" and wait a few minutes for changes to propagate.

## Alternative: Create New OAuth Client for Production

If you don't have access to the existing client, create a new one:

1. Click "Create Credentials" > "OAuth 2.0 Client ID"
2. Choose "Web application"
3. Add your Vercel domains as authorized origins
4. Update the `.env` file with the new client ID

## Testing the Fix

After updating the Google OAuth configuration:

1. Deploy the updated code to Vercel
2. Clear your browser cache
3. Test the Google Sign-In button on your live site
4. Check browser console for any error messages

## Environment Variables for Vercel

Make sure these are set in your Vercel dashboard:
```
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_API_URL=https://ghar-02ex.onrender.com/api
```

## Troubleshooting

If the button still doesn't work:

1. **Check Browser Console**: Look for error messages
2. **Verify Domain**: Ensure the domain matches exactly (no trailing slashes)
3. **Test Locally**: Verify it works on localhost first
4. **Use Manual Trigger**: Try the "Click here if Google button doesn't work" button
5. **Check Network Tab**: Look for failed API calls

## Updated Component Features

The Google login component now includes:
- ✅ Environment variable support
- ✅ Better error logging
- ✅ Manual trigger button fallback
- ✅ Improved initialization
- ✅ Debug console logging

## Contact Support

If the issue persists, the updated component will show detailed error messages in the browser console that can help identify the specific problem.
