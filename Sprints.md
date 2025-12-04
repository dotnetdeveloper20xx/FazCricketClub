# 🏃‍♂️ CricketClub – Sprint Plan (1-Week Sprints)

Each sprint is designed as **one focused week** of work for a single developer, with a strong emphasis on:

- A clear **Sprint Goal**
- A concise **Definition of Done (DoD)**
- **Tasks** that include both implementation and testing
- No moving to the next sprint until the current one is implemented and tested

> Note: This is a living plan. As the project evolves, we can refine scope per sprint.

---

## Sprint 1 – Foundation & Solution Skeleton

**Sprint Goal:**  
Establish the solution structure, base projects, and get a minimal “Hello, I exist” web API and Blazor app running end-to-end.

**Definition of Done:**

- Solution with projects created and building successfully.
- Minimal Web API endpoint (`/health` or `/ping`) returns 200.
- Blazor Web project runs and shows a placeholder home page.
- Central Package Management is configured.
- Basic unit test project in place and running a sample test.

**Tasks:**

- [ ] Create solution `CricketClub.sln`.
- [ ] Create projects:
  - [ ] `CricketClub.Domain`
  - [ ] `CricketClub.Application`
  - [ ] `CricketClub.Infrastructure`
  - [ ] `CricketClub.WebApi`
  - [ ] `CricketClub.Web` (Blazor Web App – unified model)
  - [ ] `CricketClub.Jobs`
  - [ ] `CricketClub.Tests.Unit`
- [ ] Configure **Directory.Packages.props** for Central Package Management.
- [ ] Wire up basic DI container & logging in `CricketClub.WebApi`.
- [ ] Add minimal `/health` endpoint in WebApi using Minimal API.
- [ ] Set up Blazor Web project with a simple “CricketClub Home” page.
- [ ] Add one trivial unit test (e.g. a simple `Math` helper) and ensure `dotnet test` runs successfully.
- [ ] Document solution structure in README.

**Testing Tasks:**

- [ ] Run `dotnet build` on the entire solution.
- [ ] Run `dotnet test` and confirm green.
- [ ] Manually hit `/health` in browser/Postman and verify response.
- [ ] Load Blazor site in browser and verify the home page renders.

---

## Sprint 2 – Core Domain Model & EF Core Setup

**Sprint Goal:**  
Define initial domain entities (Member, Team, Season, Fixture) and set up EF Core with a database and migrations.

**Definition of Done:**

- `CricketClub.Domain` has basic core entities defined.
- `CricketClub.Infrastructure` contains DbContext and mappings.
- Database (e.g., SQL Server) is created via EF migrations.
- Minimal seeding for one Season, one Team, and a placeholder Fixture.
- A basic API endpoint returns seeded data.

**Tasks:**

- [ ] Define domain entities:
  - [ ] `Member` (minimal props: Id, FullName, Email, IsActive)
  - [ ] `Team` (Id, Name, AgeGroup, etc.)
  - [ ] `Season` (Id, Name, Start/End dates)
  - [ ] `Fixture` (Id, SeasonId, HomeTeamId, AwayTeamId, StartDateTime, Status)
- [ ] Create `CricketClubDbContext` in `CricketClub.Infrastructure`.
- [ ] Configure EF Core provider (SQL Server or chosen DB).
- [ ] Add EF Core entity configurations (Fluent API or attributes).
- [ ] Create initial migration and apply it:
  - [ ] `dotnet ef migrations add InitialCreate`
  - [ ] `dotnet ef database update`
- [ ] Seed minimal data from Infrastructure (e.g., via `OnModelCreating` or seeding service).
- [ ] Add a Minimal API endpoint `/fixtures/seeded` to fetch seeded fixtures.

**Testing Tasks:**

- [ ] Run `dotnet ef database update` and confirm DB is created.
- [ ] Use `ToQueryString()` on at least one EF query and log SQL to verify correctness.
- [ ] Add unit tests for simple domain rules (e.g., `Member.IsActive` logic, `Season` validity).
- [ ] Manual test via Postman: call `/fixtures/seeded` and verify data returned.

