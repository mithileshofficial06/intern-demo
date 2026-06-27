# 🗺️ ROUTING AUDIT & FIX PLAN

## CURRENT ROUTING ISSUES

### **Problems Identified:**
1. Login redirects to `/editor` (doesn't exist) instead of `/dashboard`
2. Need consistent post-login behavior
3. Need proper "HOME" button behavior based on auth state
4. Need proper flow after app creation

---

## ✅ DESIRED ROUTING FLOW

### **Landing Page (`/`)**
- **If NOT logged in:** Show landing page with login/signup
- **If logged in:** Redirect to `/dashboard`
- **After login:** → `/dashboard`
- **After signup:** → `/dashboard`

### **Dashboard (`/dashboard`)**
- **Requires:** Authentication
- **If NOT logged in:** → `/auth/signin`
- **"HOME" button:** → `/` (landing page)
- **"CREATE APP" button:** → Editor modal/form
- **After app created:** → Stay on `/dashboard` (show new app)
- **"LAUNCH RUNTIME" button:** → `/[appId]` (app runtime)

### **App Runtime (`/[appId]`)**
- **Requires:** Authentication + App ownership
- **If NOT logged in:** → `/auth/signin`
- **If app not found:** Show error with "← HOME" → `/dashboard`
- **"← HOME" button:** → `/dashboard` (not `/`)
- **"⚡ WORKFLOWS" button:** → `/workflows/[appId]`
- **After record created:** → Stay on `/[appId]` (refresh table)
- **After record deleted:** → Stay on `/[appId]` (refresh table)

### **Workflows (`/workflows/[appId]`)**
- **Requires:** Authentication + App ownership
- **If NOT logged in:** → `/auth/signin`
- **"← BACK" button:** → `/[appId]` (return to app runtime)
- **After workflow created:** → Stay on `/workflows/[appId]` (show new workflow)

### **Auth Pages**
- **`/auth/signin`:** After login → `/dashboard`
- **`/auth/signup`:** After signup → `/dashboard`
- **`/auth/error`:** Show error with link to `/auth/signin`

---

## 🔧 FIXES NEEDED

### **1. Landing Page (`/`)** ✅ FIXED
- [x] Redirect to `/dashboard` after login
- [x] Redirect to `/dashboard` after signup

### **2. Dashboard (`/dashboard`)** ⚠️ NEEDS FIX
- [ ] "HOME" button should go to `/` (landing page)
- [ ] After creating app, stay on dashboard (refresh to show new app)

### **3. App Runtime (`/[appId]`)** ⚠️ NEEDS FIX
- [ ] "← HOME" button should go to `/dashboard` (not `/`)
- [ ] Workflows button already correct ✓

### **4. Workflows (`/workflows/[appId]`)** ⚠️ NEEDS CHECK
- [ ] Need "← BACK" button to return to app runtime
- [ ] Or "← HOME" to dashboard

### **5. Auth Pages** ✅ FIXED
- [x] All redirects go to `/dashboard`

---

## 📋 IMPLEMENTATION PLAN

### **Fix 1: Landing Page - Add Auth Redirect**
**File:** `src/app/page.tsx`
**Action:** Check if user is logged in, redirect to dashboard
**Code:**
```typescript
export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'authenticated') return null // Will redirect

  return (
    // ... landing page content
  )
}
```

### **Fix 2: Dashboard - HOME Button**
**File:** `src/app/dashboard/page.tsx`
**Current:** Likely no HOME button
**Action:** Add HOME button that goes to `/`
**Code:**
```tsx
<Link href="/" className="brutal-btn">
  ← HOME
</Link>
```

### **Fix 3: App Runtime - HOME Button**
**File:** `src/app/[appId]/page.tsx`
**Current:** `href="/"`
**Action:** Change to `href="/dashboard"`
**Code:**
```tsx
<Link href="/dashboard" className="brutal-btn">
  ← DASHBOARD
</Link>
```

### **Fix 4: Workflows Page - Back Button**
**File:** `src/app/workflows/[appId]/page.tsx`
**Action:** Add back button to return to app runtime
**Code:**
```tsx
<Link href={`/${appId}`} className="brutal-btn">
  ← BACK TO APP
</Link>
```

---

## 🎯 FINAL ROUTING MAP

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING (/)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  If NOT logged in: Show login/signup                      │  │
│  │  If logged in: Redirect to /dashboard                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                    [After Login/Signup]                          │
│                              ↓                                   │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                      DASHBOARD (/dashboard)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [← HOME to /]  [CREATE APP]                             │  │
│  │  Shows all user's apps                                    │  │
│  │  Each app has [LAUNCH RUNTIME] button                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                   [Click LAUNCH RUNTIME]                         │
│                              ↓                                   │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                  APP RUNTIME (/[appId])                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [← DASHBOARD]  [⚡ WORKFLOWS]                            │  │
│  │  Entity tabs | Add/View records                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                    │                   │
│         │                                    │                   │
│         ↓                                    ↓                   │
│  [← DASHBOARD]                      [⚡ WORKFLOWS]               │
│  Returns to                         Opens workflows page         │
│  /dashboard                         /workflows/[appId]           │
└──────────────────────────────────────────────────────────────────┘
                                              │
                                              ↓
┌──────────────────────────────────────────────────────────────────┐
│              WORKFLOWS (/workflows/[appId])                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [← BACK TO APP]  [← DASHBOARD]                           │  │
│  │  List workflows | Create/Edit/Delete                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                    │                   │
│         ↓                                    ↓                   │
│  [← BACK TO APP]                    [← DASHBOARD]               │
│  Returns to /[appId]                Returns to /dashboard        │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ SUCCESS CRITERIA

After fixes, user should be able to:
1. ✅ Land on `/` → See landing page (or redirect to dashboard if logged in)
2. ✅ Login → Go to `/dashboard`
3. ✅ From dashboard → Click "HOME" → Go to `/` (landing)
4. ✅ From dashboard → Click "LAUNCH RUNTIME" → Go to `/[appId]`
5. ✅ From app runtime → Click "← DASHBOARD" → Go to `/dashboard`
6. ✅ From app runtime → Click "⚡ WORKFLOWS" → Go to `/workflows/[appId]`
7. ✅ From workflows → Click "← BACK TO APP" → Go to `/[appId]`
8. ✅ From workflows → Click "← DASHBOARD" → Go to `/dashboard`

---

## 🚀 NEXT STEPS

1. Fix landing page auto-redirect
2. Fix dashboard HOME button
3. Fix app runtime HOME button (rename to DASHBOARD)
4. Fix workflows page back navigation
5. Test complete flow
6. Commit and deploy

