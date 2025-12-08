using AutoMapper;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="IMemberService"/>.
    /// Coordinates repositories, unit of work, and mappings.
    /// </summary>
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MemberService(
            IMemberRepository memberRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _memberRepository = memberRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<MemberDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var members = await _memberRepository.GetAllAsync(cancellationToken);

            // Order first, then map.
            var ordered = members.OrderBy(m => m.FullName).ToList();

            return _mapper.Map<List<MemberDto>>(ordered);
        }

        public async Task<MemberDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var member = await _memberRepository.GetByIdAsync(id, cancellationToken);

            if (member == null)
            {
                return null;
            }

            return _mapper.Map<MemberDto>(member);
        }

        public async Task<MemberDto> CreateAsync(CreateMemberDto request, CancellationToken cancellationToken = default)
        {
            var member = _mapper.Map<Member>(request);

            await _memberRepository.AddAsync(member, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<MemberDto>(member);
        }

        public async Task<bool> UpdateAsync(int id, UpdateMemberDto request, CancellationToken cancellationToken = default)
        {
            var member = await _memberRepository.GetByIdAsync(id, cancellationToken);

            if (member == null)
            {
                return false;
            }

            // Map request → existing entity
            _mapper.Map(request, member);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var member = await _memberRepository.GetByIdAsync(id, cancellationToken);

            if (member == null)
            {
                return false;
            }

            _memberRepository.Remove(member);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
