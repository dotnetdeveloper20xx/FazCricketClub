using FaziCricketClub.API.Models;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// Manages members in the CricketClub system.
    /// Thin controller delegating to the application layer.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MembersController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        /// <summary>
        /// Returns a paged, filterable, sortable list of members.
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "CanViewPlayers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<PagedResult<MemberDto>>>> GetPagedAsync(
            [FromQuery] MemberFilterParameters filter,
            CancellationToken cancellationToken)
        {
            if (filter.Page <= 0)
            {
                filter.Page = 1;
            }

            if (filter.PageSize <= 0)
            {
                filter.PageSize = 20;
            }

            var pagedResult = await _memberService.GetPagedAsync(filter, cancellationToken);

            var response = ApiResponse<PagedResult<MemberDto>>.Ok(
                pagedResult,
                "Members retrieved successfully.");

            return Ok(response);
        }

        /// <summary>
        /// Gets all members.
        /// </summary>
        [HttpGet("all")]
        [Authorize(Policy = "CanViewPlayers")]
        public async Task<ActionResult<ApiResponse<IEnumerable<MemberDto>>>> GetAllAsync(
            CancellationToken cancellationToken)
        {
            var members = await _memberService.GetAllAsync(cancellationToken);
            var response = ApiResponse<IEnumerable<MemberDto>>.Ok(members);

            return Ok(response);
        }

        /// <summary>
        /// Gets a single member by its identifier.
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Policy = "CanViewPlayers")]
        public async Task<ActionResult<ApiResponse<MemberDto>>> GetByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var member = await _memberService.GetByIdAsync(id, cancellationToken);

            if (member == null)
            {
                return NotFound(Problem(
                    detail: $"Member with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Member not found"));
            }

            var response = ApiResponse<MemberDto>.Ok(member);
            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "CanEditPlayers")]
        public async Task<ActionResult<ApiResponse<MemberDto>>> CreateAsync(
            [FromBody] CreateMemberDto request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var created = await _memberService.CreateAsync(request, cancellationToken);
            var response = ApiResponse<MemberDto>.Ok(created, "Member created successfully.");

            return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, response);
        }

        [HttpPut("{id:int}")]
        [Authorize(Policy = "CanEditPlayers")]
        public async Task<IActionResult> UpdateAsync(
            int id,
            [FromBody] UpdateMemberDto request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var updated = await _memberService.UpdateAsync(id, request, cancellationToken);

            if (!updated)
            {
                return NotFound(Problem(
                    detail: $"Member with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Member not found"));
            }

            return NoContent();
        }


        /// <summary>
        /// Deletes an existing member (soft delete).
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "CanEditPlayers")]
        public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var deleted = await _memberService.DeleteAsync(id, cancellationToken);

            if (!deleted)
            {
                return NotFound(Problem(
                    detail: $"Member with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Member not found"));
            }

            return NoContent();
        }
    }
}
