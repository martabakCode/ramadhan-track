# How to Set Up Google Authentication

The error `Unsupported provider: provider is not enabled` means Google Auth is not turned on in your Supabase project.

## Step 1: Get Google Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create a new project (if you haven't).
3. Go to **APIs & Services** > **OAuth consent screen**.
   - Select **External**.
   - Fill in App Name ("Ramadhan Challenge"), User Support Email, and Developer Contact Email.
   - Click Save & Continue (skip scopes/test users for now).
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: "Supabase Auth".
   - **Authorized redirect URIs**:
     - You need your Supabase Project URL.
     - Go to Supabase > Authentication > Providers > Google to find the "Callback URL (for OAuth)".
     - It looks like: `https://<project-ref>.supabase.co/auth/v1/callback`
     - Paste that into Google Console "Authorized redirect URIs".
   - Click **Create**.
   - Copy the **Client ID** and **Client Secret**.

## Step 2: Enable in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** > **Providers**.
3. Select **Google**.
4. Toggle **Enable Google Provider**.
5. Paste the **Client ID** and **Client Secret** from step 1.
6. Click **Save**.

## Step 3: Configure Redirect URL
1. In Supabase, go to **Authentication** > **URL Configuration**.
2. Add `http://localhost:3000/auth/callback` to **Redirect URLs**.
3. Click **Save**.

## Common Errors & Fixes
### 🔴 Error 400: redirect_uri_mismatch
This means Google doesn't recognize the URL that Supabase is sending.
1. Go to **Supabase Dashboard** > **Authentication** > **Providers** > **Google**.
2. Copy the **Callback URL (for OAuth)**. It looks like: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Go to **Google Cloud Console** > **Credentials** > **Your OAuth Client**.
4. Paste that **exact URL** into **Authorized redirect URIs**.
5. Click **Save**.

### 🔴 Provider is not enabled
Go to Supabase > Authentication > Providers > Google and make sure the toggle is **ON**.

