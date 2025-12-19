# 🚀 HOW TO RUN FazCricketClub - Complete Guide

This guide will walk you through running your **complete full-stack application** (2 APIs + Angular front-end) with Visual Studio.

---

## ✅ Pre-Flight Checklist

Before starting, verify you have:

- [x] **Visual Studio 2022** installed
- [x] **Node.js v23.9.0** installed (already confirmed)
- [x] **npm v10.9.2** installed (already confirmed)
- [x] **Angular CLI v19.2.16** installed (already confirmed)
- [x] Solution file `FaziCricketClub.sln` loads without errors

---

## 📊 What Will Start When You Press F5

| Project | Type | URL | Purpose |
|---------|------|-----|---------|
| **FaziCricketClub.API** | .NET API | `https://localhost:7108` | Main cricket club API (seasons, teams, members, fixtures, stats) |
| **FaziCricketClub.IdentityApi** | .NET API | `https://localhost:7276` | Authentication API (login, register, user management) |
| **FazCricketClub.Web.Angular** | Angular 19 | `http://localhost:4200` | Front-end web application |

---

## 🎯 METHOD 1: Visual Studio Multiple Startup (RECOMMENDED)

This is the **easiest way** to run everything with one click.

### Step 1: Open the Solution

1. Launch **Visual Studio 2022**
2. Open: `C:\Users\AfzalAhmed\source\repos\dotnetdeveloper20xx\FazCricketClub\FaziCricketClub.sln`
3. Wait for Solution Explorer to load all 9 projects

### Step 2: Configure Multiple Startup Projects (ONE-TIME SETUP)

