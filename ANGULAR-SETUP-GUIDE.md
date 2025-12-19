# FazCricketClub Angular Front-End Setup Guide

This guide explains how to run the Angular front-end alongside your .NET APIs in Visual Studio.

---

## 📋 Prerequisites

✅ Node.js (v18+ recommended) - **Already installed (v23.9.0)**
✅ npm (v8+ recommended) - **Already installed (v10.9.2)**
✅ Angular CLI - **Already installed (v19.2.16)**
✅ Visual Studio 2022

---

## 🏗️ Project Structure

```
FazCricketClub/
├── FaziCricketClub.API/              # Main Cricket API (Port 7000)
├── FaziCricketClub.IdentityApi/      # Authentication API (Port 7001)
├── FazCricketClub.Web.Angular/       # Angular Front-End (Port 4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/          # TypeScript models (Season, Team, Member, etc.)
│   │   │   │   ├── services/        # API services (AuthService, TeamService, etc.)
│   │   │   │   ├── guards/          # Route guards (authGuard, permissionGuard)
│   │   │   │   └── interceptors/    # HTTP interceptors (JWT token injection)
│   │   │   └── app.config.ts
│   │   ├── environments/
│   │   │   ├── environment.ts       # Development config
│   │   │   └── environment.prod.ts  # Production config
│   ├── proxy.conf.json              # API proxy configuration
│   ├── angular.json
│   └── package.json
└── FazCricketClub-API-Postman-Collection.json
```

---

## ⚙️ Configuration Files

### 1. API Proxy Configuration (`proxy.conf.json`)

The Angular dev server proxies API calls to avoid CORS issues:

```json
{
  "/api": {
    "target": "https://localhost:7000",     // Main API
    "secure": false,
    "changeOrigin": true
  },
  "/identity-api": {
    "target": "https://localhost:7001",     // Identity API
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/identity-api": "" }
  }
}
```

**How it works:**
- Angular calls `/api/seasons` → Proxied to `https://localhost:7000/api/seasons`
- Angular calls `/identity-api/api/auth/login` → Proxied to `https://localhost:7001/api/auth/login`

### 2. Environment Configuration

**`src/environments/environment.ts` (Development):**
```typescript
export const environment = {
  production: false,
  apiUrl: '/api',                    // Proxied
  identityApiUrl: '/identity-api/api', // Proxied
  appName: 'FazCricketClub',
  version: '1.0.0'
};
```

---

## 🚀 Running the Application

### Option 1: Configure Multiple Startup Projects in Visual Studio (Recommended)

This allows you to start all 3 projects (API, IdentityAPI, Angular) with a single F5 press.

#### Steps:

1. **Open Visual Studio**
   - Load `FaziCricketClub.sln`

