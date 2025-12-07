using FaziCricketClub.Application.Dtos;
using FluentValidation;

namespace FaziCricketClub.Application.Validation.Teams
{
    /// <summary>
    /// Validates input when updating a team.
    /// Reuses the create rules.
    /// </summary>
    public class UpdateTeamDtoValidator : AbstractValidator<UpdateTeamDto>
    {
        public UpdateTeamDtoValidator()
        {
            Include(new CreateTeamDtoValidator());
        }
    }
}
