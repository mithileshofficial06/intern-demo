# 🎥 APPFORGE - 15 MINUTE DEMO SCRIPT

**Project:** AppForge - JSON-to-App Generator  
**Role:** Full Stack Developer Internship at Base44.com  
**Duration:** 15 minutes  
**Format:** Screen recording with voiceover

---

## 📋 PREPARATION CHECKLIST

**Before Recording:**
- [ ] Clear browser cookies/cache
- [ ] Close unnecessary browser tabs
- [ ] Set browser zoom to 100%
- [ ] Prepare demo JSON files
- [ ] Test live deployment URL
- [ ] Have GitHub repo open in a tab
- [ ] Open code editor with key files
- [ ] Practice once (dry run)

**Demo Data Prepared:**
- [ ] Sample app JSON (Task Manager)
- [ ] Sample app JSON (Inventory System)
- [ ] Test records ready to create

---

## 🎬 DEMO STRUCTURE (15 Minutes)

### **Section 1: Introduction & Overview** (2 minutes)
### **Section 2: Live Demo - Creating an App** (4 minutes)
### **Section 3: Technical Architecture** (3 minutes)
### **Section 4: Workflow System Demo** (3 minutes)
### **Section 5: Code Walkthrough** (2 minutes)
### **Section 6: Conclusion & Q&A** (1 minute)

---

## 📝 DETAILED SCRIPT

---

## **SECTION 1: INTRODUCTION & OVERVIEW (2 minutes)**

### **[SCREEN: Your Face or Splash Screen]**

**[00:00 - 00:30]**

> "Hello! My name is Mithilesh, and today I'm excited to present **AppForge** - a metadata-driven application runtime that I built for the Full Stack Developer internship at Base44.
>
> The challenge was to build a system that converts JSON configuration into a working application - dynamically generating the frontend UI, APIs, database structure, and workflows.
>
> The key technical challenge? The JSON might contain missing fields, invalid values, or unknown components - and the system needs to handle these gracefully without breaking."

---

### **[SCREEN: Switch to Browser - Show Landing Page]**

**[00:30 - 01:00]**

> "Let me show you what I built. This is AppForge - running live on Vercel at [your-url].vercel.app.
>
> The platform allows users to define applications using JSON, and within seconds, get a fully functional CRUD application with authentication, database storage, and automated workflows."

---

### **[SCREEN: Quick Architecture Diagram or Project Structure]**

**[01:00 - 02:00]**

> "The tech stack includes:
> - **Frontend:** Next.js 16 with React 19 and Tailwind CSS for a brutalist design system
> - **Backend:** Next.js API routes with full TypeScript type safety
> - **Database:** Neon PostgreSQL with Prisma ORM
> - **Authentication:** NextAuth v5 with GitHub OAuth and email/password
> - **Deployment:** Vercel with continuous deployment from GitHub
>
> I also implemented three additional features beyond the core requirements:
> 1. Multi-authentication system (GitHub + credentials)
> 2. Workflow automation engine
> 3. Notification system with persistence
>
> Now, let me show you how it works in action."

---

## **SECTION 2: LIVE DEMO - CREATING AN APP (4 minutes)**

### **[SCREEN: Landing Page]**

**[02:00 - 02:30]**

> "Let's start from the landing page. I'll sign in using my GitHub account to demonstrate the OAuth integration."

**[ACTION: Click "GET STARTED" → Click "Sign in with GitHub"]**

> "The authentication is handled by NextAuth v5, which manages sessions using JWT tokens and stores user data securely in PostgreSQL."

---

### **[SCREEN: Dashboard]**

**[02:30 - 03:00]**

> "Great! Now I'm on the dashboard. You can see I already have a few test applications here. Each app card shows:
> - The app name
> - A unique app ID
> - Creation date
> - Number of entities
> - A button to launch the runtime
>
> Notice the brutalist design with high contrast - black backgrounds, yellow accents, and heavy borders. This was intentional to make the interface highly visible and distinctive."

