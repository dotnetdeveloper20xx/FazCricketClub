# 🏏 CricketClub – A Full-Stack .NET 10 / C# 14 Mastery Project

> **Status:** Planning & Design Phase (No code committed yet)  
> **Goal:** Build a production-grade, end-to-end Cricket Club platform that exercises **every major concept** from *C# 14 and .NET 10 – Modern Cross-Platform Development Fundamentals*.

This repository is the home of the **CricketClub** project: a realistic cricket club management platform designed to:

- Practice **modern C#** and **.NET 10** at a senior level.
- Demonstrate **production-quality architecture** (Clean/Onion style).
- Showcase **ASP.NET Core, Blazor, EF Core, SQL, Minimal APIs**, and more.
- Serve as a **portfolio piece** and a **learning lab**.

---

## 📚 Table of Contents

1. [Product Vision](#-product-vision)
2. [High-Level Feature Set](#-high-level-feature-set)
3. [Domain Model & Bounded Contexts](#-domain-model--bounded-contexts)
4. [Solution Architecture](#-solution-architecture)
5. [Mapping Book Concepts to This Project](#-mapping-book-concepts-to-this-project)
6. [Implementation Roadmap (Phased Plan)](#-implementation-roadmap-phased-plan)
7. [Next Steps](#-next-steps-checklist)

---

## 🎯 Product Vision

**CricketClub** is a serious platform for a mid–large amateur cricket club. It is not a toy.  

The platform will support:

- Multiple teams (1st XI, 2nd XI, juniors, etc.).
- League, cup, and friendly fixtures across seasons.
- Membership, payments, and roles (player, captain, coach, committee).
- Match scoring and rich statistics.
- Admin & public-facing portals.
- Minimal APIs for future mobile or external integrations.

### Key Actor Personas

1. **Public Visitors / Supporters**
   - Browse fixtures and results.
   - See news and announcements.
   - View public player stats and team info.

2. **Club Members / Players**
   - Manage personal profile.
   - Declare match availability.
   - See team selections and match info.
   - View personal statistics and membership status.

3. **Captains / Coaches**
   - Create squads and playing XIs.
   - Manage player availability and selection.
   - Enter match results / ball-by-ball scoring.
   - Analyze player performance.

4. **Club Committee / Admins**
   - Configure seasons, competitions, and teams.
   - Manage memberships, roles, and approvals.
   - Handle fees/payments (even if payment gateway is mocked initially).
   - Publish news & announcements.

5. **External Consumers (Future)**
   - Mobile apps and third-party systems via **Minimal APIs**.

---

## 🧩 High-Level Feature Set

### 1. Public Website

- Home page, news, and announcements.
- Teams pages (squads, captains, coaches).
- Fixtures & results (filterable by team, competition, date).
- Player profile pages (public view).
- Basic statistics: top run scorers, wicket takers, etc.
- Contact form / enquiries.

### 2. Member Portal

- Registration, login, and secure profile management.
- Match availability per fixture.
- Notifications (selection, schedule changes).
- Membership status & payment history.
- Training & nets information.

### 3. Admin Portal

- Season and competition management.
- Team management (teams, captains, coaches).
- Fixture scheduling and editing.
- Member and roles management.
- Membership categories & fees.
- Content management (news, announcements).

### 4. Scoring & Match Centre

- Pre-match: playing XI selection, toss, bat/bowl decision.
- Live scoring interface (overs, wickets, ball events).
- Automatic batting and bowling scorecards.
- Live scoreboard page for spectators.
- Post-match summaries and reports.

### 5. Statistics & Analytics

- Player stats: averages, strike rates, economies, aggregates.
- Team stats: win/loss records, scored/conceded runs, partnerships.
- Season / career summaries.
- Simple charts and visualizations (later via Blazor components).

### 6. Facilities & Nets Booking

- Facility definitions (grounds, nets, halls).
- Booking slots & calendars.
- Booking / cancellation rules and workflows.

### 7. Shop & Payments (Advanced / Optional)

- Simple club shop (shirts, caps, training gear).
- Membership fee payments & invoices (mocked gateway initially).
- Order history and basic reporting.

### 8. API Surface

- Public APIs for fixtures, results, and basic stats.
- Authenticated APIs for member operations, bookings, etc.
- Designed using **ASP.NET Core Minimal APIs**.

---

## 🧠 Domain Model & Bounded Contexts

We’ll use a pragmatic **bounded context** approach (DDD-inspired, not dogmatic).

### 1. Membership Context

**Core Entities:**

- `Member`
  - Id, FullName, Email, Phone, DateOfBirth, IsActive, JoinedDate, etc.
- `MembershipType`
  - Name, description, annual fee, age boundaries (if applicable).
- `MembershipFee`
  - Amount, due date, season.
- `Payment`
  - Amount, date, method, status.
- `Role`
  - Player, Captain, Coach, Admin, etc.

**Responsibilities:**

- Manage members & their roles.
- Handle membership periods and payment status.
- Support secure authentication and authorization.

---

### 2. Cricket Operations Context

**Core Entities:**

- `Season`
- `Competition` (League, Cup, Friendly)
- `Team`
- `SquadMembership` (Member belongs to a team)
- `Fixture`
  - SeasonId, CompetitionId, HomeTeamId, AwayTeamId, StartDateTime, Venue, Status.
- `Match`
  - FixtureId, TossWinnerTeamId, TossDecision, Format (T20, 40-overs, etc.), Status.
- `Innings`
  - MatchId, BattingTeamId, BowlingTeamId, OversPlanned, OversBowled, Runs, Wickets.
- `BallEvent`
  - InningsId, OverNumber, BallInOver, BowlerId, BatsmanId, RunsOffBat, Extras, WicketInfo.
- `BattingInnings`, `BowlingFigure` (aggregated from `BallEvent`).

**Responsibilities:**

- Lifecycle of cricket matches.
- Rich scorecard and statistics as derived data.

---

### 3. Facilities & Bookings Context

**Core Entities:**

- `Facility` (ground, nets, hall)
- `BookingSlot`
- `Booking`

**Responsibilities:**

- Scheduling & availability of practice facilities.
- Prevent double bookings and handle cancellations.

---

### 4. Shop & Finance Context (Optional)

**Core Entities:**

- `Product`
- `Order`
- `OrderLine`
- `Invoice`

**Responsibilities:**

- Basic club merchandise and membership fee transactions.
- Links to payment infrastructure.

---

### 5. Content & Communication Context

**Core Entities:**

- `NewsItem`
- `Announcement`
- `MediaItem` (photos, possibly video links)
- `ContactMessage`

**Responsibilities:**

- Public and internal communications.
- Handling contact form submissions.

---

### 6. Analytics Context

**Core Entities (mostly read models):**

- `PlayerStats`
- `TeamStats`
- `SeasonStats`

**Responsibilities:**

- Aggregated, query-friendly views built from underlying contexts.
- Used for dashboards, leaderboards, and performance insights.

---

## 🏗 Solution Architecture

We’ll follow a Clean Architecture-ish layout with multiple projects.

### Project Structure (Initial Plan)

- `CricketClub.Domain`
  - Entities, value objects, domain rules.
  - No external dependencies like EF or ASP.NET.
  - Heavy use of modern C# patterns (records, pattern matching, etc.).

- `CricketClub.Application`
  - Use cases (commands, queries).
  - Interfaces for repositories/services (e.g., `IMemberRepository`, `IMatchService`).
  - DTOs and validation components.
  - LINQ-heavy logic and shared types like `Result<T>`.

- `CricketClub.Infrastructure`
  - EF Core DbContext & configurations.
  - Migrations, seeding scripts.
  - External services (email, payment gateway, file storage).
  - Implementation of repository interfaces.

- `CricketClub.WebApi`
  - ASP.NET Core **Minimal APIs**.
  - Public and internal endpoints.
  - Configuration, logging, ProblemDetails, validation.
  - OpenAPI/Swagger integration.

- `CricketClub.Web`
  - **Blazor Web App (Unified Model)**:
    - Public site pages (SSR).
    - Member portal (interactive).
    - Admin portal.
  - Uses HttpClient for WebAssembly scenarios and DI for server-side components.

- `CricketClub.Jobs`
  - Console / worker service.
  - Background tasks (stat recalculation, reminders, data exports).
  - Target for trimming & Native AOT experiments.

- `CricketClub.Shared` (optional, but recommended)
  - Shared contracts (DTOs) and utilities.
  - May be packaged as an internal NuGet to practice packaging & reuse.

- Tests:
  - `CricketClub.Tests.Unit`
  - `CricketClub.Tests.Integration`
  - `CricketClub.Tests.Api` (Minimal API integration tests)
  - Potentially `CricketClub.Tests.Blazor` (for component tests later).

---

## 🔗 Mapping Book Concepts to This Project

This project is designed to **exercise** the concepts from *C# 14 & .NET 10*.

### C# Language & BCL

- **Records & Value Objects** for read models and DTOs.
- **Pattern Matching** for domain logic (e.g., match status transitions).
- **Nullable Reference Types** enforced across the solution.
- **Tuples & Local Functions** in complex operations where appropriate.
- **Generics & Constraints** for `Result<T>`, repositories, caching, and other utilities.

### Collections & LINQ

- LINQ-heavy queries for:
  - Player stats (aggregations: averages, totals, best figures).
  - Team stats (win/loss, runs scored/conceded).
  - Fixtures (filter by date, team, competition).
- Use of newer LINQ methods (`DistinctBy`, `CountBy`, etc.) where suitable.

### Exceptions & Error Handling

- Guard clauses for key operations and input validation.
- Domain-specific error handling unified via `Result<T>` or similar pattern.
- Mapping exceptions and failures to `ProblemDetails` in Minimal APIs.

### Files & Streams

- Export match scorecards and stats to CSV/Excel-like formats.
- Upload and serve profile/team images.
- Optionally: serialize config snapshots to JSON at startup/shutdown.

### JSON & XML Serialization

- `System.Text.Json` as default for APIs & Blazor.
- Optional XML export/import endpoints (e.g., fixtures schedule interchange).

### EF Core & Data

- Rich relational modeling for cricket entities.
- Migrations and seeding for initial data (teams, test fixtures).
- Eager vs lazy loading, projections to DTOs, `ToQueryString()` for query inspection.

### ASP.NET Core / Minimal APIs

- Clean Minimal API endpoint definitions for all major entities.
- Route constraints (`int`, `guid`, `regex`, etc.).
- Short-circuit endpoints for simple paths and health checks.
- Validation integration (including new Minimal API validation features).

### Blazor

- Component-based UI for lists & detail pages (fixtures, players, results).
- `EditForm` with DataAnnotations & `ValidationMessage`s for robust forms.
- `EventCallback` to build reusable form components.
- Streaming rendering for heavy stats pages.

### HttpClient & HttpClientFactory

- Typed HttpClients for calling `CricketClub.WebApi` from Blazor WebAssembly.
- Correct lifecycle management via HttpClientFactory.

### Packaging & NuGet

- `Directory.Packages.props` for Central Package Management.
- Optional internal NuGet package(s) via `CricketClub.Shared`.

### Trimming & Native AOT

- Publish `CricketClub.Jobs` as self-contained, trimmed, and optionally AOT-native.
- Handle reflection-heavy parts carefully (e.g., EF Core or serializers).

---

## 🗺 Implementation Roadmap (Phased Plan)

> **Note:** This is a roadmap for future work. At this stage, **no code is written**.

### Phase 1 – Foundation & Skeleton

**Goal:** Establish solution structure and core domain baseline.

- Create solution & projects as outlined in [Solution Architecture](#-solution-architecture).
- Set up `Directory.Packages.props` for central package management.
- Define minimal core domain entities:
  - `Member`, `Team`, `Season`, `Fixture` (basic shapes).
- Configure EF Core DbContext and first migrations.
- Add a basic Minimal API endpoint (e.g., `/health`).
- Concepts:
  - Project structuring, DI, EF basics, central package mgmt.

---

### Phase 2 – Membership & Authentication

**Goal:** Implement full membership lifecycle and auth.

- Flesh out Membership context (`Member`, `MembershipType`, `Payment`).
- Integrate ASP.NET Core Identity or custom JWT auth.
- Implement Minimal APIs:
  - `POST /members/register`
  - `POST /auth/login`
  - `GET /members/me`
- Create Blazor pages for register & login using `EditForm` & validation.
- Concepts:
  - Auth & identity, validation, Blazor forms, HttpClient from Blazor to API.

---

### Phase 3 – Teams, Seasons & Fixtures

**Goal:** Admin & public handling of fixtures.

- Implement domain entities: `Team`, `Season`, `Competition`, `Fixture`.
- Admin Blazor pages to manage seasons, competitions, fixtures.
- Public pages to browse fixtures and details.
- LINQ queries for upcoming fixtures, by team, by competition.
- Concepts:
  - EF relationships, LINQ sorting/filtering, Blazor lists/details, Minimal API design.

---

### Phase 4 – Match Scoring & Stats Engine

**Goal:** Core cricket engine & statistics.

- Implement `Match`, `Innings`, `BallEvent`, `BattingInnings`, `BowlingFigure`.
- Build Blazor scoring UI for live matches.
- Implement background jobs in `CricketClub.Jobs`:
  - Recalculate stats periodically.
- Build stats endpoints & Blazor pages for top scorers, best bowlers, etc.
- Concepts:
  - Complex domain modeling, advanced querying, background processing, streaming rendering (optional).

---

### Phase 5 – Member Portal & Availability

**Goal:** Player-facing workflows.

- Implement availability declarations per fixture.
- Captains’ screens to view availability & select playing XIs.
- Notifications for selection / changes (email or in-app).
- Concepts:
  - Business workflows, role-based UI, Blazor forms & state management.

---

### Phase 6 – Facilities & Nets Booking

**Goal:** Facility scheduling.

- Implement `Facility`, `BookingSlot`, `Booking`.
- UI for calendars and booking flows.
- Enforce booking rules (no double booking, cancellation windows).
- Concepts:
  - Time-based logic, validation, concurrency control in EF.

---

### Phase 7 – Shop & Payments (Optional/Advanced)

**Goal:** Add simple club e-commerce.

- Implement `Product`, `Order`, `OrderLine`, `Invoice`.
- Blazor UI for browsing products and managing a basket.
- Integrate a mock or test payment gateway.
- Concepts:
  - External APIs, DTOs, error handling, financial workflows.

---

### Phase 8 – Hardening, Observability & Performance

**Goal:** Production-readiness & deployment.

- Configure HTTP logging middleware.
- Improve logging structure across services.
- Finalize OpenAPI docs (summaries, descriptions, versioning).
- Publish:
  - `CricketClub.WebApi` & `CricketClub.Web` via Kestrel (container-friendly).
  - `CricketClub.Jobs` as self-contained (trimmed and possibly AOT).
- Concepts:
  - Observability, OpenAPI, performance & deployment patterns.

---