---

## Sprint 3 – Membership & Authentication Basics

**Sprint Goal:**  
Implement basic membership entities and a simple authentication mechanism (e.g., Identity or JWT), with registration and login endpoints.

**Definition of Done:**

- Membership entities (`MembershipType`, `Payment`) created.
- Authentication in place (choose ASP.NET Core Identity or custom JWT).
- Minimal API endpoints for register & login working.
- Blazor login/register pages exist and can call the API.
- Auth is enforced on at least one “protected” API endpoint.

**Tasks:**

- [ ] Extend domain with:
  - [ ] `MembershipType`
  - [ ] `Payment` (basic fields: Id, MemberId, Amount, PaidDate, Status)
- [ ] Decide auth approach:
  - [ ] ASP.NET Core Identity **or**
  - [ ] Custom JWT-based auth (with a simple user store).
- [ ] Configure auth in `CricketClub.WebApi` (services + middleware).
- [ ] Implement endpoints:
  - [ ] `POST /auth/register`
  - [ ] `POST /auth/login`
  - [ ] `GET /members/me` (requires auth)
- [ ] Implement minimal Blazor pages:
  - [ ] `/register`
  - [ ] `/login`
- [ ] Store and use JWT/identity info on the client side to call a protected endpoint.

**Testing Tasks:**

- [ ] Unit tests for membership validation (e.g., required fields).
- [ ] Unit/integration tests for auth endpoints (happy path + failure).
- [ ] Manual flow:
  - [ ] Register a new user.
  - [ ] Log in and obtain a token/cookie.
  - [ ] Call `GET /members/me` successfully.
- [ ] Verify unauthorized access to `/members/me` is rejected properly.

---

## Sprint 4 – Teams, Seasons & Fixtures Management

**Sprint Goal:**  
Build admin APIs and Blazor UIs to manage Teams, Seasons, and Fixtures.

**Definition of Done:**

- CRUD APIs for `Season`, `Team`, and `Fixture` are implemented.
- Admin Blazor pages exist to create/edit/delete seasons, teams, fixtures.
- Fixtures list page (public or admin) shows upcoming fixtures with filtering.
- Data validation is in place (basic required fields, date ranges).

**Tasks:**

- [ ] Implement Minimal API endpoints:
  - [ ] `GET /seasons`, `POST /seasons`, `PUT /seasons/{id}`, `DELETE /seasons/{id}`
  - [ ] `GET /teams`, `POST /teams`, `PUT /teams/{id}`, `DELETE /teams/{id}`
  - [ ] `GET /fixtures`, `POST /fixtures`, `PUT /fixtures/{id}`, `DELETE /fixtures/{id}`
- [ ] Add basic route constraints (e.g., `{id:int}`).
- [ ] Add validation attributes or FluentValidation for Season/Fixture (dates, required fields).
- [ ] Create Blazor admin pages:
  - [ ] Season list and edit/create form.
  - [ ] Team list and edit/create form.
  - [ ] Fixture list and edit/create form (with dropdowns for teams & season).
- [ ] Ensure fixtures are linked with Season and Teams.

**Testing Tasks:**

- [ ] Add unit tests for simple validation rules.
- [ ] Add integration tests for at least one entity (e.g., Season CRUD).
- [ ] Use Postman to exercise fixture APIs.
- [ ] Manually verify Blazor pages can create/edit/delete records and reflect in DB.

---

## Sprint 5 – Public Fixtures & Basic Stats View

**Sprint Goal:**  
Expose fixtures publicly and add a basic statistics view (e.g., upcoming fixtures + simple counts).

**Definition of Done:**

- Public API endpoints for fixtures (read-only) ready.
- Public Blazor SSR pages show fixtures by team and season.
- A simple stats page (e.g., “Number of fixtures per team this season”) implemented using LINQ.

