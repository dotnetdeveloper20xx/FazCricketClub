# ⚡ QUICK START - 3 Simple Steps

Get your full-stack FazCricketClub application running in under 5 minutes!

---

## ✅ Verification

Angular project **IS** included in solution:
```
✓ FazCricketClub.Web.Angular added to FaziCricketClub.sln
✓ Project GUID: {F8D9C123-4567-4ABC-8DEF-123456789ABC}
✓ Build configurations: Debug and Release
✓ npm packages installed
✓ Proxy configured for APIs
```

---

## 🚀 Step 1: Configure Visual Studio (ONE-TIME SETUP)

1. **Open Solution:**
   ```
   C:\Users\AfzalAhmed\source\repos\dotnetdeveloper20xx\FazCricketClub\FaziCricketClub.sln
   ```

2. **Right-click on solution** (in Solution Explorer) → **"Configure Startup Projects..."**

3. **Select "Multiple startup projects"**

4. **Set these to "Start":**
   - ✅ FaziCricketClub.API
   - ✅ FaziCricketClub.IdentityApi
   - ✅ FazCricketClub.Web.Angular

5. **Click OK**

---

## 🚀 Step 2: First-Time Angular Setup

Open **Terminal** in Visual Studio (View → Terminal):

```bash
cd FazCricketClub.Web.Angular
npm install
```

⏱️ Wait 2-3 minutes for packages to install.

---

## 🚀 Step 3: Run Everything!

Press **F5** (or click Start button)

### What Happens:
1. ✅ Main API starts → `https://localhost:7108`
2. ✅ Identity API starts → `https://localhost:7276`
3. ✅ Angular starts → `http://localhost:4200`
4. ✅ Browser opens automatically

### Verify It Worked:

**Check these URLs:**
- http://localhost:4200 (Angular app)
- https://localhost:7108/api/health (Main API)
- https://localhost:7276/swagger (Identity API)

**All working? You're done! 🎉**

---

## 📊 What's Running

| Component | URL | What It Does |
|-----------|-----|--------------|
| **Angular Front-End** | http://localhost:4200 | User interface |
| **Cricket API** | https://localhost:7108 | Seasons, Teams, Members, Fixtures, Stats |
| **Identity API** | https://localhost:7276 | Login, Register, JWT tokens |

---

## 🧪 Quick Test (Optional)

### Test Authentication with Postman:

1. **Import collection:**
   - Open Postman
   - Import: `FazCricketClub-API-Postman-Collection.json`

2. **Register a user:**
   - Run: `POST /api/auth/register`
   - Body:
     ```json
     {
       "email": "test@fazcc.com",
       "password": "Password123!",
       "confirmPassword": "Password123!",
       "userName": "testuser"
     }
     ```

3. **Login:**
   - Run: `POST /api/auth/login`
   - Copy the `accessToken`

4. **Test protected endpoint:**
   - Run: `GET /api/seasons`
   - Add header: `Authorization: Bearer <token>`
   - Should return: `{ "success": true, "data": [] }`

**API working? Perfect! 🚀**

---

## 📚 Next Steps

| Task | Command | Guide |
|------|---------|-------|
| **Build login component** | `ng g component features/auth/login` | `ANGULAR-SETUP-GUIDE.md` |
| **Build dashboard** | `ng g component features/dashboard` | `ANGULAR-SETUP-GUIDE.md` |
| **Learn the APIs** | Use Postman | `FazCricketClub-API-Postman-Collection.json` |
| **Troubleshooting** | - | `HOW-TO-RUN.md` |

---

## 🐛 Problems?

### Angular not starting?
```bash
cd FazCricketClub.Web.Angular
npm install
npm start
```

### Ports wrong?
- Main API should be: `https://localhost:7108`
- Identity API should be: `https://localhost:7276`
- Check `Properties/launchSettings.json` in each API project

### Full troubleshooting guide:
- Read: `HOW-TO-RUN.md`

---

## 📁 Important Files

```
FazCricketClub/
├── HOW-TO-RUN.md                           ⭐ Full guide
├── QUICK-START.md                          ⭐ This file
├── ANGULAR-SETUP-GUIDE.md                  ⭐ Angular docs
├── FazCricketClub-API-Postman-Collection.json  ⭐ API tests
├── FaziCricketClub.sln                     ← Open this in Visual Studio
└── FazCricketClub.Web.Angular/
    ├── proxy.conf.json                     ← API proxy (ports: 7108, 7276)
    ├── package.json                        ← npm scripts
    └── src/
        ├── app/core/
        │   ├── services/                   ← API services
        │   ├── guards/                     ← Auth guards
        │   └── models/                     ← TypeScript interfaces
        └── environments/
            └── environment.ts              ← API URLs
```

---

**You're all set! Happy coding! 🏏**
