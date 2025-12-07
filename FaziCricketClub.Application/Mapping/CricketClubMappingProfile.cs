using AutoMapper;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Mapping
{
    /// <summary>
    /// Central place for mapping rules between domain entities and DTOs.
    /// </summary>
    public class CricketClubMappingProfile : Profile
    {
        public CricketClubMappingProfile()
        {
            // Season
            CreateMap<Season, SeasonDto>();
            CreateMap<CreateSeasonDto, Season>();
            CreateMap<UpdateSeasonDto, Season>();

            // Team
            CreateMap<Team, TeamDto>();
            CreateMap<CreateTeamDto, Team>();
            CreateMap<UpdateTeamDto, Team>();

            // Member
            CreateMap<Member, MemberDto>();
            CreateMap<CreateMemberDto, Member>();
            CreateMap<UpdateMemberDto, Member>();

            // Fixture
            CreateMap<Fixture, FixtureDto>();
            CreateMap<CreateFixtureDto, Fixture>();
            CreateMap<UpdateFixtureDto, Fixture>();
        }
    }
}
