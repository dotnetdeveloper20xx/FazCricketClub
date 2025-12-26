# Claude Code Abilities for FazCricketClub

> **A Mentoring Guide for Junior Developers**
>
> Welcome to the team! You've probably noticed a `.claude` folder in our codebase and wondered what it's for. This document explains everything you need to know about Claude Code and how we use it to supercharge our development workflow.

---

## Table of Contents

1. [What is Claude Code?](#what-is-claude-code)
2. [Why Do We Have a `.claude` Folder?](#why-do-we-have-a-claude-folder)
3. [What Claude Code Can Do](#what-claude-code-can-do)
4. [Our Custom Skills (Slash Commands)](#our-custom-skills-slash-commands)
5. [Real-World Examples](#real-world-examples)
6. [Getting Started](#getting-started)
7. [Best Practices](#best-practices)
8. [FAQ](#faq)

---

## What is Claude Code?

**Claude Code** is an AI-powered coding assistant created by Anthropic. Think of it as having a senior developer sitting next to you 24/7, ready to help with:

- Writing code
- Reviewing code
- Debugging issues
- Generating entire features
- Creating tests
- Managing databases
- Automating repetitive tasks
- And much more!

### How is it Different from GitHub Copilot or ChatGPT?

| Feature | Claude Code | GitHub Copilot | ChatGPT |
|---------|-------------|----------------|---------|
| **Understands your entire project** | ✅ Yes (via context files) | ❌ Limited | ❌ No |
| **Custom commands** | ✅ Yes (skills) | ❌ No | ❌ No |
| **Runs terminal commands** | ✅ Yes | ❌ No | ❌ No |
| **Modifies multiple files** | ✅ Yes | ⚠️ Limited | ❌ No |
| **Creates entire features** | ✅ Yes | ❌ No | ⚠️ Via chat |
| **Follows your conventions** | ✅ Yes (via docs) | ⚠️ Limited | ❌ No |

**TL;DR:** Claude Code knows our project inside-out and can actually DO things, not just suggest code.

---

## Why Do We Have a `.claude` Folder?

The `.claude` folder is like a **training manual for Claude Code**. It contains:

### 1. **Project Knowledge** (100KB of documentation)

These files teach Claude about our FazCricketClub project:

```
.claude/
├── project_overview.md      - What our project is, tech stack, structure
├── architecture.md           - Clean Architecture, patterns we use
├── api_conventions.md        - REST API standards, error handling
├── authentication.md         - JWT auth system, roles, permissions
├── database_schema.md        - All entities, relationships, migrations
└── coding_standards.md       - C# conventions, naming, async/await
```

**Why is this important?**

When you start a new conversation with Claude Code, it automatically reads these files. This means:

- ✅ Claude already knows we use Clean Architecture
- ✅ Claude knows our naming conventions (PascalCase, camelCase, `_privateFields`)
- ✅ Claude knows we use soft deletes (`IsDeleted` flag)
- ✅ Claude knows our API response format (`ApiResponse<T>`)
- ✅ Claude knows our JWT auth system
- ✅ Claude follows OUR standards, not generic ones

**Example:**

**Without context files:**
```
You: "Add a new entity called Tournament"
Claude: "Sure! Where should I create it? What patterns do you use?"
```

**With context files:**
```
You: "Add a new entity called Tournament"
Claude: "I'll create it following your Clean Architecture:
  - Domain/Entities/Tournament.cs
  - DTOs (Create, Update, View)
  - Repository interface & implementation
  - Service with dependency injection
  - FluentValidation validators
  - AutoMapper profile
  - EF Core configuration
  - Controller with ApiResponse<T> wrapper
  - Soft delete support
Should I proceed?"
```

See the difference? Claude already knows everything!

---

### 2. **Custom Skills** (10 automation commands)

Skills are like **custom shortcuts** for repetitive tasks. We have 10 skills:

| Skill | What It Does |
|-------|--------------|
| `/test` | Build and run all tests |
| `/build-all` | Build entire solution |
| `/clean-build` | Deep clean and rebuild from scratch |
| `/migration` | Create new EF Core migration |
| `/migration-status` | Show pending migrations for both databases |
| `/db-update` | Apply migrations with safety checks |
| `/seed-data` | Create sample data (users, teams, fixtures) |
| `/add-entity` | Generate complete entity with 13+ files! |
| `/api-start` | Start both APIs and show Swagger URLs |
| `/code-review` | Review uncommitted changes for quality/security |

We'll dive into these in detail below.

---

### 3. **Settings & Permissions**

`settings.local.json` tells Claude which commands it can run without asking permission:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(dotnet build:*)",
      "Bash(dotnet test:*)",
      "Read(*)",
      "Glob(*)"
      // ... and more
    ]
  }
}
```

This speeds up your workflow - Claude doesn't ask permission for every git command or file read.

---

## What Claude Code Can Do

Here's what Claude Code can do for you on this project:

### 1. **Generate Entire Features**

**Example: Add Tournament Entity**

```
You: /add-entity Tournament

Claude creates:
✅ Domain/Entities/Tournament.cs
✅ Application/Dtos/TournamentDto.cs (Create, Update, View)
✅ Application/Interfaces/ITournamentRepository.cs
✅ Application/Interfaces/ITournamentService.cs
✅ Application/Services/TournamentService.cs
✅ Application/Validation/CreateTournamentDtoValidator.cs
✅ Application/Validation/UpdateTournamentDtoValidator.cs
✅ Application/Mapping/TournamentMappingProfile.cs
✅ Infrastructure/Repositories/TournamentRepository.cs
✅ Infrastructure/Configurations/TournamentConfiguration.cs
✅ API/Controllers/TournamentsController.cs
✅ Updates CricketClubDbContext
✅ Registers in DI containers

Total: 13+ files created in seconds!
```

**Time saved:** What would take you 30-45 minutes is done in 10 seconds.

---

### 2. **Generate Angular Applications**

**Example: Create Angular Frontend**

```
You: "Generate a complete Angular application for FazCricketClub with:
- Authentication module with JWT interceptor
- Dashboard with charts for player stats
- Team management CRUD
- Fixture scheduling calendar
- Match scorecard entry form
- Player statistics leaderboard
- Responsive design with Angular Material"

Claude creates:
✅ Complete Angular project structure
✅ Services for each API endpoint
✅ Guards for authentication
✅ HTTP interceptor for JWT tokens
✅ Reactive forms with validation
✅ Components with TypeScript + HTML + CSS
✅ Routing configuration
✅ State management (if needed)
✅ Unit tests for services

Total: 50+ files generated!
```

**Time saved:** Days of work done in minutes.

---

### 3. **Generate Seed Data**

**Example:**

```
You: /seed-data

Claude asks: "What should I seed?"
You: "All data"

Claude creates:
✅ 3 users (admin/captain/player) with passwords
✅ 5 teams (1st XI, 2nd XI, U19, Veterans, Women's)
✅ 20 realistic members with cricket positions
✅ 3 seasons (Summer 2024, Winter 2024, Summer 2023)
✅ 15 fixtures with realistic dates
✅ 8 completed match results with scorecards
✅ Batting scores with realistic runs/balls/4s/6s
✅ Bowling figures with overs/wickets/runs

Then shows you login credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Test User Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin:   admin / Admin@123
Captain: captain / Captain@123
Player:  player / Player@123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Time saved:** Hours of manual data entry.

---

### 4. **Code Review Before Commit**

**Example:**

```
You: /code-review

Claude reviews your uncommitted changes:

📋 CODE REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ GOOD PRACTICES:
- Clean Architecture layers properly separated
- Async/await used correctly
- Proper naming conventions

🔴 CRITICAL ISSUES:
1. Missing [Authorize] attribute on DELETE endpoint
   Fix: Add [Authorize(Policy = "CanEditFixtures")]

2. Possible null reference exception
   File: FixtureService.cs:45
   Fix: Add guard clause

🟡 WARNINGS:
1. Missing FluentValidation validator for CreateFixtureDto
2. No XML documentation on public API methods

📝 RECOMMENDATIONS:
- Fix critical issues before committing
- Add unit tests for new service methods
```

**Benefit:** Catch bugs, security issues, and violations BEFORE they hit the repo.

---

### 5. **Database Migrations**

**Example:**

```
You: /migration-status

Claude shows:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MAIN DATABASE (CricketClubDb)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Applied Migrations: 12
⚠️  Pending Migrations: 2
  - AddTournamentEntity
  - UpdateMemberSchema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 IDENTITY DATABASE (CricketClubIdentityDb)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ No pending migrations

You: /db-update main

Claude:
⚠️  WARNING: This will modify your database!
Pending migrations:
  - AddTournamentEntity
  - UpdateMemberSchema

Proceed? (yes/no)

You: yes

Claude:
✅ Successfully applied 2 migrations
```

**Benefit:** Safe database updates with clear visibility.

---

### 6. **Build, Test, and Deploy Automation**

**Example:**

```
You: /test

Claude:
Running build and tests...

✅ Build succeeded in 10.2s
- 9 projects built
- 1 warning

Running tests...
✅ 49 tests passed
❌ 2 tests failed

Failed tests:
1. MatchResultServiceTests.UpsertMatchResult
   Error: EF Core tracking conflict
   Suggestion: Use AsNoTracking() in repository query

2. PlayerStatsServiceTests.GetBattingLeaderboard
   Error: Expected memberId=2 but got 3
   Suggestion: Check ordering logic in LINQ query
```

**Benefit:** Instant feedback, with suggestions on how to fix failures.

---

### 7. **Generate Documentation**

**Example:**

```
You: "Generate API documentation for all our endpoints in Markdown format"

Claude creates:
✅ Complete API reference
✅ Request/response examples
✅ Authentication requirements
✅ Error codes and meanings
✅ Sample cURL commands
✅ Organized by resource (Seasons, Teams, Members, etc.)
```

---

### 8. **Refactoring Entire Modules**

**Example:**

```
You: "Refactor the MatchResultService to use Result<T> pattern instead of nullable returns"

Claude:
1. Creates Result<T> class
2. Updates all service methods to return Result<T>
3. Updates controllers to handle Result<T>
4. Updates tests
5. Shows you a diff of all changes

Total files modified: 12
```

---

### 9. **Generate Tests**

**Example:**

```
You: "Generate xUnit tests for TournamentService covering all CRUD operations"

Claude creates:
✅ TournamentServiceTests.cs with:
   - CreateAsync_ValidDto_ReturnsCreatedTournament
   - CreateAsync_InvalidDto_ThrowsValidationException
   - GetByIdAsync_ExistingId_ReturnsTournament
   - GetByIdAsync_NonExistentId_ReturnsNull
   - UpdateAsync_ValidUpdate_UpdatesTournament
   - DeleteAsync_ExistingId_SoftDeletesTournament
   - GetAllAsync_ReturnsAllNonDeletedTournaments

✅ Uses Moq for mocking repositories
✅ Proper arrange-act-assert pattern
✅ FluentAssertions for readable assertions
```

---

## Our Custom Skills (Slash Commands)

Here's a detailed guide to each custom skill we've created:

### `/test` - Build and Test

**What it does:**
1. Builds the entire solution
2. Runs all unit tests
3. Shows detailed results with file paths and line numbers

**When to use:**
- After making code changes
- Before committing
- To verify everything still works

**Example:**
```
You: /test

Result:
✅ Build succeeded (10.2s)
✅ 49 tests passed
❌ 2 tests failed (shows details)
```

---

### `/build-all` - Build Solution

**What it does:**
1. Builds entire solution
2. Shows errors with file paths
3. Suggests fixes for common errors

**When to use:**
- Check for compilation errors
- After pulling latest changes
- Before running application

**Example:**
```
You: /build-all

Result:
✅ Build succeeded
- 9 projects built
- 0 errors
- 2 warnings (lists them)
```

---

### `/clean-build` - Deep Clean and Rebuild

**What it does:**
1. Removes all bin/obj folders
2. Clears NuGet cache (optional)
3. Restores packages
4. Rebuilds from scratch

**When to use:**
- After switching branches
- When build is acting weird
- After merging code
- To fix package corruption

**Example:**
```
You: /clean-build

Result:
Step 1/4: Cleaning...
Step 2/4: Removing bin/obj...
Step 3/4: Restoring packages...
Step 4/4: Building...
✅ Clean build succeeded (15.2s)
```

---

### `/migration` - Create EF Core Migration

**What it does:**
1. Asks which database (Main or Identity)
2. Creates migration with your specified name
3. Shows what the migration will do
4. Reminds you to review before applying

**When to use:**
- After adding/modifying entities
- When changing database schema

**Example:**
```
You: /migration AddTournamentEntity

Result:
Creating migration for Main database...
✅ Migration created: 20241221_AddTournamentEntity.cs

This migration will:
- Add Tournaments table
- Add foreign key to Seasons

To apply: /db-update main
```

---

### `/migration-status` - Check Migration Status

**What it does:**
1. Shows status for BOTH databases
2. Lists applied vs pending migrations
3. Provides recommendations

**When to use:**
- Before applying migrations
- After pulling code
- To understand database state

**Example:**
```
You: /migration-status

Result:
📊 MAIN DATABASE
Applied: 12 migrations
⚠️  Pending: 2 migrations
  - AddTournamentEntity
  - UpdateMemberSchema

🔐 IDENTITY DATABASE
✅ Up-to-date (5 migrations applied)

📝 Recommendation: Run /db-update main
```

---

### `/db-update` - Apply Migrations

**What it does:**
1. Shows pending migrations
2. Warns you it will modify database
3. Asks for confirmation
4. Applies migrations
5. Reports success/failure

**When to use:**
- After creating migrations
- After pulling code with new migrations
- To update database schema

**Example:**
```
You: /db-update main

Result:
Pending migrations:
- AddTournamentEntity
- UpdateMemberSchema

⚠️  WARNING: This will modify your database!
Proceed? (yes/no)

You: yes

✅ Successfully applied 2 migrations
```

---

### `/seed-data` - Create Sample Data

**What it does:**
1. Creates realistic test data
2. Seeds both databases (Identity + Main)
3. Shows test user credentials
4. Provides enough data to test all features

**When to use:**
- Fresh database setup
- After resetting database
- For demos
- For manual testing

**Example:**
```
You: /seed-data

Result:
✅ Identity Database:
   - 3 users (admin, captain, player)

✅ Main Database:
   - 5 teams
   - 20 members
   - 3 seasons
   - 15 fixtures
   - 8 match results with scorecards

🔐 Credentials:
Admin: admin / Admin@123
Captain: captain / Captain@123
Player: player / Player@123
```

---

### `/add-entity` - Generate Complete Entity

**What it does:**
1. Creates domain entity
2. Creates 3 DTOs (Create, Update, View)
3. Creates repository interface & implementation
4. Creates service interface & implementation
5. Creates FluentValidation validators (2)
6. Creates AutoMapper profile
7. Creates EF Core configuration
8. Creates controller with all REST endpoints
9. Updates DbContext
10. Registers in DI containers
11. Suggests creating migration

**Total: 13+ files created following Clean Architecture!**

**When to use:**
- Adding new features
- Creating new domain models

**Example:**
```
You: /add-entity Tournament

Claude asks: "What properties?"
You: "Name (string), StartDate (DateTime), EndDate (DateTime), IsActive (bool)"

Result:
✅ Created 13 files:
- Domain/Entities/Tournament.cs
- DTOs (Create, Update, View)
- Repository interface & implementation
- Service interface & implementation
- Validators (Create, Update)
- AutoMapper profile
- EF Core configuration
- Controller with REST endpoints
- Updated DbContext and DI

Next: /migration AddTournamentEntity
```

**Time saved: 30+ minutes of boilerplate coding!**

---

### `/api-start` - Start APIs

**What it does:**
1. Starts IdentityApi
2. Starts Main API
3. Shows both URLs
4. Shows Swagger URLs
5. Provides sample endpoint URLs

**When to use:**
- Testing API changes
- Manual testing
- Demos

**Example:**
```
You: /api-start

Result:
✅ IdentityApi started
   URL: https://localhost:7001
   Swagger: https://localhost:7001/swagger

✅ Main API started
   URL: https://localhost:7000
   Swagger: https://localhost:7000/swagger

Try:
- POST https://localhost:7001/api/auth/login
- GET https://localhost:7000/api/seasons
```

---

### `/code-review` - Review Code Quality

**What it does:**
1. Reads all uncommitted changes
2. Checks against our coding standards
3. Looks for security issues
4. Checks architectural compliance
5. Provides severity levels (Critical/Warning/Suggestion)
6. Shows how to fix each issue

**When to use:**
- Before committing
- Before creating PR
- After major changes

**Example:**
```
You: /code-review

Result:
📋 CODE REVIEW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ GOOD PRACTICES:
- Clean Architecture maintained
- Async/await used properly
- Naming conventions followed

🔴 CRITICAL (must fix):
1. Missing authorization on DELETE endpoint
   File: TournamentsController.cs:67
   Fix: Add [Authorize(Policy = "CanEditTournaments")]

🟡 WARNINGS (should fix):
1. Missing FluentValidation validator
2. No XML documentation

🔵 SUGGESTIONS (consider):
1. Consider pagination for GetAll
2. Add logging in service methods

📝 RECOMMENDATIONS:
- Fix critical issues before committing
- Add unit tests for TournamentService
```

---

## Real-World Examples

### Example 1: New Feature from Scratch (Tournament Management)

```
Day 1: Planning and Entity Creation
You: /add-entity Tournament
[Claude creates 13 files in 10 seconds]

You: /migration AddTournamentEntity
[Claude creates migration]

You: /db-update main
[Claude applies migration]

You: /test
[All tests pass]

Day 2: Frontend
You: "Generate Angular components for tournament management with:
- List view with filtering
- Create/edit form with validation
- Delete confirmation dialog
- Integration with tournament API endpoints"

[Claude generates complete Angular module]

Day 3: Testing
You: /seed-data
[Claude creates sample tournaments]

You: /api-start
[Both APIs running, test in Swagger]

You: /code-review
[Claude reviews all changes]

You: "Create a GitHub PR for this feature"
[Claude creates PR with detailed description]

Total time: 3 days instead of 2 weeks!
```

---

### Example 2: Bug Fix Workflow

```
You: "There's a null reference exception in MatchResultService.cs line 114"

Claude:
[Reads the file, analyzes the code]
"I found the issue. The fixture variable isn't null-checked before accessing Winner property."

You: "Fix it"

Claude:
[Adds guard clause, updates code]
✅ Fixed MatchResultService.cs:114
✅ Added null check
✅ Added unit test for null scenario

You: /test
✅ All tests pass

You: /code-review
✅ No issues found

You: "Create GitHub issue documenting this bug and the fix"
[Claude creates issue with details]
```

---

### Example 3: Database Reset for Testing

```
You: "I need to reset my database and start fresh"

You: /db-update main
Claude: "Database is up-to-date"

You: "Drop the database and recreate it"

Claude:
⚠️  WARNING: This will DELETE all data!
Continue? (yes/no)

You: yes

Claude:
[Drops database]
[Creates database]
[Applies all migrations]
✅ Database recreated

You: /seed-data
[Claude creates sample data]
✅ Database ready for testing!
```

---

## Getting Started

### Step 1: Install Claude Code

1. Go to https://claude.ai/claude-code
2. Download and install for your OS
3. Sign in with your Anthropic account

### Step 2: Open FazCricketClub

```bash
cd C:\Users\afzal\source\repos\dotnetdeveloper20xx\FazCricketClub
claude-code .
```

Or use the CLI shortcut if configured.

### Step 3: Explore the `.claude` Folder

The folder is already set up! Just familiarize yourself with the files:

```
.claude/
├── Context files - Read these to understand our standards
├── Skills - Try each /command
└── settings.local.json - Permissions (already configured)
```

### Step 4: Try Your First Skill

```
You: /test

Claude will build and test the entire solution!
```

### Step 5: Ask Claude About the Project

```
You: "Explain how authentication works in this project"

Claude will read authentication.md and explain our JWT system!
```

---

## Best Practices

### DO:

✅ **Use skills for repetitive tasks** - `/test`, `/build-all`, `/migration-status`
✅ **Run `/code-review` before committing** - Catch issues early
✅ **Use `/add-entity` for new features** - Saves 30+ minutes
✅ **Ask Claude to explain code** - "How does MatchResultService work?"
✅ **Let Claude generate tests** - "Write xUnit tests for TournamentService"
✅ **Use Claude for refactoring** - "Extract this into a separate service"
✅ **Create GitHub issues from Claude** - "Create issue for this bug"

### DON'T:

❌ **Don't blindly accept code** - Always review what Claude generates
❌ **Don't commit `.claude/settings.local.json`** - It's gitignored for a reason
❌ **Don't skip `/code-review`** - It catches issues you might miss
❌ **Don't forget to test** - Run `/test` after Claude makes changes
❌ **Don't apply migrations without reviewing** - Always check what they do
❌ **Don't share your GitHub token** - Keep `~/.claude/config.json` private

---

## FAQ

### Q: Does Claude Code work offline?
**A:** No, it requires internet connection to access Claude's AI models.

### Q: Can Claude access my entire hard drive?
**A:** No, Claude only has access to:
- Your project directory
- Files you explicitly give permission to read
- Paths specified in MCP server configuration

### Q: What if Claude makes a mistake?
**A:** Always review code before committing. Use `/code-review` to catch issues. Remember: Claude is a tool, you're the developer.

### Q: Can multiple developers use the same `.claude` folder?
**A:** Yes! The context files and skills are shared via git. Only `settings.local.json` is personal (gitignored).

### Q: How much does Claude Code cost?
**A:** Check Anthropic's pricing at https://www.anthropic.com/pricing. We have a team plan.

### Q: Can I create my own skills?
**A:** Yes! Create a new `.md` file in `.claude/skills/` following the existing patterns. See any skill file for the format.

### Q: What's the difference between skills and just asking Claude?
**A:** Skills are predefined workflows that Claude follows step-by-step. Regular chat is more flexible but less consistent.

### Q: Can Claude deploy our application?
**A:** With proper MCP server configuration and permissions, yes. But we keep deployments manual for safety.

### Q: Should I use Claude for everything?
**A:** Use Claude for:
- Boilerplate code (entities, DTOs, controllers)
- Repetitive tasks (builds, tests, migrations)
- Code review and suggestions
- Learning our codebase

Write critical business logic yourself. Claude helps you, doesn't replace you.

---

## Quick Reference Card

**Print this out and keep it handy!**

```
═══════════════════════════════════════════════════════════════
                   FAZICRICKETCLUB CLAUDE QUICK REFERENCE
═══════════════════════════════════════════════════════════════

📋 COMMON SKILLS
───────────────────────────────────────────────────────────────
/test                    → Build and run all tests
/build-all               → Build entire solution
/clean-build             → Deep clean and rebuild
/migration <name>        → Create EF migration
/migration-status        → Check pending migrations
/db-update <main|both>   → Apply migrations
/seed-data               → Create sample data
/add-entity <name>       → Generate complete entity (13+ files!)
/api-start               → Start both APIs
/code-review             → Review uncommitted changes

🤖 COMMON TASKS
───────────────────────────────────────────────────────────────
"Generate Angular components for X feature"
"Write xUnit tests for YService"
"Explain how authentication works"
"Refactor X to use Y pattern"
"Fix the bug in Z"
"Create GitHub issue for X"
"Generate API documentation"

📚 DOCUMENTATION LOCATION
───────────────────────────────────────────────────────────────
.claude/project_overview.md      → Project basics
.claude/architecture.md           → Clean Architecture guide
.claude/api_conventions.md        → API standards
.claude/authentication.md         → JWT auth system
.claude/database_schema.md        → Database documentation
.claude/coding_standards.md       → C# conventions

🔐 TEST CREDENTIALS (from /seed-data)
───────────────────────────────────────────────────────────────
Admin:   admin / Admin@123
Captain: captain / Captain@123
Player:  player / Player@123

═══════════════════════════════════════════════════════════════
```

---

## Conclusion

You now understand what Claude Code is, why we have a `.claude` folder, and what amazing things it can do for us.

**Key Takeaways:**

1. **Claude Code knows our entire project** through context files
2. **We have 10 custom skills** that automate repetitive tasks
3. **Claude can generate entire features** in seconds
4. **Always review code** before committing
5. **Use `/code-review`** to maintain quality
6. **Skills save hours of work** - use them!

**Remember:** Claude Code is a powerful tool that amplifies your abilities as a developer. It handles the boring, repetitive stuff so you can focus on solving interesting problems and building great features.

Welcome to the team, and happy coding!

---

*Questions? Ask in #engineering-claude Slack channel or ping the team lead.*

**Document Version:** 1.0
**Last Updated:** December 21, 2024
**Maintained By:** Senior Engineering Team
