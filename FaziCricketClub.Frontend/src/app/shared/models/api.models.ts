// =====================================================
// API Response Models
// =====================================================

// Note: ApiResponse<T> is defined in auth.models.ts

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
}

// =====================================================
// Member Models
// =====================================================

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  joinedOn: string;
  isActive: boolean;
  notes?: string;
}

export interface CreateMemberRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  notes?: string;
}

export interface UpdateMemberRequest extends CreateMemberRequest {
  isActive: boolean;
}

// =====================================================
// Team Models
// =====================================================

export interface Team {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface UpdateTeamRequest extends CreateTeamRequest {
  isActive: boolean;
}

// =====================================================
// Season Models
// =====================================================

export interface Season {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface CreateSeasonRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSeasonRequest extends CreateSeasonRequest {}

// =====================================================
// Fixture Models
// =====================================================

export type FixtureStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Postponed';

export interface Fixture {
  id: string;
  seasonId: string;
  seasonName?: string;
  homeTeamId: string;
  homeTeamName?: string;
  awayTeamId: string;
  awayTeamName?: string;
  startDateTime: string;
  venue: string;
  competitionName?: string;
  status: FixtureStatus;
  matchResult?: MatchResult;
}

export interface CreateFixtureRequest {
  seasonId: string;
  homeTeamId: string;
  awayTeamId: string;
  startDateTime: string;
  venue: string;
  competitionName?: string;
}

export interface UpdateFixtureRequest extends CreateFixtureRequest {
  status: FixtureStatus;
}

export interface MatchResult {
  fixtureId: string;
  homeTeamRuns: number;
  homeTeamWickets: number;
  homeTeamOvers: number;
  awayTeamRuns: number;
  awayTeamWickets: number;
  awayTeamOvers: number;
  resultSummary?: string;
  winningTeamId?: string;
  playerOfTheMatchMemberId?: string;
  notes?: string;
}

// =====================================================
// Stats Models
// =====================================================

export interface ClubStats {
  totalMembers: number;
  activeMembers: number;
  totalTeams: number;
  totalFixtures: number;
  completedFixtures: number;
  upcomingFixtures: number;
  totalSeasons: number;
}

export interface BattingStats {
  memberId: string;
  memberName: string;
  matches: number;
  innings: number;
  runs: number;
  notOuts: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
}

export interface BowlingStats {
  memberId: string;
  memberName: string;
  matches: number;
  innings: number;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  average: number;
  economy: number;
  strikeRate: number;
  bestFigures: string;
  fiveWickets: number;
}

export interface LeaderboardEntry {
  rank: number;
  memberId: string;
  memberName: string;
  value: number;
  secondaryValue?: number;
}

export interface FixtureActivity {
  period: string;
  count: number;
}

export interface MemberActivity {
  period: string;
  count: number;
}
