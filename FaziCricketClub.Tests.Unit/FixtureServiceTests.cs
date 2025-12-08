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
    public class FixtureServiceTests
    {
        private readonly Mock<IFixtureRepository> _fixtureRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;
        private readonly FixtureService _sut; // System Under Test

        public FixtureServiceTests()
        {
            _fixtureRepositoryMock = new Mock<IFixtureRepository>(MockBehavior.Strict);
            _unitOfWorkMock = new Mock<IUnitOfWork>(MockBehavior.Strict);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<CricketClubMappingProfile>();
            }, null);

            _mapper = config.CreateMapper();

            _sut = new FixtureService(
                _fixtureRepositoryMock.Object,
                _unitOfWorkMock.Object,
                _mapper);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedDtosOrderedByStartDateTime()
        {
            // Arrange
            var fixtures = new List<Fixture>
            {
                new Fixture
                {
                    Id = 2,
                    SeasonId = 1,
                    HomeTeamId = 10,
                    AwayTeamId = 20,
                    StartDateTime = new DateTime(2025, 6, 10, 14, 0, 0),
                    Venue = "Ground B",
                    CompetitionName = "League",
                    Status = "Scheduled"
                },
                new Fixture
                {
                    Id = 1,
                    SeasonId = 1,
                    HomeTeamId = 10,
                    AwayTeamId = 30,
                    StartDateTime = new DateTime(2025, 5, 20, 11, 0, 0),
                    Venue = "Ground A",
                    CompetitionName = "Cup",
                    Status = "Scheduled"
                }
            };

            _fixtureRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixtures);

            // Act
            var result = await _sut.GetAllAsync();

            // Assert
            result.Should().HaveCount(2);

            // Ordered by StartDateTime ascending: id 1 first, then id 2.
            result[0].Id.Should().Be(1);
            result[0].Venue.Should().Be("Ground A");
            result[0].CompetitionName.Should().Be("Cup");
            result[0].StartDateTime.Should().Be(new DateTime(2025, 5, 20, 11, 0, 0));

            result[1].Id.Should().Be(2);
            result[1].Venue.Should().Be("Ground B");
            result[1].CompetitionName.Should().Be("League");
            result[1].StartDateTime.Should().Be(new DateTime(2025, 6, 10, 14, 0, 0));

            _fixtureRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenFixtureDoesNotExist()
        {
            // Arrange
            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Fixture?)null);

            // Act
            var result = await _sut.GetByIdAsync(42);

            // Assert
            result.Should().BeNull();

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(42, It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnMappedDto_WhenFixtureExists()
        {
            // Arrange
            var fixture = new Fixture
            {
                Id = 10,
                SeasonId = 2,
                HomeTeamId = 100,
                AwayTeamId = 200,
                StartDateTime = new DateTime(2025, 7, 15, 13, 30, 0),
                Venue = "Main Ground",
                CompetitionName = "Friendly",
                Status = "Completed"
            };

            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(fixture.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixture);

            // Act
            var result = await _sut.GetByIdAsync(fixture.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(fixture.Id);
            result.SeasonId.Should().Be(fixture.SeasonId);
            result.HomeTeamId.Should().Be(fixture.HomeTeamId);
            result.AwayTeamId.Should().Be(fixture.AwayTeamId);
            result.StartDateTime.Should().Be(fixture.StartDateTime);
            result.Venue.Should().Be(fixture.Venue);
            result.CompetitionName.Should().Be(fixture.CompetitionName);
            result.Status.Should().Be(fixture.Status);

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(fixture.Id, It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task CreateAsync_ShouldAddFixtureAndSaveChanges()
        {
            // Arrange
            var createDto = new CreateFixtureDto
            {
                SeasonId = 1,
                HomeTeamId = 10,
                AwayTeamId = 20,
                StartDateTime = new DateTime(2025, 6, 1, 10, 0, 0),
                Venue = "Test Ground",
                CompetitionName = "League",
                Status = "Scheduled"
            };

            Fixture? addedFixture = null;

            _fixtureRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Fixture>(), It.IsAny<CancellationToken>()))
                .Callback<Fixture, CancellationToken>((f, _) => addedFixture = f)
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.CreateAsync(createDto);

            // Assert
            addedFixture.Should().NotBeNull();
            addedFixture!.SeasonId.Should().Be(createDto.SeasonId);
            addedFixture.HomeTeamId.Should().Be(createDto.HomeTeamId);
            addedFixture.AwayTeamId.Should().Be(createDto.AwayTeamId);
            addedFixture.StartDateTime.Should().Be(createDto.StartDateTime);
            addedFixture.Venue.Should().Be(createDto.Venue);
            addedFixture.CompetitionName.Should().Be(createDto.CompetitionName);
            addedFixture.Status.Should().Be(createDto.Status);

            result.SeasonId.Should().Be(createDto.SeasonId);
            result.HomeTeamId.Should().Be(createDto.HomeTeamId);
            result.AwayTeamId.Should().Be(createDto.AwayTeamId);
            result.StartDateTime.Should().Be(createDto.StartDateTime);
            result.Venue.Should().Be(createDto.Venue);
            result.CompetitionName.Should().Be(createDto.CompetitionName);
            result.Status.Should().Be(createDto.Status);

            _fixtureRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Fixture>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenFixtureDoesNotExist()
        {
            // Arrange
            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Fixture?)null);

            var updateDto = new UpdateFixtureDto
            {
                SeasonId = 2,
                HomeTeamId = 11,
                AwayTeamId = 22,
                StartDateTime = new DateTime(2025, 8, 1, 15, 0, 0),
                Venue = "Updated Ground",
                CompetitionName = "Updated Competition",
                Status = "Rescheduled"
            };

            // Act
            var result = await _sut.UpdateAsync(999, updateDto);

            // Assert
            result.Should().BeFalse();

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(999, It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateFixtureAndSaveChanges_WhenFixtureExists()
        {
            // Arrange
            var fixture = new Fixture
            {
                Id = 5,
                SeasonId = 1,
                HomeTeamId = 10,
                AwayTeamId = 20,
                StartDateTime = new DateTime(2025, 6, 1, 10, 0, 0),
                Venue = "Old Ground",
                CompetitionName = "Old Comp",
                Status = "Scheduled"
            };

            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(fixture.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixture);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var updateDto = new UpdateFixtureDto
            {
                SeasonId = 2,
                HomeTeamId = 11,
                AwayTeamId = 21,
                StartDateTime = new DateTime(2025, 7, 1, 13, 0, 0),
                Venue = "New Ground",
                CompetitionName = "New Comp",
                Status = "Completed"
            };

            // Act
            var result = await _sut.UpdateAsync(fixture.Id, updateDto);

            // Assert
            result.Should().BeTrue();

            fixture.SeasonId.Should().Be(updateDto.SeasonId);
            fixture.HomeTeamId.Should().Be(updateDto.HomeTeamId);
            fixture.AwayTeamId.Should().Be(updateDto.AwayTeamId);
            fixture.StartDateTime.Should().Be(updateDto.StartDateTime);
            fixture.Venue.Should().Be(updateDto.Venue);
            fixture.CompetitionName.Should().Be(updateDto.CompetitionName);
            fixture.Status.Should().Be(updateDto.Status);

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(fixture.Id, It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenFixtureDoesNotExist()
        {
            // Arrange
            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Fixture?)null);

            // Act
            var result = await _sut.DeleteAsync(123);

            // Assert
            result.Should().BeFalse();

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(123, It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldSoftDeleteFixtureAndSaveChanges_WhenFixtureExists()
        {
            // Arrange
            var fixture = new Fixture
            {
                Id = 123,
                SeasonId = 1,
                HomeTeamId = 10,
                AwayTeamId = 20,
                StartDateTime = new DateTime(2025, 6, 1, 10, 0, 0),
                Venue = "Temp Ground",
                CompetitionName = "Temp Comp",
                Status = "Scheduled",
                IsDeleted = false
            };

            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(fixture.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixture);

            _fixtureRepositoryMock
                .Setup(r => r.Remove(It.IsAny<Fixture>()))
                .Callback<Fixture>(f => f.IsDeleted = true);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.DeleteAsync(fixture.Id);

            // Assert
            result.Should().BeTrue();
            fixture.IsDeleted.Should().BeTrue();

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(fixture.Id, It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.Verify(r => r.Remove(fixture), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }
    }
}
