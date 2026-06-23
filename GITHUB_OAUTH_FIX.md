# 🔧 FIX GITHUB OAUTH - Step by Step

## ❌ THE PROBLEM
Getting 404 error when trying to login with GitHub because the OAuth callback URL doesn't match.

## ✅ THE SOLUTION

### **STEP 1: Find Your Vercel URL**
1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. Copy the production URL (something like: `https://intern-demo-xxx.vercel.app`)

---

### **STEP 2: Update GitHub OAuth App**

1. **Go to GitHub OAuth Settings:**
   - Visit: https://github.com/settings/developers
   - Click **"OAuth Apps"**
   - Click on your app (Client ID: `Ov23li3eCMVLQir0cJHQ`)

2. **Update These Fields:**

   **Homepage URL:**
   ```
   https://YOUR-VERCEL-URL.vercel.app
   ```
   *(Replace with your actual Vercel URL)*

   **Authorization callback URL:**
   ```
   https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/github
   ```

3. **IMPORTANT:** Click **"Update application"** to save!

---

### **STEP 3: Add Multiple Callback URLs (Recommended)**

To support both local development AND production, you can add BOTH URLs:

**Callback URLs to add:**
1. `http://localhost:3000/api/auth/callback/github` (for local dev)
2. `https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/github` (for production)

*(GitHub allows multiple callback URLs separated by newlines)*

---

### **STEP 4: Update Vercel Environment Variables**

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add/Update these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `AUTH_SECRET` | `0iQaOqYYzuEYqiVRi8COlk3TQoHkqKw2guEWmwPUdiE=` | Production |
| `AUTH_GITHUB_ID` | `Ov23li3eCMVLQir0cJHQ` | Production |
| `AUTH_GITHUB_SECRET` | `74421d4a1f40b2d61d0330b0559762a601490b66` | Production |
| `AUTH_TRUST_HOST` | `true` | Production |
| `NEXTAUTH_URL` | `https://YOUR-VERCEL-URL.vercel.app` | Production |
| `DATABASE_URL` | `postgresql://neondb_owner:...` | Production |

4. Click **"Save"**

---

### **STEP 5: Redeploy (if needed)**

If you added new environment variables, you need to redeploy:

**Option A: Trigger from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

**Option B: Push a commit**
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin main
```

---

### **STEP 6: Test**

1. Go to your production URL: `https://YOUR-VERCEL-URL.vercel.app`
2. Click **"Sign in with GitHub"**
3. Should redirect to GitHub authorization
4. After authorizing, should redirect back to your app
5. You should be logged in! ✅

---

## 🐛 TROUBLESHOOTING

### **Still getting 404 error?**

**Check:**
1. ✅ Callback URL ends with `/api/auth/callback/github` (not just `/auth/callback/github`)
2. ✅ No trailing slash in the URL
3. ✅ Using `https://` not `http://` for production
4. ✅ Clicked "Update application" on GitHub
5. ✅ Redeployed after adding env vars

### **Getting "redirect_uri_mismatch" error?**

This means the callback URL in GitHub doesn't match exactly. Make sure:
- No trailing slash
- Exact match including protocol (https://)
- Using the correct Vercel URL (check dashboard)

### **Getting "Authentication error"?**

Check Vercel logs:
1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Look for errors related to AUTH or GitHub

Common issues:
- Missing `AUTH_SECRET` environment variable
- Wrong `AUTH_GITHUB_SECRET`
- Database connection failing

---

## 📝 QUICK REFERENCE

**Your OAuth Credentials:**
- Client ID: `Ov23li3eCMVLQir0cJHQ`
- Client Secret: `74421d4a1f40b2d61d0330b0559762a601490b66`

**Required Callback URL Format:**
```
https://YOUR-DOMAIN.vercel.app/api/auth/callback/github
```

**Environment Variables Needed on Vercel:**
- `AUTH_SECRET` ✅
- `AUTH_GITHUB_ID` ✅
- `AUTH_GITHUB_SECRET` ✅
- `AUTH_TRUST_HOST=true` ✅
- `NEXTAUTH_URL` ✅
- `DATABASE_URL` ✅

---

## ✅ SUCCESS CHECKLIST

After fixing, you should be able to:
- [ ] Visit production URL
- [ ] Click "Sign in with GitHub"
- [ ] Authorize the app on GitHub
- [ ] Get redirected back to your app
- [ ] See your GitHub profile in the dashboard
- [ ] Create and view apps

---

## 🚀 NEXT STEPS

Once GitHub OAuth is working:
1. ✅ Test email/password login too
2. ✅ Test creating an app
3. ✅ Test workflows
4. ✅ Record your demo video
5. ✅ Submit your project

---

**Good luck!** 🎉