---

### **[SCREEN: Click "CREATE NEW APP"]**

**[03:00 - 04:00]**

> "Let me create a new app from scratch. I'll click 'CREATE NEW APP' and show you the JSON editor.
>
> I'll paste in a pre-written JSON configuration for a simple Task Manager application."

**[ACTION: Paste this JSON]**

```json
{
  "app": "Project Tracker",
  "version": "1.0",
  "entities": [
    {
      "name": "Task",
      "fields": [
        {
          "name": "title",
          "type": "string",
          "label": "Task Title",
          "required": true
        },
        {
          "name": "description",
          "type": "text",
          "label": "Description"
        },
        {
          "name": "status",
          "type": "enum",
          "label": "Status",
          "options": ["Todo", "In Progress", "Done"],
          "default": "Todo"
        },
        {
          "name": "priority",
          "type": "enum",
          "label": "Priority",
          "options": ["Low", "Medium", "High"],
          "default": "Medium"
        },
        {
          "name": "dueDate",
          "type": "date",
          "label": "Due Date"
        }
      ]
    }
  ]
}
```

**[04:00 - 04:30]**

> "This JSON defines:
> - An app called 'Project Tracker'
> - One entity called 'Task'
> - Five fields: title (string), description (text), status (enum), priority (enum), and due date
> - Notice I'm using different field types - the system supports string, text, number, boolean, date, and enum
> - I've also specified which fields are required and default values for the enums"

---

### **[SCREEN: Click "CREATE APP"]**

**[04:30 - 05:00]**

> "I'll click 'CREATE APP' and watch the magic happen."

**[ACTION: Wait for success message]**

> "Perfect! The app was created instantly. Behind the scenes, the system:
> 1. Validated the JSON schema
> 2. Generated a unique app ID using nanoid
> 3. Stored the configuration in PostgreSQL
> 4. Triggered the 'app.created' workflow event
> 5. Sent me back to the dashboard with the new app listed
>
> Let's launch this app and see what was generated."

---

### **[SCREEN: Click "LAUNCH RUNTIME" on the new app]**

**[05:00 - 06:00]**

> "Here we go! This is the generated application runtime. Notice:
> - **Left sidebar:** Shows all entities (in this case, just 'Task')
> - **Main area:** The record listing view
> - **Top navigation:** App name, workflows button, and app ID
> - **Action buttons:** 'VIEW RECORDS' and 'ADD NEW'
>
> The entire UI was generated from that JSON I pasted 30 seconds ago. Let me create a task to show the form renderer."

**[ACTION: Click "ADD NEW"]**

**[06:00 - 06:30]**

> "Look at this - a fully functional form with:
> - Text input for title with validation (required field shows red asterisk)
> - Textarea for description
> - Dropdown for status with the three options I defined
> - Dropdown for priority
> - Date picker for due date
>
> All the field types, labels, and validation rules came directly from the JSON. Let me fill this out."

