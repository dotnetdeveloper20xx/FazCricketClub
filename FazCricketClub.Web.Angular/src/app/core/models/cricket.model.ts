// Cricket domain models matching your DTOs

export interface Season {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Member {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  isActive: boolean;
  notes?: string;
}

export interface Fixture {
  id: number;
  seasonId: number;
  homeTeamId: number;
  awayTeamId: number;
  startDateTime: Date;
  venue: string;
  competitionName: string;
  status: string;
}

export interface MatchResult {
  fixtureId: number;
  homeTeamRuns: number;
  homeTeamWickets: number;
  homeTeamOvers: number;
  awayTeamRuns: number;
  awayTeamWickets: number;
  awayTeamOvers: number;
  winningTeamId?: number;
  playerOfMatchId?: number;
  matchSummary?: string;
}

export interface PlayerBattingStats {
  memberId: number;
  memberName: string;
  innings: number;
  notOuts: number;
  totalRuns: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  totalFours: number;
  totalSixes: number;
  centuries: number;
  halfCenturies: number;
}

export interface PlayerBowlingStats {
  memberId: number;
  memberName: string;
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
