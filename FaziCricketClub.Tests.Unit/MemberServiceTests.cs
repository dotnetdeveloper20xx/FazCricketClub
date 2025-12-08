using AutoMapper;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Application.Mapping;
using FaziCricketClub.Application.Services;
using FaziCricketClub.Domain.Entities;
using FluentAssertions;
using Moq;

namespace FaziCricketClub.Tests.Unit
{
    /// <summary>
    /// Unit tests for <see cref="MemberService"/>.
    /// Verifies that the service correctly orchestrates repository and unit of work
    /// and maps entities to DTOs.
    /// </summary>
    public class MemberServiceTests
    {
        private readonly Mock<IMemberRepository> _memberRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;
        private readonly MemberService _sut; // System Under Test

        public MemberServiceTests()
        {
            _memberRepositoryMock = new Mock<IMemberRepository>(MockBehavior.Strict);
            _unitOfWorkMock = new Mock<IUnitOfWork>(MockBehavior.Strict);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<CricketClubMappingProfile>();
            }, null);

            _mapper = config.CreateMapper();

            _sut = new MemberService(
                _memberRepositoryMock.Object,
                _unitOfWorkMock.Object,
                _mapper);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedDtosOrderedByFullName()
        {
            // Arrange
            var members = new List<Member>
            {
                new Member
                {
                    Id = 2,
                    FullName = "Zara Player",
                    Email = "zara@example.com",
                    IsActive = true,
                    Notes = "Bowler"
                },
                new Member
                {
                    Id = 1,
                    FullName = "Adam Captain",
                    Email = "adam@example.com",
                    IsActive = false,
                    Notes = "Captain"
                }
            };

            _memberRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(members);

            // Act
            var result = await _sut.GetAllAsync();

            // Assert
            result.Should().HaveCount(2);

            // Ordered by FullName ascending: Adam, then Zara.
            result[0].Id.Should().Be(1);
            result[0].FullName.Should().Be("Adam Captain");
            result[0].Email.Should().Be("adam@example.com");
            result[0].IsActive.Should().BeFalse();
            result[0].Notes.Should().Be("Captain");

            result[1].Id.Should().Be(2);
            result[1].FullName.Should().Be("Zara Player");
            result[1].Email.Should().Be("zara@example.com");
            result[1].IsActive.Should().BeTrue();
            result[1].Notes.Should().Be("Bowler");

            _memberRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenMemberDoesNotExist()
        {
            // Arrange
            _memberRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Member?)null);

            // Act
            var result = await _sut.GetByIdAsync(42);

            // Assert
            result.Should().BeNull();

