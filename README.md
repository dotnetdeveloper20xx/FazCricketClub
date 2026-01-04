# 🏏 Fazi Cricket Club Management System

A comprehensive, enterprise-grade Cricket Club Management System built with .NET 10.0, demonstrating modern software architecture patterns, security best practices, and full-stack development skills.

[![.NET Version](https://img.shields.io/badge/.NET-10.0-blue)](https://dotnet.microsoft.com/)
[![C# Version](https://img.shields.io/badge/C%23-14.0-purple)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🎯 Project Overview

This application provides a complete solution for managing cricket club operations, including team management, member profiles, match fixtures, scorecards, and comprehensive statistics tracking. Built with scalability and maintainability in mind, it showcases industry best practices in API design, security, and data management.

**Portfolio**: [www.dotnetdeveloper.co.uk](https://www.dotnetdeveloper.co.uk)

---

## ✨ Key Features

### Core Functionality
- ✅ **Team Management**: Create and manage multiple cricket teams (1st XI, 2nd XI, Youth, Veterans, Women's)
- ✅ **Member Profiles**: Comprehensive player information with statistics, roles, and availability tracking
- ✅ **Season Management**: Organize fixtures and matches by cricket seasons
- ✅ **Match Fixtures**: Schedule matches with venue, opponent, and competition details
- ✅ **Digital Scorecards**: Record detailed batting scores and bowling figures
- ✅ **Player Statistics**: Automatic calculation of batting averages, strike rates, bowling economy
- ✅ **Match Results**: Track wins, losses, player of the match awards

### Security & Authentication
- 🔐 **JWT-based Authentication**: Secure token-based authentication system
- 🔐 **Role-Based Authorization**: Admin, Captain, and Player roles with granular permissions
- 🔐 **Password Security**: ASP.NET Core Identity with configurable password policies
- 🔐 **Account Lockout**: Brute-force attack prevention with automatic lockout
- 🔐 **Permission System**: Fine-grained access control (Players:View, Teams:Edit, Admin:ManageUsers, etc.)

### Data Management
- 📊 **Seed Data System**: Automatic database seeding with realistic test data (175+ records)
- 📊 **Soft Deletes**: Non-destructive data removal with audit trails
- 📊 **Data Validation**: Comprehensive validation using FluentValidation
- 📊 **Efficient Queries**: Optimized EF Core queries with eager loading and projections

---

## 🏗️ Architecture & Technology Stack

### Architecture Pattern
**Clean Architecture** (Onion Architecture) with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (FaziCricketClub.API + IdentityApi)   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Application Layer               │
│    (Business Logic + Use Cases)         │
│    - DTOs, Mapping, Validation          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Infrastructure Layer              │
│   (EF Core + Repositories + Identity)   │
│    - Data Access, External Services     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Domain Layer                  │
│       (Entities + Interfaces)           │
│    - Pure business logic, no dependencies│
└─────────────────────────────────────────┘
```

### Technology Stack

#### Backend Framework
- **.NET 10.0** - Latest .NET framework for high-performance APIs
- **C# 14.0** - Modern C# with latest language features
- **ASP.NET Core Web API** - RESTful API development
- **Entity Framework Core 10.0** - Advanced ORM for data access
- **ASP.NET Core Identity** - Comprehensive user authentication and authorization
- **SQL Server** - Enterprise-grade relational database

#### Frontend Framework
- **Angular 19** - Modern component-based frontend framework
- **TailwindCSS v4** - Utility-first CSS framework with custom sports theme
- **Angular Material** - Material Design component library
- **TypeScript 5.x** - Type-safe JavaScript
- **RxJS** - Reactive programming with observables

#### Libraries & Packages
- **AutoMapper 13.0.1** - Object-to-object mapping
- **FluentValidation 12.1.1** - Fluent interface for validation rules
- **Swashbuckle (Swagger) 7.2.0** - API documentation and testing UI
- **Microsoft.AspNetCore.Authentication.JwtBearer 10.0.0** - JWT token validation

#### Design Patterns & Practices
- **Repository Pattern** - Data access abstraction
- **Unit of Work Pattern** - Transaction management
- **Dependency Injection** - Built-in IoC container
- **SOLID Principles** - Applied throughout codebase
- **Clean Code** - Readable, maintainable code structure
- **Async/Await** - Non-blocking I/O operations

---

## 📂 Project Structure

```
FazCricketClub/
│
├── FaziCricketClub.Domain/              # Domain entities and interfaces
│   ├── Entities/                        # Core business entities
│   │   ├── Team.cs
│   │   ├── Member.cs
│   │   ├── Season.cs
│   │   ├── Fixture.cs
│   │   ├── MatchResult.cs
│   │   ├── BattingScore.cs
│   │   └── BowlingFigure.cs
│   └── Interfaces/                      # Repository abstractions
│       ├── IRepository.cs
│       ├── IUnitOfWork.cs
│       └── I{Entity}Repository.cs
│
├── FaziCricketClub.Application/         # Business logic layer
│   ├── DTOs/                           # Data Transfer Objects
│   │   ├── TeamDto.cs
│   │   ├── MemberDto.cs
│   │   └── MatchResultDto.cs
│   ├── Mapping/                        # AutoMapper profiles
│   │   └── MappingProfile.cs
│   ├── Services/                       # Business services
│   │   └── Interfaces/
│   └── Validation/                     # FluentValidation rules
│       ├── CreateSeasonDtoValidator.cs
│       └── CreateTeamDtoValidator.cs
│
├── FaziCricketClub.Infrastructure/      # Data access layer
│   ├── Persistence/                    # EF Core DbContext
│   │   ├── CricketClubDbContext.cs
│   │   └── MainDatabaseSeeder.cs       # Seed data generator
│   ├── Repositories/                   # Repository implementations
│   │   ├── Repository.cs
│   │   ├── UnitOfWork.cs
│   │   └── {Entity}Repository.cs
│   └── Migrations/                     # Database migrations
│       └── 20251226_Initial_Migration.cs
│
├── FaziCricketClub.API/                # Main API application
│   ├── Controllers/                    # API endpoints
│   │   ├── TeamsController.cs
│   │   ├── MembersController.cs
│   │   ├── SeasonsController.cs
│   │   ├── FixturesController.cs
│   │   └── SeedController.cs          # Manual seed endpoint
│   ├── Middleware/                     # Custom middleware
│   │   ├── GlobalExceptionHandling.cs
│   │   └── CorrelationIdMiddleware.cs
│   ├── Configuration/                  # App configuration
│   │   └── JwtSettings.cs
│   └── Security/                       # Security helpers
│       └── AppPermissions.cs
│
├── FaziCricketClub.IdentityApi/        # Authentication API
│   ├── Controllers/                    # Auth endpoints
│   │   ├── AuthController.cs          # Login/Register
│   │   └── AdminController.cs         # User/Role management
│   ├── Services/                       # JWT token service
│   │   ├── ITokenService.cs
│   │   └── JwtTokenService.cs
│   ├── Infrastructure/                 # Identity setup
│   │   ├── IdentityDataSeeder.cs      # Roles & permissions
│   │   └── UserSeeder.cs              # Test users
│   ├── Entities/                       # Identity entities
│   │   ├── ApplicationUser.cs
│   │   └── ApplicationRole.cs
│   └── Data/                          # Identity DbContext
│       └── CricketClubIdentityDbContext.cs
│
├── FaziCricketClub.Tests.Unit/         # Unit tests
│   └── Services/                       # Service tests
│
└── FaziCricketClub.Frontend/           # Angular 19 Frontend
    ├── src/app/
    │   ├── core/                       # Core services, guards, interceptors
    │   │   └── layout/                 # Main app shell (header, sidebar)
    │   ├── features/                   # Feature modules (lazy-loaded)
    │   │   ├── dashboard/              # Dashboard with stats & activity
    │   │   ├── members/                # Member management
    │   │   ├── teams/                  # Team management
    │   │   ├── matches/                # Match scheduling
    │   │   └── auth/                   # Login/Register pages
    │   └── shared/                     # Shared components, models
    ├── tailwind.config.js              # TailwindCSS v4 theme
    └── angular.json                    # Angular CLI config
```

---

## 🚀 Getting Started

### Prerequisites

**Backend:**
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) or later
- [SQL Server 2019+](https://www.microsoft.com/sql-server) or SQL Server Express
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (17.13+) or [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

**Frontend:**
- [Node.js 22+](https://nodejs.org/) (LTS recommended)
- [Angular CLI 19+](https://angular.dev/) (`npm install -g @angular/cli`)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/FazCricketClub.git
cd FazCricketClub
```

#### 2. Configure Database Connection Strings

Update `appsettings.json` in both API projects:

**FaziCricketClub.API/appsettings.json**:
```json
{
  "ConnectionStrings": {
    "CricketClubDatabase": "Server=localhost;Database=FaziCricketClubDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**FaziCricketClub.IdentityApi/appsettings.json**:
```json
{
  "ConnectionStrings": {
    "IdentityConnection": "Server=localhost;Database=FaziCricketClubIdentityDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

#### 3. Configure JWT Settings

⚠️ **IMPORTANT**: Use the **same JWT Key** in both `appsettings.json` files:

```json
{
  "Jwt": {
    "Key": "your-super-secret-key-at-least-32-characters-long-for-security",
    "Issuer": "FaziCricketClub",
    "Audience": "FaziCricketClubUsers",
    "ExpiresInMinutes": 60
  }
}
```

#### 4. Apply Database Migrations

**Using Package Manager Console (Visual Studio)**:
```powershell
# Select FaziCricketClub.API as startup project
Update-Database

# Select FaziCricketClub.IdentityApi as startup project
Update-Database
```

**Using .NET CLI**:
```bash
# Main Database
cd FaziCricketClub.API
dotnet ef database update

# Identity Database
cd ../FaziCricketClub.IdentityApi
dotnet ef database update
```

#### 5. Run the Application

**Option A: Visual Studio**
1. Right-click on Solution → **Properties**
2. Select **Multiple startup projects**
3. Set both `FaziCricketClub.API` and `FaziCricketClub.IdentityApi` to **Start**
4. Press **F5** to run

**Option B: Command Line**
```bash
# Terminal 1 - Identity API
cd FaziCricketClub.IdentityApi
dotnet run

# Terminal 2 - Main API
cd FaziCricketClub.API
dotnet run
```

#### 6. Run the Angular Frontend

```bash
cd FaziCricketClub.Frontend
npm install
ng serve
```

The frontend will be available at: **http://localhost:4200**

#### 7. Access APIs & Frontend

- **Angular Frontend**: http://localhost:4200
- **Identity API Swagger**: https://localhost:7001/swagger (or http://localhost:5105/swagger)
- **Main API Swagger**: https://localhost:7000/swagger (or http://localhost:5062/swagger)

---

## 🎮 Usage Guide

### 1. Authentication Flow

#### Step 1: Login to Get JWT Token

**Endpoint**: `POST https://localhost:7001/api/auth/login`

**Request Body**:
```json
{
  "email": "admin@fazcricket.com",
  "password": "Admin@123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBmYXpjcmlja2V0LmNvbSIsIm5hbWUiOiJhZG1pbiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTE0MDAwMCwiZXhwIjoxNzM1MTQzNjAwLCJpYXQiOjE3MzUxNDAwMDB9.abcdef123456...",
  "expiresAt": "2025-12-27T10:30:00Z",
  "user": {
    "id": "guid-here",
    "email": "admin@fazcricket.com",
    "userName": "admin",
    "roles": ["Admin"]
  }
}
```

#### Step 2: Authorize in Swagger

1. Copy the `token` value from the login response
2. Click the **🔒 Authorize** button (top right in Swagger UI)
3. Enter: `Bearer {paste-your-token-here}`
4. Click **Authorize** → **Close**

Now all API requests will include your JWT token automatically!

### 2. Test Users (Development Mode)

The system automatically seeds test users on first run in Development environment:

| Role    | Email                     | Password      | Permissions                          |
|---------|---------------------------|---------------|--------------------------------------|
| Admin   | admin@fazcricket.com      | Admin@123     | Full system access                   |
| Captain | captain@fazcricket.com    | Captain@123   | Team & match management              |
| Player  | player@fazcricket.com     | Player@123    | View fixtures, update availability   |

### 3. Sample API Operations

#### Get All Teams
```http
GET https://localhost:7000/api/teams
Authorization: Bearer {your-token}
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "1st XI",
    "description": "First team squad",
    "isActive": true
  },
  {
    "id": 2,
    "name": "2nd XI",
    "description": "Second team squad",
    "isActive": true
  }
]
```

#### Create a New Season
```http
POST https://localhost:7000/api/seasons
Authorization: Bearer {your-token}
Content-Type: application/json

{
  "name": "Summer 2025",
  "startDate": "2025-04-01",
  "endDate": "2025-09-30",
  "isActive": true
}
```

#### Get Match Fixtures
```http
GET https://localhost:7000/api/fixtures?seasonId=1
Authorization: Bearer {your-token}
```

#### Record Match Result with Scorecard
```http
POST https://localhost:7000/api/matchresults
Authorization: Bearer {your-token}
Content-Type: application/json

{
  "fixtureId": 5,
  "homeTeamRuns": 245,
  "homeTeamWickets": 8,
  "homeTeamOvers": 50.0,
  "awayTeamRuns": 220,
  "awayTeamWickets": 10,
  "awayTeamOvers": 48.3,
  "winningTeamId": 1,
  "resultSummary": "Won by 25 runs",
  "playerOfTheMatchMemberId": 5,
  "notes": "Excellent bowling performance by Smith"
}
```

---

## 📊 Seed Data

### Automatic Seeding (Development Mode Only)

On first startup in Development environment, the system automatically populates:

#### Identity Database
- ✅ **3 Roles** with comprehensive permissions:
  - Admin (all permissions)
  - Captain (team and match management)
  - Player (view and availability)

- ✅ **3 Test Users** ready for testing

#### Main Database
- ✅ **5 Teams**:
  - 1st XI (Senior team)
  - 2nd XI (Secondary team)
  - U19 Team (Youth development)
  - Veterans XI (Senior players)
  - Women's Team

- ✅ **20 Members** with realistic:
  - Names (first + last)
  - Ages (18-45)
  - Positions (batsman, bowler, all-rounder, wicket-keeper)
  - Join dates (2022-2025)
  - Active status (80% active, 20% inactive)

- ✅ **3 Seasons**:
  - Summer 2024 (Apr 1 - Sep 30, Active)
  - Winter 2024 (Oct 1 - Mar 31, Scheduled)
  - Summer 2023 (Apr 1 - Sep 30, Completed)

- ✅ **13 Fixtures** across teams and seasons:
  - 9 Completed matches (60%)
  - 4 Scheduled matches (30%)
  - Various venues and competitions

- ✅ **8 Match Results** with complete scorecards:
  - **176 Batting Scores** with realistic distributions:
    - Top scorer: 50-80 runs
    - Middle order: 10-40 runs
    - Tail enders: 0-15 runs
    - Proportional balls faced, 4s, 6s

  - **72 Bowling Figures** with realistic economy:
    - Best bowler: 2-4 wickets
    - Support bowlers: 0-2 wickets
    - Economy rates: 4-8 runs per over

  - Player of the match awards

### Manual Seeding via API

**Seed Data** (or reseed without clearing):
```http
POST https://localhost:7000/api/seed/data?clearExisting=false
```

**Clear All Data**:
```http
DELETE https://localhost:7000/api/seed/data
```

⚠️ **Note**: Seed endpoints only work in Development environment for safety.

---

## 🔐 Security Features

### Authentication & Authorization

- **JWT Tokens**: Stateless, scalable authentication
- **Token Lifetime**: Configurable (default: 60 minutes)
- **HTTPS Only**: TLS/SSL encryption enforced
- **Role-Based Access Control**: Three-tier role system
- **Permission Claims**: Granular feature-level permissions
  ```
  Players:View, Players:Edit
  Teams:View, Teams:Edit
  Fixtures:View, Fixtures:Edit
  Admin:ManageUsers, Admin:ManageRoles, Admin:ManagePermissions
  ```

### Password Security

- **Minimum Requirements**:
  - 8+ characters
  - 1 uppercase letter
  - 1 lowercase letter
  - 1 digit
- **BCrypt Hashing**: Industry-standard password hashing
- **Account Lockout**: 5 failed attempts → 5-minute lockout
- **Unique Email**: One account per email address

### API Security

- **Input Validation**: FluentValidation on all DTOs
- **SQL Injection Protection**: EF Core parameterized queries
- **XSS Protection**: Automatic output encoding
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Ready for implementation

---

## 📈 Performance Optimizations

- **Async/Await**: Non-blocking I/O throughout
- **Eager Loading**: Optimized `.Include()` for related data
- **Projection**: Select only needed columns
- **Connection Pooling**: Built-in ADO.NET pooling
- **Query Caching**: EF Core compiled queries
- **Soft Deletes**: Global query filters for performance

---

## 🧪 Testing

### Run Unit Tests

```bash
cd FaziCricketClub.Tests.Unit
dotnet test
```

### Test Coverage

- ✅ Service layer unit tests
- ✅ Repository pattern tests
- ✅ Validation rule tests
- ✅ AutoMapper configuration tests

---

## 📝 API Documentation

Full interactive API documentation via Swagger UI:

- **Identity API**: https://localhost:7001/swagger
  - `/api/auth/register` - Register new user
  - `/api/auth/login` - Authenticate user
  - `/api/admin/users` - User management (Admin only)
  - `/api/admin/roles` - Role management (Admin only)

- **Main API**: https://localhost:7000/swagger
  - `/api/teams` - Team CRUD operations
  - `/api/members` - Member management
  - `/api/seasons` - Season management
  - `/api/fixtures` - Match fixture scheduling
  - `/api/matchresults` - Scorecard entry
  - `/api/seed/data` - Manual seed operations

---

## 🚧 Roadmap

### Completed Features

- [x] **Angular 19 Frontend** (Phase 1 Complete)
  - Modern sports-themed UI with TailwindCSS + Angular Material
  - Responsive layout with collapsible sidebar
  - Dashboard with stats, upcoming matches, recent activity
  - Login/Register pages with form validation
  - Lazy-loaded routes for optimal performance

### Planned Features

- [ ] Auth integration with backend APIs (Phase 2)
- [ ] Real-time match updates (SignalR)
- [ ] Player performance analytics dashboard
- [ ] Team selection AI recommendations
- [ ] Mobile app (MAUI)
- [ ] Email notifications
- [ ] Payment integration
- [ ] PDF scorecard export
- [ ] Multi-language support
- [ ] Dark mode UI

---

## 🛠️ Development Skills Demonstrated

### Architecture & Design
- ✅ Clean Architecture (Onion Architecture)
- ✅ SOLID Principles
- ✅ Repository Pattern
- ✅ Unit of Work Pattern
- ✅ Dependency Injection
- ✅ Separation of Concerns

### Backend Development
- ✅ .NET 10.0 & C# 14.0
- ✅ ASP.NET Core Web API
- ✅ Entity Framework Core 10.0
- ✅ LINQ & Lambda Expressions
- ✅ Async/Await Patterns
- ✅ FluentValidation
- ✅ AutoMapper

### Security
- ✅ JWT Authentication
- ✅ ASP.NET Core Identity
- ✅ Role-Based Authorization
- ✅ Claims-Based Permissions
- ✅ Password Hashing (BCrypt)
- ✅ HTTPS/TLS Enforcement

### Database
- ✅ SQL Server
- ✅ EF Core Migrations
- ✅ Complex Relationships
- ✅ Soft Deletes
- ✅ Query Optimization
- ✅ Seed Data Generation

### API Design
- ✅ RESTful Principles
- ✅ Swagger/OpenAPI
- ✅ DTOs & Validation
- ✅ Error Handling
- ✅ API Versioning Ready

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 About the Developer

**Muhammad Afzal**
*Senior .NET Developer | Full-Stack Engineer | Clean Code Advocate*

Passionate about building scalable, maintainable enterprise applications using modern .NET technologies and industry best practices.

### 🌐 Connect With Me

- **Website**: [www.dotnetdeveloper.co.uk](https://www.dotnetdeveloper.co.uk)
- **LinkedIn**: [linkedin.com/in/dotnetdeveloper20xx](https://linkedin.com/in/dotnetdeveloper20xx)
- **Email**: [contact@dotnetdeveloper.co.uk](mailto:contact@dotnetdeveloper.co.uk)
- **GitHub**: [github.com/dotnetdeveloper20xx](https://github.com/dotnetdeveloper20xx)
- **Blog**: [blog.dotnetdeveloper.co.uk](https://blog.dotnetdeveloper.co.uk)

### 💼 Hire Me

Available for:
- Full-stack .NET development
- API design & architecture consultation
- Code reviews & mentoring
- Technical leadership
- Contract/Freelance projects

**Contact**: [contact@dotnetdeveloper.co.uk](mailto:contact@dotnetdeveloper.co.uk)

---

## 🙏 Acknowledgments

- Microsoft for the excellent .NET ecosystem
- ASP.NET Core team for the powerful framework
- Entity Framework Core team for the ORM
- The .NET community for inspiration and support

---

## 📞 Support

Need help or have questions?

1. 📧 **Email**: [contact@dotnetdeveloper.co.uk](mailto:contact@dotnetdeveloper.co.uk)
2. 🐛 **Issues**: [GitHub Issues](https://github.com/dotnetdeveloper20xx/FazCricketClub/issues)
3. 💬 **Discussion**: [GitHub Discussions](https://github.com/dotnetdeveloper20xx/FazCricketClub/discussions)

---

<div align="center">

### ⭐ If you find this project useful, please give it a star! ⭐

**Made with ❤️ and ☕ by [Faz Ahmed](https://www.dotnetdeveloper.co.uk)**

*Showcasing modern .NET development practices*

</div>
