using FaziCricketClub.Application.Dtos;
using FluentValidation;

namespace FaziCricketClub.Application.Validation.Fixtures
{
    /// <summary>
    /// Validates input when creating a fixture.
    /// </summary>
    public class CreateFixtureDtoValidator : AbstractValidator<CreateFixtureDto>
    {
        public CreateFixtureDtoValidator()
        {
            RuleFor(x => x.SeasonId)
                .GreaterThan(0).WithMessage("SeasonId must be a positive value.");

            RuleFor(x => x.HomeTeamId)
                .GreaterThan(0).WithMessage("HomeTeamId must be a positive value.");

            RuleFor(x => x.AwayTeamId)
                .GreaterThan(0).WithMessage("AwayTeamId must be a positive value.");

            RuleFor(x => x)
                .Must(x => x.HomeTeamId != x.AwayTeamId)
                .WithMessage("Home and away team cannot be the same.");

            RuleFor(x => x.StartDateTime)
                .NotEqual(default(DateTime)).WithMessage("StartDateTime is required.");

            RuleFor(x => x.Venue)
                .NotEmpty().WithMessage("Venue is required.")
                .MaximumLength(200).WithMessage("Venue cannot exceed 200 characters.");

            RuleFor(x => x.CompetitionName)
                .NotEmpty().WithMessage("Competition name is required.")
                .MaximumLength(100).WithMessage("Competition name cannot exceed 100 characters.");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required.")
                .MaximumLength(50).WithMessage("Status cannot exceed 50 characters.");
        }
    }
}