**Tasks:**

- [ ] Implement read-only endpoints:
  - [ ] `GET /public/fixtures`
  - [ ] `GET /public/fixtures/by-team/{teamId:int}`
  - [ ] `GET /public/fixtures/by-season/{seasonId:int}`
- [ ] Build Blazor public pages:
  - [ ] `/fixtures` – list, filter by team/season.
  - [ ] Basic fixture detail page.
- [ ] Implement a simple stats query:
  - [ ] e.g., `GET /stats/fixtures-per-team/{seasonId:int}`
- [ ] Create a Blazor stats page with a simple table or chart placeholder.

**Testing Tasks:**

- [ ] LINQ query unit tests for stats logic (using an in-memory collection or test context).
- [ ] Integration tests for `/public/fixtures` endpoints.
- [ ] Manual test: navigate public fixtures and stats pages, verify data and basic responsiveness.

---

## Sprint 6 – Match & Scoring Domain Modeling

**Sprint Goal:**  
Model the detailed match & scoring domain (`Match`, `Innings`, `BallEvent` etc.) and implement basic storage and retrieval.

**Definition of Done:**

- Domain entities for match scoring defined and mapped with EF Core.
- Migrations applied successfully.
- Minimal APIs exist to create a Match and record basic innings data.
- Data correctness verified (foreign keys and relationships working).

**Tasks:**

- [ ] Add entities:
  - [ ] `Match`
  - [ ] `Innings`
  - [ ] `BallEvent`
  - [ ] `BattingInnings`, `BowlingFigure` (as needed)
- [ ] Configure EF Core relationships and cascade rules.
- [ ] Add migrations and update DB.
- [ ] Implement Minimal API endpoints:
  - [ ] `POST /matches` (create from a fixture)
  - [ ] `GET /matches/{id}`
  - [ ] `GET /matches/by-fixture/{fixtureId:int}`
- [ ] Implement internal logic/methods to add ball events and compute simple totals (e.g., total runs per innings).

**Testing Tasks:**

- [ ] Unit tests for domain logic (e.g., calculating score from BallEvents).
- [ ] Integration tests ensuring Match + Innings are persisted and loaded correctly.
- [ ] Manual DB inspection (e.g., SSMS) to ensure relationships look correct.

---

## Sprint 7 – Scoring UI & Live Match Centre (MVP)

**Sprint Goal:**  
Create a minimal Blazor scoring UI and a public match centre that reflects basic live scoring.

**Definition of Done:**

- Blazor scoring page exists for a given Match.
- Scorers can add basic events (runs, wickets) via UI.
- Public match centre page shows current score and basic summary.
- Data flows from Blazor to Web API to DB and is reflected in real time (on refresh or via simple polling).

**Tasks:**

- [ ] Build Blazor scoring component:
  - [ ] Select match & innings.
  - [ ] Simple controls to add run events and wicket events.
- [ ] Implement APIs to post BallEvents:
  - [ ] `POST /matches/{matchId:int}/ball-events`
- [ ] Build public match centre page:
  - [ ] `/matches/{matchId}` – view current score & summary.
- [ ] Add basic refresh/polling logic (client-side timer to refetch).

**Testing Tasks:**

- [ ] Unit tests for scoring commands (e.g., `AddBallEvent` use case).
- [ ] Manual “scoring session” test:
  - [ ] Create a match.
  - [ ] Add some overs via scoring page.
  - [ ] Confirm public match centre shows correct totals.
- [ ] Verify no obvious concurrency issues when quickly adding events.

---

## Sprint 8 – Member Portal & Availability

**Sprint Goal:**  
Provide member-facing portal functionality: players can manage availability and captains can see availability per fixture.

**Definition of Done:**

- Availability model and APIs implemented.
- Authenticated member portal pages for:
  - Declaring availability per fixture.
  - Viewing their upcoming fixtures.
- Captain/coaches view showing availability per fixture.
- Basic business rules (e.g., one availability record per member+fixture).

