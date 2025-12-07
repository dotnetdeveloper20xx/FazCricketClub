using FaziCricketClub.Application.Dtos;
using FluentValidation;

namespace FaziCricketClub.Application.Validation.Seasons
{
    /// <summary>
    /// Validates the rules for creating a season.
    /// </summary>
    public class CreateSeasonDtoValidator : AbstractValidator<CreateSeasonDto>
    {
        public CreateSeasonDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Season name is required.")
                .MaximumLength(100).WithMessage("Season name cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required.");

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("End date is required.")
                .GreaterThan(x => x.StartDate)
                .WithMessage("End date must be after start date.");
        }
    }
}
