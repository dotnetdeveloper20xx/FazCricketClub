using FaziCricketClub.Application.Dtos;
using FluentValidation;

namespace FaziCricketClub.Application.Validation.Fixtures
{
    /// <summary>
    /// Validates input when updating a fixture.
    /// Reuses the create rules.
    /// </summary>
    public class UpdateFixtureDtoValidator : AbstractValidator<UpdateFixtureDto>
    {
        public UpdateFixtureDtoValidator()
        {
            Include(new CreateFixtureDtoValidator());
        }
    }
}