            _memberRepositoryMock.Verify(r => r.GetByIdAsync(42, It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnMappedDto_WhenMemberExists()
        {
            // Arrange
            var member = new Member
            {
                Id = 10,
                FullName = "Test Player",
                Email = "test@example.com",
                PhoneNumber = "12345",
                DateOfBirth = new DateTime(1990, 1, 1),
                IsActive = true,
                Notes = "All-rounder"
            };

            _memberRepositoryMock
                .Setup(r => r.GetByIdAsync(member.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            // Act
            var result = await _sut.GetByIdAsync(member.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(member.Id);
            result.FullName.Should().Be(member.FullName);
            result.Email.Should().Be(member.Email);
            result.PhoneNumber.Should().Be(member.PhoneNumber);
            result.DateOfBirth.Should().Be(member.DateOfBirth);
            result.IsActive.Should().Be(member.IsActive);
            result.Notes.Should().Be(member.Notes);

            _memberRepositoryMock.Verify(r => r.GetByIdAsync(member.Id, It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task CreateAsync_ShouldAddMemberAndSaveChanges()
        {
            // Arrange
            var createDto = new CreateMemberDto
            {
                FullName = "New Member",
                Email = "new@example.com",
                PhoneNumber = "555-000",
                DateOfBirth = new DateTime(2000, 5, 10),
                IsActive = true,
                Notes = "New recruit"
            };

            Member? addedMember = null;

            _memberRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Member>(), It.IsAny<CancellationToken>()))
                .Callback<Member, CancellationToken>((m, _) => addedMember = m)
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.CreateAsync(createDto);

            // Assert
            addedMember.Should().NotBeNull();
            addedMember!.FullName.Should().Be(createDto.FullName);
            addedMember.Email.Should().Be(createDto.Email);
            addedMember.PhoneNumber.Should().Be(createDto.PhoneNumber);
            addedMember.DateOfBirth.Should().Be(createDto.DateOfBirth);
            addedMember.IsActive.Should().Be(createDto.IsActive);
            addedMember.Notes.Should().Be(createDto.Notes);

            result.FullName.Should().Be(createDto.FullName);
            result.Email.Should().Be(createDto.Email);
            result.PhoneNumber.Should().Be(createDto.PhoneNumber);
            result.DateOfBirth.Should().Be(createDto.DateOfBirth);
            result.IsActive.Should().Be(createDto.IsActive);
            result.Notes.Should().Be(createDto.Notes);

            _memberRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Member>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenMemberDoesNotExist()
        {
            // Arrange
            _memberRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Member?)null);

            var updateDto = new UpdateMemberDto
            {
                FullName = "Updated Name",
                Email = "updated@example.com",
                PhoneNumber = "999-999",
                DateOfBirth = new DateTime(1995, 3, 3),
                IsActive = false,
                Notes = "Updated notes"
            };

            // Act
            var result = await _sut.UpdateAsync(999, updateDto);

            // Assert
            result.Should().BeFalse();

            _memberRepositoryMock.Verify(r => r.GetByIdAsync(999, It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateMemberAndSaveChanges_WhenMemberExists()
        {
            // Arrange
            var member = new Member
            {
                Id = 5,
                FullName = "Old Name",
                Email = "old@example.com",
                PhoneNumber = "111-111",
                DateOfBirth = new DateTime(1990, 1, 1),
                IsActive = true,
                Notes = "Old notes"
            };

            _memberRepositoryMock
                .Setup(r => r.GetByIdAsync(member.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var updateDto = new UpdateMemberDto
            {
                FullName = "New Name",
                Email = "new@example.com",
                PhoneNumber = "222-222",
                DateOfBirth = new DateTime(1992, 2, 2),
                IsActive = false,
                Notes = "New notes"
            };

            // Act
            var result = await _sut.UpdateAsync(member.Id, updateDto);

            // Assert
            result.Should().BeTrue();

            member.FullName.Should().Be(updateDto.FullName);
            member.Email.Should().Be(updateDto.Email);
            member.PhoneNumber.Should().Be(updateDto.PhoneNumber);
            member.DateOfBirth.Should().Be(updateDto.DateOfBirth);
            member.IsActive.Should().Be(updateDto.IsActive);
            member.Notes.Should().Be(updateDto.Notes);

            _memberRepositoryMock.Verify(r => r.GetByIdAsync(member.Id, It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenMemberDoesNotExist()
        {
            // Arrange
            _memberRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Member?)null);

            // Act
            var result = await _sut.DeleteAsync(123);

            // Assert
            result.Should().BeFalse();

            _memberRepositoryMock.Verify(r => r.GetByIdAsync(123, It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldSoftDeleteMemberAndSaveChanges_WhenMemberExists()
        {
            // Arrange
            var member = new Member
            {
                Id = 123,
                FullName = "To be deleted",
                Email = "delete@example.com",
                IsActive = true,
                IsDeleted = false
            };

            _memberRepositoryMock
                .Setup(r => r.GetByIdAsync(member.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            _memberRepositoryMock
                .Setup(r => r.Remove(It.IsAny<Member>()))
                .Callback<Member>(m => m.IsDeleted = true);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.DeleteAsync(member.Id);

            // Assert
            result.Should().BeTrue();
            member.IsDeleted.Should().BeTrue();

            _memberRepositoryMock.Verify(r => r.GetByIdAsync(member.Id, It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.Verify(r => r.Remove(member), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetPagedAsync_ShouldFilterSearchSortAndPageMembers()
        {
            // ARRANGE
            var members = new List<Member>
    {
        new Member
        {
            Id = 1,
            FullName = "Adam Batter",
            Email = "adam@example.com",
            IsActive = true
        },
        new Member
        {
            Id = 2,
            FullName = "Zara Bowler",
            Email = "zara@example.com",
            IsActive = false
        },
        new Member
        {
            Id = 3,
            FullName = "Emily Keeper",
            Email = "emily@example.com",
            IsActive = true
        }
    };

            _memberRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(members);

            var filter = new MemberFilterParameters
            {
                IsActive = true,
                Search = "a",          // matches Adam + Emily (both contain 'a')
                SortBy = "name",
                SortDirection = "asc",
                Page = 1,
                PageSize = 10
            };

            // ACT
            var result = await _sut.GetPagedAsync(filter);

            // ASSERT
            result.TotalCount.Should().Be(2);
            result.Items.Should().HaveCount(2);

            // Sorted by FullName ascending: Adam, then Emily
            result.Items[0].FullName.Should().Be("Adam Batter");
            result.Items[1].FullName.Should().Be("Emily Keeper");

            _memberRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _memberRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

    }
}
