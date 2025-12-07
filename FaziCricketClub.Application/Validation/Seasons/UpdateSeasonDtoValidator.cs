using FaziCricketClub.Application.Dtos;
using FluentValidation;

namespace FaziCricketClub.Application.Validation.Seasons
{
    /// <summary>
    /// Validates the rules for updating a season.
    /// For now, it reuses the same rules as creation.
    /// </summary>
    public class UpdateSeasonDtoValidator : AbstractValidator<UpdateSeasonDto>
    {
        public UpdateSeasonDtoValidator()
        {
            Include(new CreateSeasonDtoValidator());
        }
    }
}