**Tasks:**

- [ ] Add entity `Availability` (MemberId, FixtureId, Status).
- [ ] Implement Minimal API endpoints:
  - [ ] `GET /members/me/fixtures`
  - [ ] `GET /members/me/availability`
  - [ ] `POST /availability` (create/update)
  - [ ] `GET /fixtures/{fixtureId:int}/availability` (captain view)
- [ ] Build Blazor pages:
  - [ ] Member “My Fixtures & Availability” page.
  - [ ] Captain’s “Fixture Availability Overview” page.
- [ ] Add validation / rules (e.g., can’t set availability for fixtures in the past).

**Testing Tasks:**

- [ ] Unit tests for availability rules.
- [ ] Integration tests for availability endpoints.
- [ ] Manual tests:
  - [ ] Log in as a member, declare availability.
  - [ ] Log in as a captain, view the same fixture and see statuses.

---

## Sprint 9 – Facilities & Nets Booking

**Sprint Goal:**  
Implement facility and nets booking domain, APIs, and UI.

**Definition of Done:**

- Facilities and bookings modeled and persisted.
- APIs for viewing and creating bookings implemented.
- Blazor UI allows a member to view available slots and create/cancel bookings.
- Rules enforced (no double bookings for same slot).

**Tasks:**

- [ ] Add entities:
  - [ ] `Facility`
  - [ ] `BookingSlot`
  - [ ] `Booking`
- [ ] Implement APIs:
  - [ ] `GET /facilities`
  - [ ] `GET /facilities/{id:int}/slots`
  - [ ] `POST /bookings`
  - [ ] `DELETE /bookings/{id:int}`
- [ ] Implement double-booking guard in Application layer.
- [ ] Build Blazor pages:
  - [ ] Facility list page.
  - [ ] Booking calendar/slots UI for a facility.
- [ ] Add simple constraints (e.g., cannot book in the past).

**Testing Tasks:**

- [ ] Unit tests for booking rules (no double booking, past bookings).
- [ ] Integration tests around booking creation/deletion.
- [ ] Manual tests:
  - [ ] Book a slot, attempt to double-book same slot.
  - [ ] Cancel booking and verify availability returns.

---

## Sprint 10 – Observability, OpenAPI, and Background Jobs

**Sprint Goal:**  
Harden the system with logging, OpenAPI docs, and at least one background job for stats.

**Definition of Done:**

- HTTP logging configured and verified.
- OpenAPI documentation available and enriched with summaries/descriptions.
- `CricketClub.Jobs` has at least one working background job (e.g., recompute player stats nightly).
- One app (e.g., Jobs) published as self-contained and trimmed (optionally AOT).

**Tasks:**

- [ ] Configure HTTP logging middleware in WebApi.
- [ ] Add `AddOpenApi` / `MapOpenApi` and enrich endpoints with `.WithSummary()` / `.WithDescription()`.
- [ ] Build a background job in `CricketClub.Jobs`:
  - [ ] Connect to DB.
  - [ ] Recompute and store summary stats (`PlayerStats`).
- [ ] Configure a basic scheduler (e.g., OS-level or simple cron-like config) to run the job.
- [ ] Publish `CricketClub.Jobs` as self-contained & trimmed.
- [ ] Document how to run jobs and where logs/stats are stored.

**Testing Tasks:**

- [ ] Use OpenAPI JSON/YAML to inspect docs and confirm correctness.
- [ ] Manual run of `CricketClub.Jobs` and confirm stats updated in DB.
- [ ] Verify HTTP logs capture request/response details for key endpoints.
- [ ] Basic perf sanity: call a few endpoints under minor load (e.g. `ab`, `wrk`, or simple loop).

---

> After Sprint 10, we can define further sprints for:
> - Shop & payments
> - UI polish and UX improvements
> - Performance tuning & caching
> - More advanced analytics and dashboards
> - Extra AOT/trim experiments or deployment targets (Docker, Azure, etc.)