2. **Configure Startup Projects**
   - Right-click on the solution in Solution Explorer
   - Select **"Configure Startup Projects..."**

   ![Visual Studio Multiple Projects](https://docs.microsoft.com/en-us/visualstudio/ide/media/vs2019_multi_start_up.png)

3. **Set Multiple Projects**
   - Select **"Multiple startup projects"**
   - Set these projects to **"Start"**:
     - ✅ `FaziCricketClub.API` (Action: Start)
     - ✅ `FaziCricketClub.IdentityApi` (Action: Start)
     - ✅ `FazCricketClub.Web.Angular` (Action: Start)

   - Click **OK**

4. **Launch Everything**
   - Press **F5** or click **"Start"**
   - Visual Studio will:
     - Start `FaziCricketClub.API` on `https://localhost:7000`
     - Start `FaziCricketClub.IdentityApi` on `https://localhost:7001`
     - Run `npm install` (if needed) and `npm start` for Angular
     - Open browser to `http://localhost:4200`

---

### Option 2: Manual Startup (Command Line)

If you prefer running Angular separately:

#### Terminal 1 - Main API:
```bash
cd FaziCricketClub.API
dotnet run
# Runs on https://localhost:7000
```

#### Terminal 2 - Identity API:
```bash
cd FaziCricketClub.IdentityApi
dotnet run
# Runs on https://localhost:7001
```

#### Terminal 3 - Angular:
```bash
cd FazCricketClub.Web.Angular
npm install  # First time only
npm start
# Runs on http://localhost:4200
```

---

## 🔐 Authentication Flow

### 1. **Login Process:**
```typescript
// In your component
constructor(private authService: AuthService, private router: Router) {}

login() {
  const request: LoginRequest = {
    email: 'admin@fazcc.com',
    password: 'Password123!'
  };

  this.authService.login(request).subscribe({
    next: (response) => {
      // Token is automatically stored
      // User info is automatically fetched
      this.router.navigate(['/dashboard']);
    },
    error: (error) => console.error('Login failed', error)
  });
}
```

### 2. **Protected Routes:**
```typescript
// app.routes.ts
import { authGuard, permissionGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]  // Requires authentication
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [permissionGuard],
    data: { permission: 'Admin.ManageUsers' }  // Requires specific permission
  }
];
```

### 3. **Calling APIs:**
```typescript
// Using SeasonService
constructor(private seasonService: SeasonService) {}

ngOnInit() {
  this.seasonService.getAll().subscribe({
    next: (seasons) => this.seasons = seasons,
    error: (error) => console.error('Failed to load seasons', error)
  });
}
```

---

## 📚 Available Services

All services are located in `src/app/core/services/`:

| Service | Purpose | Key Methods |
|---------|---------|-------------|
| `AuthService` | Authentication & user management | `login()`, `register()`, `logout()`, `me()`, `hasPermission()` |
| `ApiService` | Base HTTP service | `get()`, `post()`, `put()`, `delete()`, `getPaged()` |
| `SeasonService` | Season management | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `TeamService` | Team management | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `MemberService` | Member management | `getPaged()`, `getById()`, `create()`, `update()`, `delete()` |
| `FixtureService` | Fixture management | `getPaged()`, `getUpcoming()`, `getById()`, `create()`, `update()` |
| `StatsService` | Statistics & analytics | `getPlayerBattingStats()`, `getBattingLeaderboard()`, `getClubStats()` |

---

## 🛡️ Security Features

### JWT Token Management
- **Automatic injection**: The `authInterceptor` adds `Bearer {token}` to all authenticated requests
- **Token storage**: Stored in `localStorage` as `fazcc_token`
- **Auto-logout**: Expired tokens trigger automatic logout

### Route Protection
```typescript
// Three types of guards:
authGuard          // Requires authentication only
permissionGuard    // Requires specific permission (e.g., "Players.Edit")
roleGuard          // Requires specific role (e.g., "Admin")
```

### Permission Checking in Components
```typescript
constructor(private authService: AuthService) {}

canEditPlayers(): boolean {
  return this.authService.hasPermission('Players.Edit');
}

isAdmin(): boolean {
  return this.authService.hasRole('Admin');
}
```

---

## 📊 API Response Handling

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ApiError[];
}
```

The `ApiService` automatically unwraps responses:

```typescript
// You call:
this.seasonService.getAll()

// It returns:
Observable<Season[]>  // Already unwrapped from ApiResponse<Season[]>
```

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📝 Next Steps

### To Build Your First Component:

1. **Create a login component:**
   ```bash
   cd FazCricketClub.Web.Angular
   ng generate component features/auth/login
   ```

2. **Create a dashboard component:**
   ```bash
   ng generate component features/dashboard
   ```

3. **Create a seasons list component:**
   ```bash
   ng generate component features/seasons/season-list
   ```

### Recommended Folder Structure:

```
src/app/
├── core/                 # Already created - Services, models, guards, interceptors
├── features/
│   ├── auth/            # Login, Register components
│   ├── dashboard/       # Dashboard component
│   ├── seasons/         # Season CRUD components
│   ├── teams/           # Team CRUD components
│   ├── members/         # Member CRUD components
│   ├── fixtures/        # Fixture management
│   └── stats/           # Statistics & leaderboards
├── shared/              # Shared components, directives, pipes
│   ├── components/      # Reusable components (buttons, dialogs, etc.)
│   └── directives/      # Custom directives
└── layout/              # Header, footer, sidebar, navigation
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
**Solution:** Ensure both API projects are running on the correct ports:
- Main API: `https://localhost:7000`
- Identity API: `https://localhost:7001`

### Issue: "401 Unauthorized"
**Solution:** Check that:
1. You're logged in (`authService.isAuthenticated()` returns true)
2. Token hasn't expired
3. You have the required permissions

### Issue: "CORS errors"
**Solution:** The proxy configuration should handle this. Ensure:
1. `proxy.conf.json` exists
2. Angular is running via `npm start` (not `ng serve` directly)
3. API URLs in environment.ts use proxy paths

### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules
rm -rf node_modules
# Reinstall
npm install
```

---

## 📖 Documentation Links

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Postman Collection](./FazCricketClub-API-Postman-Collection.json)

---

## ✅ Quick Checklist

Before starting development:

- [ ] Visual Studio solution loads successfully
- [ ] Multiple startup projects configured
- [ ] All 3 projects start with F5
- [ ] Browser opens to `http://localhost:4200`
- [ ] No console errors
- [ ] Login to Identity API works (use Postman first to test)
- [ ] JWT token is stored in localStorage
- [ ] API calls are proxied correctly

---

**Happy Coding! 🏏**