1. In **Solution Explorer**, **right-click** on the solution `FaziCricketClub` (top item)
2. Select **"Set Startup Projects..."** or **"Configure Startup Projects..."**

   ![Right-click Solution](https://i.imgur.com/example.png)

3. A dialog will appear. Select **"Multiple startup projects"**

4. Set the following projects to **"Start"** (in this order):

   | Project Name | Action | Why? |
   |-------------|--------|------|
   | `FaziCricketClub.API` | **Start** | Main cricket API |
   | `FaziCricketClub.IdentityApi` | **Start** | Authentication API |
   | `FazCricketClub.Web.Angular` | **Start** | Angular front-end |
   | All other projects | `None` | Not needed for runtime |

   **Visual Configuration:**
   ```
   ✅ FaziCricketClub.API             → Start
   ✅ FaziCricketClub.IdentityApi     → Start
   ✅ FazCricketClub.Web.Angular      → Start
   ⬜ FaziCricketClub.Application     → None
   ⬜ FaziCricketClub.Domain          → None
   ⬜ FaziCricketClub.Infrastructure  → None
   ⬜ FaziCricketClub.Jobs            → None
   ⬜ FaziCricketClub.Tests.Unit      → None
   ⬜ FazCricketClub.Web              → None
   ```

5. Click **OK**

### Step 3: First-Time Angular Setup

**IMPORTANT:** The first time you run, Angular needs to install npm packages.

1. Open a terminal in Visual Studio:
   - **View → Terminal** (or Ctrl+`)

2. Navigate to Angular project:
   ```bash
   cd FazCricketClub.Web.Angular
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Wait for installation to complete (this takes 2-3 minutes)

### Step 4: Run Everything!

1. Press **F5** or click the **"Start"** button (green play icon)

2. **What will happen:**
   - ✅ Visual Studio builds all projects
   - ✅ Main API starts on `https://localhost:7108`
   - ✅ Identity API starts on `https://localhost:7276`
   - ✅ Angular runs `npm start` automatically
   - ✅ Browser opens to `http://localhost:4200`

3. **Watch the Output Windows:**
   - You should see 3 console windows (one for each running project)
   - Angular will show "Compiled successfully" when ready

### Step 5: Verify Everything is Running

Open these URLs in your browser:

1. **Angular App**: http://localhost:4200
   - Should show Angular welcome page

2. **Main API Health Check**: https://localhost:7108/api/health
   - Should return: `{"status":"OK","service":"CricketClub.WebApi","timestampUtc":"..."}`

3. **Swagger for Main API**: https://localhost:7108/swagger
   - Should show API documentation

4. **Swagger for Identity API**: https://localhost:7276/swagger
   - Should show authentication endpoints

**If all 4 URLs work, you're good to go! 🎉**

---

## 🎯 METHOD 2: Manual Startup (Alternative)

If you prefer to run projects separately:

### Terminal 1 - Main API
```bash
cd C:\Users\AfzalAhmed\source\repos\dotnetdeveloper20xx\FazCricketClub\FaziCricketClub.API
dotnet run
```
**Expected output:**
```
Now listening on: https://localhost:7108
```

### Terminal 2 - Identity API
```bash
cd C:\Users\AfzalAhmed\source\repos\dotnetdeveloper20xx\FazCricketClub\FaziCricketClub.IdentityApi
dotnet run
```
**Expected output:**
```
Now listening on: https://localhost:7276
```

### Terminal 3 - Angular
```bash
cd C:\Users\AfzalAhmed\source\repos\dotnetdeveloper20xx\FazCricketClub\FazCricketClub.Web.Angular
npm start
```
**Expected output:**
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

---

## 🧪 Testing the Setup

### Test 1: Health Checks

**Main API:**
```bash
curl https://localhost:7108/api/health
```
Expected: `{"status":"OK", ...}`

**Identity API:**
```bash
curl https://localhost:7276/api/status
```

### Test 2: Authentication Flow (Use Postman)

1. **Import Postman Collection:**
   - Open Postman
   - Import: `C:\Users\AfzalAhmed\source\repos\dotnetdeveloper20xx\FazCricketClub\FazCricketClub-API-Postman-Collection.json`

2. **Register a Test User:**
   - Endpoint: `POST {{identityApiUrl}}/api/auth/register`
   - Body:
     ```json
     {
       "email": "test@fazcc.com",
       "userName": "testuser",
       "password": "Password123!",
       "confirmPassword": "Password123!",
       "role": "Player"
     }
     ```
   - Expected: `200 OK` with JWT token

3. **Login:**
   - Endpoint: `POST {{identityApiUrl}}/api/auth/login`
   - Body:
     ```json
     {
       "email": "test@fazcc.com",
       "password": "Password123!"
     }
     ```
   - Expected: `200 OK` with JWT token

4. **Copy the `accessToken` from response**

5. **Get Current User Info:**
   - Endpoint: `GET {{identityApiUrl}}/api/auth/me`
   - Headers: `Authorization: Bearer <paste-token-here>`
   - Expected: `200 OK` with user info, roles, and permissions

### Test 3: Main API (Authenticated)

1. **Get All Seasons:**
   - Endpoint: `GET {{mainApiUrl}}/api/seasons`
   - Headers: `Authorization: Bearer <token>`
   - Expected: `200 OK` with empty array `[]` (no seasons yet)

2. **Create a Season:**
   - Endpoint: `POST {{mainApiUrl}}/api/seasons`
   - Headers: `Authorization: Bearer <token>`
   - Body:
     ```json
     {
       "name": "2025 Summer Season",
       "description": "Main season",
       "startDate": "2025-04-01T00:00:00",
       "endDate": "2025-09-30T00:00:00"
     }
     ```
   - Expected: `201 Created` with season object

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to API"

**Symptoms:**
- Angular shows network errors
- CORS errors in browser console

**Solution:**
1. Verify both APIs are running:
   - Check `https://localhost:7108/api/health`
   - Check `https://localhost:7276/swagger`

2. Verify ports match proxy configuration:
   - Open: `FazCricketClub.Web.Angular/proxy.conf.json`
   - Should have:
     ```json
     {
       "/api": { "target": "https://localhost:7108" },
       "/identity-api": { "target": "https://localhost:7276" }
     }
     ```

3. Restart Angular:
   - Stop Angular (Ctrl+C)
   - Run `npm start` again

---

### Problem: "npm install fails"

**Symptoms:**
- Errors during `npm install`
- Missing packages

**Solution:**
```bash
cd FazCricketClub.Web.Angular

# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

---

### Problem: "Port already in use"

**Symptoms:**
- Error: "Address already in use"
- Can't start API

**Solution:**

**On Windows:**
```bash
# Find what's using port 7108
netstat -ano | findstr :7108

# Kill the process (replace PID)
taskkill /PID <process-id> /F
```

**Then restart Visual Studio**

---

### Problem: "Angular not starting from Visual Studio"

**Symptoms:**
- APIs start, but Angular doesn't
- No browser window opens

**Solution:**

1. **Run Angular manually first:**
   ```bash
   cd FazCricketClub.Web.Angular
   npm start
   ```

2. **Check for errors in output**

3. **Verify package.json scripts:**
   ```json
   "start": "ng serve --open --proxy-config proxy.conf.json"
   ```

4. **If still failing, disable Angular in startup projects** and run it manually

---

### Problem: "401 Unauthorized" errors

**Symptoms:**
- Can login, but API calls fail with 401

**Solution:**

1. **Verify token is being sent:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Make an API request
   - Check request headers for: `Authorization: Bearer <token>`

2. **Check token hasn't expired:**
   - Tokens expire after 60 minutes
   - Login again to get new token

3. **Verify interceptor is working:**
   - Check: `src/app/app.config.ts`
   - Should have: `provideHttpClient(withInterceptors([authInterceptor]))`

---

### Problem: "Database not found" errors

**Symptoms:**
- API starts but crashes on database access
- SQL errors in console

**Solution:**

**Update database:**
```bash
cd FaziCricketClub.Infrastructure
dotnet ef database update --startup-project ../FaziCricketClub.API
dotnet ef database update --startup-project ../FaziCricketClub.IdentityApi
```

**Check connection strings in appsettings.json**

---

## 📁 Quick Reference - Important Files

| File | Purpose |
|------|---------|
| `FaziCricketClub.sln` | Visual Studio solution |
| `FazCricketClub.Web.Angular/proxy.conf.json` | API proxy configuration |
| `FazCricketClub.Web.Angular/src/environments/environment.ts` | Dev environment config |
| `FazCricketClub.Web.Angular/package.json` | npm scripts |
| `FazCricketClub-API-Postman-Collection.json` | API testing collection |
| `ANGULAR-SETUP-GUIDE.md` | Detailed Angular documentation |

---

## 🎉 Success Checklist

After following this guide, you should have:

- [x] Visual Studio configured with multiple startup projects
- [x] All 3 projects starting with F5
- [x] Main API running on `https://localhost:7108`
- [x] Identity API running on `https://localhost:7276`
- [x] Angular app running on `http://localhost:4200`
- [x] Browser automatically opening to Angular app
- [x] API health checks responding
- [x] Able to register/login via Postman
- [x] JWT tokens working
- [x] API calls from Angular proxied correctly

---

## 🎓 Next Steps

Now that everything is running:

1. **Build your first component:**
   ```bash
   cd FazCricketClub.Web.Angular
   ng generate component features/auth/login
   ```

2. **Read the Angular setup guide:**
   - Open `ANGULAR-SETUP-GUIDE.md`
   - Learn about services, guards, interceptors

3. **Test API endpoints:**
   - Use Postman collection
   - Create seasons, teams, members, fixtures

4. **Start building features:**
   - Dashboard
   - Player management
   - Match scorecards
   - Statistics views

---

## 💡 Pro Tips

1. **Keep all 3 terminals visible:**
   - Use Visual Studio's built-in terminal
   - Or use Windows Terminal with split panes

2. **Use browser DevTools:**
   - F12 in Chrome/Edge
   - Network tab shows API calls
   - Console shows Angular errors

3. **Hot reload works:**
   - Edit Angular files → Auto-refresh
   - Edit API files → Auto-rebuild (with hot reload)

4. **Save your Postman environment:**
   - Store the JWT token as a variable
   - Reuse across requests

5. **Enable auto-save in Visual Studio:**
   - Tools → Options → Environment → Documents
   - Check "Save documents before running"

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check Visual Studio Output window for errors
2. Check browser console (F12) for Angular errors
3. Check API terminal output for .NET errors
4. Verify all ports are correct in configuration files

---

**Ready to code! 🚀**
