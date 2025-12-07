using FaziCricketClub.Application.Dtos;
using FluentValidation;

namespace FaziCricketClub.Application.Validation.Members
{
    /// <summary>
    /// Validates input when updating a member.
    /// Reuses the create rules.
    /// </summary>
    public class UpdateMemberDtoValidator : AbstractValidator<UpdateMemberDto>
    {
        public UpdateMemberDtoValidator()
        {
            Include(new CreateMemberDtoValidator());
        }
    }
}
