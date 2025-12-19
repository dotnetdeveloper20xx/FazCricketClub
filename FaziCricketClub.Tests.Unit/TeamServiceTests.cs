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
    /// Unit tests for <see cref="TeamService"/>.
    /// Verifies that the service correctly orchestrates repository and unit of work
    /// and maps entities to DTOs.
    /// </summary>
    public class TeamServiceTests
    {
        private readonly Mock<ITeamRepository> _teamRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;
        private readonly TeamService _sut; // System Under Test

        public TeamServiceTests()
        {
            _teamRepositoryMock = new Mock<ITeamRepository>(MockBehavior.Strict);
            _unitOfWorkMock = new Mock<IUnitOfWork>(MockBehavior.Strict);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<CricketClubMappingProfile>();
            });

            _mapper = config.CreateMapper();

            _sut = new TeamService(
                _teamRepositoryMock.Object,
                _unitOfWorkMock.Object,
                _mapper);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedDtosOrderedByName()
        {
            // Arrange
            var teams = new List<Team>
            {
                new Team
                {
                    Id = 2,
                    Name = "Z-Team",
                    Description = "Second team",
                    IsActive = true
                },
                new Team
                {
                    Id = 1,
                    Name = "A-Team",
                    Description = "First team",
                    IsActive = false
                }
            };

            _teamRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(teams);

            // Act
            var result = await _sut.GetAllAsync();

            // Assert
            result.Should().HaveCount(2);

            // Should be ordered by Name ascending: A-Team, then Z-Team.
            result[0].Id.Should().Be(1);
            result[0].Name.Should().Be("A-Team");
            result[0].Description.Should().Be("First team");
            result[0].IsActive.Should().BeFalse();

            result[1].Id.Should().Be(2);
            result[1].Name.Should().Be("Z-Team");
            result[1].IsActive.Should().BeTrue();

            _teamRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenTeamDoesNotExist()
        {
            // Arrange
            _teamRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Team?)null);

            // Act
            var result = await _sut.GetByIdAsync(42);

            // Assert
            result.Should().BeNull();

            _teamRepositoryMock.Verify(r => r.GetByIdAsync(42, It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnMappedDto_WhenTeamExists()
        {
            // Arrange
            var team = new Team
            {
                Id = 10,
                Name = "Development XI",
                Description = "Training side",
                IsActive = true
            };

            _teamRepositoryMock
                .Setup(r => r.GetByIdAsync(team.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(team);

            // Act
            var result = await _sut.GetByIdAsync(team.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(team.Id);
            result.Name.Should().Be(team.Name);
            result.Description.Should().Be(team.Description);
            result.IsActive.Should().Be(team.IsActive);

            _teamRepositoryMock.Verify(r => r.GetByIdAsync(team.Id, It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task CreateAsync_ShouldAddTeamAndSaveChanges()
        {
            // Arrange
            var createDto = new CreateTeamDto
            {
                Name = "New Team",
                Description = "Brand new team",
                IsActive = true
            };

            Team? addedTeam = null;

            _teamRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Team>(), It.IsAny<CancellationToken>()))
                .Callback<Team, CancellationToken>((t, _) => addedTeam = t)
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.CreateAsync(createDto);

            // Assert
            addedTeam.Should().NotBeNull();
            addedTeam!.Name.Should().Be(createDto.Name);
            addedTeam.Description.Should().Be(createDto.Description);
            addedTeam.IsActive.Should().Be(createDto.IsActive);

            result.Name.Should().Be(createDto.Name);
            result.Description.Should().Be(createDto.Description);
            result.IsActive.Should().Be(createDto.IsActive);

            _teamRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Team>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenTeamDoesNotExist()
        {
            // Arrange
            _teamRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Team?)null);

            var updateDto = new UpdateTeamDto
            {
                Name = "Updated Name",
                Description = "Updated Description",
                IsActive = false
            };

            // Act
            var result = await _sut.UpdateAsync(999, updateDto);

            // Assert
            result.Should().BeFalse();

            _teamRepositoryMock.Verify(r => r.GetByIdAsync(999, It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateTeamAndSaveChanges_WhenTeamExists()
        {
            // Arrange
            var team = new Team
            {
                Id = 5,
                Name = "Old Name",
                Description = "Old Description",
                IsActive = true
            };

            _teamRepositoryMock
                .Setup(r => r.GetByIdAsync(team.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(team);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var updateDto = new UpdateTeamDto
            {
                Name = "New Name",
                Description = "New Description",
                IsActive = false
            };

            // Act
            var result = await _sut.UpdateAsync(team.Id, updateDto);

            // Assert
            result.Should().BeTrue();

            team.Name.Should().Be(updateDto.Name);
            team.Description.Should().Be(updateDto.Description);
            team.IsActive.Should().Be(updateDto.IsActive);

            _teamRepositoryMock.Verify(r => r.GetByIdAsync(team.Id, It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenTeamDoesNotExist()
        {
            // Arrange
            _teamRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Team?)null);

            // Act
            var result = await _sut.DeleteAsync(123);

            // Assert
            result.Should().BeFalse();

            _teamRepositoryMock.Verify(r => r.GetByIdAsync(123, It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldSoftDeleteTeamAndSaveChanges_WhenTeamExists()
        {
            // Arrange
            var team = new Team
            {
                Id = 123,
                Name = "To be deleted",
                Description = "Temporary team",
                IsActive = true,
                IsDeleted = false
            };

            _teamRepositoryMock
                .Setup(r => r.GetByIdAsync(team.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(team);

            _teamRepositoryMock
                .Setup(r => r.Remove(It.IsAny<Team>()))
                .Callback<Team>(t => t.IsDeleted = true);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.DeleteAsync(team.Id);

            // Assert
            result.Should().BeTrue();
            team.IsDeleted.Should().BeTrue();

            _teamRepositoryMock.Verify(r => r.GetByIdAsync(team.Id, It.IsAny<CancellationToken>()), Times.Once);
            _teamRepositoryMock.Verify(r => r.Remove(team), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _teamRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }
    }
}