**[ACTION: Fill the form]**
- Title: "Complete internship project"
- Description: "Build the demo video and documentation"
- Status: "In Progress"
- Priority: "High"
- Due Date: [Pick tomorrow's date]

**[06:30 - 07:00]**

> "I'll submit this, and watch what happens."

**[ACTION: Click "CREATE"]**

> "Success! The record was:
> 1. Validated on the client side
> 2. Sent to the API endpoint /api/runtime/[appId]/Task
> 3. Stored in the database as JSON
> 4. Triggered the 'record.created' workflow event
> 5. Returned to the listing view
>
> And there's my task in the table. Let me add one more to show the table view better."

---

## **SECTION 3: TECHNICAL ARCHITECTURE (3 minutes)**

### **[SCREEN: Switch to Code Editor]**

**[07:00 - 07:30]**

> "Now let me show you the technical implementation. I'll open VS Code to walk through the key parts of the architecture."

**[ACTION: Open VS Code, show file structure]**

> "The project structure follows Next.js 16 conventions:
> - `/src/app` - All pages and API routes
> - `/src/components` - React components organized by feature
> - `/src/lib` - Utility functions and shared logic
> - `/src/types` - TypeScript type definitions
> - `/prisma` - Database schema
>
> Let me show you the most important files."

---

### **[SCREEN: Open prisma/schema.prisma]**

**[07:30 - 08:00]**

> "First, the database schema. I'm using Prisma ORM with PostgreSQL.
>
> Key models:
> - **User, Account, Session, VerificationToken** - These are for NextAuth authentication
> - **AppConfig** - Stores the JSON configuration for each app, linked to a user
> - **Record** - Stores the actual data records with a flexible JSON field
> - **Workflow & WorkflowExecution** - Powers the workflow automation system
> - **Notification** - Stores in-app notifications
>
> Notice the relationship: AppConfig belongs to User, Records belong to AppConfig, Workflows belong to AppConfig. This ensures proper data isolation between users and apps."

---

### **[SCREEN: Open src/types/config.ts]**

**[08:00 - 08:30]**

> "Next, the validation layer. I created comprehensive TypeScript types using Zod for runtime validation.
>
> This is where I handle the 'graceful degradation' requirement - when the JSON has:
> - **Missing fields:** I inject defaults
> - **Invalid types:** I coerce to the correct type
> - **Unknown values:** I use fallbacks
> - **Inconsistent schemas:** I normalize the structure
>
> For example, if someone forgets to specify 'required' on a field, it defaults to false. If they provide a string instead of a number, I attempt to parse it."

---

### **[SCREEN: Open src/lib/workflow-engine.ts]**

**[08:30 - 09:00]**

> "This is the workflow engine I built - one of my three additional features.
>
> The WorkflowEngine class handles:
> - **Trigger matching:** Detecting when events like 'app.created' or 'record.created' occur
> - **Condition evaluation:** Checking if conditions are met before executing actions
> - **Variable substitution:** Replacing placeholders like ${app.name} with actual values
> - **Action execution:** Running notifications, webhooks, or logging
> - **Error handling:** Gracefully handling failures and logging them
>
> This makes the platform extensible - users can define automated workflows triggered by events."

---

### **[SCREEN: Open src/components/renderer/FormRenderer.tsx]**

**[09:00 - 10:00]**

> "Finally, the form renderer - this is the component that dynamically generates forms from the JSON schema.
>
> It loops through the entity fields and renders the appropriate input component:
> - String → Text input
> - Text → Textarea
> - Number → Number input
> - Boolean → Checkbox
> - Date → Date picker
> - Enum → Select dropdown
>
> It also handles:
> - Validation (required fields, type checking)
> - Error messages
> - Loading states
> - Success callbacks
>
> The beauty is that this same renderer works for ANY entity defined in JSON - it's completely data-driven."

---

## **SECTION 4: WORKFLOW SYSTEM DEMO (3 minutes)**

### **[SCREEN: Back to Browser - App Runtime]**

**[10:00 - 10:30]**

> "Let me demonstrate the workflow system. See that '⚡ WORKFLOWS' button in the header? Let me click that."

**[ACTION: Click "⚡ WORKFLOWS"]**

> "This opens the workflow management page for this app. Currently, there are no workflows defined. Let me create one that sends a notification whenever a new task is created with high priority."

---

### **[SCREEN: Workflow Creation Form]**

**[10:30 - 11:30]**

**[ACTION: Fill out workflow form]**

> "I'll configure this workflow:
> 
> **Name:** 'High Priority Task Alert'
> 
> **Description:** 'Notify when high priority task is created'
> 
> **Trigger:** 'record.created' on entity 'Task'
> 
> **Condition:** field 'priority' equals 'High'
> 
> **Action:** Send notification with message 'New high priority task: ${record.title}'
>
> What this means is: every time someone creates a Task record, the system checks if priority is 'High', and if so, sends a notification."

**[ACTION: Click "CREATE WORKFLOW"]**

> "Done! The workflow is now active. Let me test it by creating another task."

---

### **[SCREEN: Back to App Runtime]**

**[11:30 - 12:00]**

**[ACTION: Click "ADD NEW"]**

> "I'll create a new task with high priority."

**[ACTION: Fill form quickly]**
- Title: "Fix production bug"
- Priority: "High"
- Status: "Todo"

**[ACTION: Click "CREATE"]**

> "Submitted! Now behind the scenes:
> 1. The record was created in the database
> 2. The workflow engine detected the 'record.created' event
> 3. It found our workflow matching entity 'Task'
> 4. It evaluated the condition: priority === 'High' ✓
> 5. It executed the action: created a notification
> 6. It logged the execution in WorkflowExecution table
>
> Let me go back to workflows to show the execution log."

---

### **[SCREEN: Click "⚡ WORKFLOWS"]**

**[12:00 - 13:00]**

> "Perfect! You can see:
> - The workflow is listed with 'ENABLED' status
> - It shows '1 execution' 
> - If I click on it, I can see the execution log with timestamp, status (success), and the notification that was sent
>
> This workflow system is incredibly powerful because:
> - It's event-driven (triggers on real events)
> - It supports conditions (only execute if criteria met)
> - It's extensible (easy to add new trigger types and actions)
> - It's user-configurable (users can create workflows via UI or API)
>
> This satisfies one of the core requirements - workflow automation - and demonstrates that the platform can handle complex business logic beyond simple CRUD."

---

## **SECTION 5: CODE WALKTHROUGH (2 minutes)**

### **[SCREEN: Back to VS Code]**

**[13:00 - 13:30]**

> "Let me quickly show you a few more technical highlights."

**[ACTION: Open src/app/api/runtime/[appId]/[entity]/route.ts]**

> "This is the dynamic API route that handles CRUD operations. Notice:
> - It uses Next.js 16's async params
> - It validates the app belongs to the authenticated user
> - It performs type-safe database operations with Prisma
> - It triggers workflow events after data changes
> - It handles errors gracefully
>
> The route is dynamic - [appId] and [entity] are variables - so this single file handles operations for ANY app and ANY entity. That's the power of the metadata-driven approach."

---

### **[SCREEN: Open src/auth.ts]**

**[13:30 - 14:00]**

> "Authentication is handled by NextAuth v5 with two providers:
> 1. **GitHub OAuth** - for social login
> 2. **Credentials** - for email/password with bcrypt hashing
>
> The auth configuration:
> - Uses Prisma adapter to store sessions in the database
> - Implements proper JWT secret rotation
> - Handles callbacks for customizing the session
> - Protects routes via middleware
>
> This makes the platform production-ready with enterprise-grade authentication."

---

### **[SCREEN: Open package.json]**

**[14:00 - 14:30]**

> "Finally, the deployment configuration. I added:
> - **postinstall script:** Runs 'prisma generate' after npm install
> - **build script:** Generates Prisma Client before Next.js build
>
> This ensures that on Vercel, the Prisma types are available during TypeScript compilation. It was a key fix to get the deployment working.
>
> The app is deployed on Vercel with:
> - Automatic deployments from GitHub main branch
> - Environment variables for database and auth secrets
> - Edge runtime for optimal performance
> - Continuous deployment - every push triggers a new build"

---

## **SECTION 6: CONCLUSION & NEXT STEPS (1 minute)**

### **[SCREEN: Back to Browser - Dashboard or Landing Page]**

**[14:30 - 15:00]**

> "To summarize what I've built:
>
> **Core Requirements:**
> ✅ Frontend rendering engine - Dynamic UI generation
> ✅ Backend runtime - RESTful APIs for all operations
> ✅ Database architecture - Flexible JSON storage with Prisma
> ✅ Authentication - NextAuth with GitHub OAuth and credentials
> ✅ Deployment - Live on Vercel with CI/CD
> ✅ Workflows - Complete automation system
>
> **Additional Features:**
> ✅ Multi-auth login (GitHub + Email/Password)
> ✅ Workflow automation (event-driven with conditions)
> ✅ Notification system (in-app with persistence)
>
> **Technical Highlights:**
> - Fully type-safe with TypeScript
> - Graceful error handling for invalid JSON
> - Production-ready with proper security
> - Scalable architecture
> - Clean, maintainable code
>
> The entire platform demonstrates my ability to:
> - Design complex systems from scratch
> - Implement full-stack features end-to-end
> - Handle edge cases and errors gracefully
> - Deploy to production with CI/CD
> - Write clean, documented code
>
> Thank you for watching! I'm excited to discuss this project further and answer any questions you might have.
>
> The live demo is available at: [your-url].vercel.app
> The source code is on GitHub at: github.com/mithileshofficial06/intern-demo
>
> Looking forward to joining the Base44 team!"

---

## 🎬 RECORDING TIPS

### **Technical Setup:**
1. **Screen Recording Software:**
   - Loom (easiest)
   - OBS Studio (more control)
   - Zoom (record to computer)

2. **Audio:**
   - Use a decent microphone (even earbuds are better than laptop mic)
   - Record in a quiet room
   - Speak clearly and not too fast

3. **Screen Setup:**
   - Close unnecessary applications
   - Use full-screen mode for browser
   - Increase font size in code editor (14-16pt)
   - Set browser zoom to 100% or 110%

4. **Practice:**
   - Do a complete dry run first
   - Time yourself (aim for 13-14 minutes to leave buffer)
   - Have notes visible but don't read verbatim

---

### **What to Emphasize:**

**Technical Depth:**
- Architecture decisions
- Type safety and validation
- Error handling
- Database design
- API design

**Problem Solving:**
- How you handled invalid JSON
- Workflow engine design
- Authentication implementation
- Deployment challenges

**Business Value:**
- User experience focus
- Extensibility and scalability
- Production-ready features
- Real-world applicability

---

### **What NOT to Do:**

❌ Don't apologize for "bugs" or "missing features"
❌ Don't rush through sections
❌ Don't spend too much time on setup
❌ Don't read code line-by-line
❌ Don't use filler words excessively ("um", "like", "so")
❌ Don't go over 15 minutes

---

## 📊 TIMING BREAKDOWN

| Section | Duration | Key Points |
|---------|----------|------------|
| Introduction | 2 min | Who you are, what you built, tech stack |
| Live Demo | 4 min | Create app, add records, show functionality |
| Architecture | 3 min | Database, validation, code structure |
| Workflows | 3 min | Create workflow, test it, show execution |
| Code Walkthrough | 2 min | Key files, technical highlights |
| Conclusion | 1 min | Summary, next steps, thank you |

---

## 🎯 SUCCESS CRITERIA

Your demo should demonstrate:

✅ **Technical Competence:** You understand full-stack development  
✅ **Problem Solving:** You handle edge cases gracefully  
✅ **Communication:** You explain complex concepts clearly  
✅ **Product Thinking:** You built something usable and valuable  
✅ **Attention to Detail:** Your code is clean and well-organized  
✅ **Professionalism:** Your demo is polished and confident  

---

## 📝 POST-RECORDING CHECKLIST

After recording:
- [ ] Watch the entire video once
- [ ] Check audio quality (no background noise, clear voice)
- [ ] Verify screen is visible (not too small, not blurry)
- [ ] Confirm timing (13-15 minutes)
- [ ] Upload to Loom or Google Drive
- [ ] Set sharing to "Anyone with the link"
- [ ] Test the link in incognito mode
- [ ] Copy link to submit

---

## 🚀 GOOD LUCK!

You've built an impressive project. Now it's time to showcase it confidently!

**Remember:**
- Speak with energy and enthusiasm
- Show, don't just tell
- Highlight your problem-solving process
- Demonstrate technical depth
- Be proud of what you've accomplished

**You've got this!** 💪

