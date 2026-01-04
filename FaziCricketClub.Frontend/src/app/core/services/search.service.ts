import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MembersService } from './members.service';
import { TeamsService } from './teams.service';
import { FixturesService } from './fixtures.service';
import { Member, Team, Fixture } from '../../shared/models';

export interface SearchResult {
  type: 'member' | 'team' | 'match';
  id: string | number;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private membersService = inject(MembersService);
  private teamsService = inject(TeamsService);
  private fixturesService = inject(FixturesService);

  /**
   * Search across members, teams, and matches
   */
  search(query: string): Observable<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    const searchTerm = query.toLowerCase().trim();

    return forkJoin({
      members: this.membersService.getAllMembers().pipe(catchError(() => of([] as Member[]))),
      teams: this.teamsService.getTeams().pipe(catchError(() => of([] as Team[]))),
      fixtures: this.fixturesService.getAllFixtures().pipe(catchError(() => of([] as Fixture[])))
    }).pipe(
      map(results => {
        const searchResults: SearchResult[] = [];

        // Search members
        const memberResults = (results.members || [])
          .filter((m: Member) =>
            m.fullName.toLowerCase().includes(searchTerm) ||
            m.email?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 5)
          .map((m: Member) => ({
            type: 'member' as const,
            id: m.id,
            title: m.fullName,
            subtitle: m.email || 'Member',
            icon: 'person',
            route: `/members/${m.id}`
          }));

        // Search teams
        const teamResults = (results.teams || [])
          .filter((t: Team) =>
            t.name.toLowerCase().includes(searchTerm) ||
            t.description?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 5)
          .map((t: Team) => ({
            type: 'team' as const,
            id: t.id,
            title: t.name,
            subtitle: t.isActive ? 'Active Team' : 'Inactive Team',
            icon: 'groups',
            route: `/teams/${t.id}`
          }));

        // Search fixtures
        const fixtureResults = (results.fixtures || [])
          .filter((f: Fixture) =>
            f.homeTeamName?.toLowerCase().includes(searchTerm) ||
            f.awayTeamName?.toLowerCase().includes(searchTerm) ||
            f.venue?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 5)
          .map((f: Fixture) => ({
            type: 'match' as const,
            id: f.id,
            title: `${f.homeTeamName || 'TBD'} vs ${f.awayTeamName || 'TBD'}`,
            subtitle: f.venue || 'Match',
            icon: 'sports_cricket',
            route: '/matches'
          }));

        return [...memberResults, ...teamResults, ...fixtureResults];
      })
    );
  }
}
