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
    public class SeasonServiceTests
    {
        private readonly Mock<ISeasonRepository> _seasonRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;
        private readonly SeasonService _sut; // System Under Test

        public SeasonServiceTests()
        {
            _seasonRepositoryMock = new Mock<ISeasonRepository>(MockBehavior.Strict);
            _unitOfWorkMock = new Mock<IUnitOfWork>(MockBehavior.Strict);

            // Configure AutoMapper with our real profile
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<CricketClubMappingProfile>();
            });

            _mapper = config.CreateMapper();

            _sut = new SeasonService(
                _seasonRepositoryMock.Object,
                _unitOfWorkMock.Object,
                _mapper);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedDtosOrderedByStartDate()
        {
            // Arrange
            var seasons = new List<Season>
            {
                new Season
                {
                    Id = 2,
                    Name = "2025 Winter",
                    StartDate = new DateTime(2025, 10, 1),
                    EndDate = new DateTime(2026, 3, 31),
                    Description = "Indoor nets"
                },
                new Season
                {
                    Id = 1,
                    Name = "2025 Summer",
                    StartDate = new DateTime(2025, 04, 1),
                    EndDate = new DateTime(2025, 09, 30),
                    Description = "Outdoor season"
                }
            };

            _seasonRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(seasons);

            // UnitOfWork is not used in this method, so no setup required.

            // Act
            var result = await _sut.GetAllAsync();

            // Assert
            result.Should().HaveCount(2);

            // Ensure mapping and ordering by StartDate
            result[0].Id.Should().Be(1);
            result[0].Name.Should().Be("2025 Summer");
            result[0].Description.Should().Be("Outdoor season");

            result[1].Id.Should().Be(2);
            result[1].Name.Should().Be("2025 Winter");

            _seasonRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _seasonRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task CreateAsync_ShouldAddSeasonAndSaveChanges()
        {
            // Arrange
            var createDto = new CreateSeasonDto
            {
                Name = "2026 Summer",
                Description = "Another great season",
                StartDate = new DateTime(2026, 4, 1),
                EndDate = new DateTime(2026, 9, 30)
            };

            // Capture the season entity passed to the repository.
            Season? addedSeason = null;

            _seasonRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Season>(), It.IsAny<CancellationToken>()))
                .Callback<Season, CancellationToken>((s, _) => addedSeason = s)
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.CreateAsync(createDto);

            // Assert
            // Check that we mapped DTO -> entity correctly.
            addedSeason.Should().NotBeNull();
            addedSeason!.Name.Should().Be(createDto.Name);
            addedSeason.Description.Should().Be(createDto.Description);
            addedSeason.StartDate.Should().Be(createDto.StartDate);
            addedSeason.EndDate.Should().Be(createDto.EndDate);

            // Check that the returned DTO matches.
            result.Name.Should().Be(createDto.Name);
            result.Description.Should().Be(createDto.Description);
            result.StartDate.Should().Be(createDto.StartDate);
            result.EndDate.Should().Be(createDto.EndDate);

            _seasonRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Season>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _seasonRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenSeasonDoesNotExist()
        {
            // Arrange
            _seasonRepositoryMock
                .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Season?)null);

            // Act
            var result = await _sut.DeleteAsync(123);

            // Assert
            result.Should().BeFalse();

            _seasonRepositoryMock.Verify(r => r.GetByIdAsync(123, It.IsAny<CancellationToken>()), Times.Once);
            _seasonRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteAsync_ShouldSoftDeleteSeasonAndSaveChanges_WhenSeasonExists()
        {
            // Arrange
            var season = new Season
            {
                Id = 123,
                Name = "To be deleted",
                StartDate = new DateTime(2025, 4, 1),
                EndDate = new DateTime(2025, 9, 30),
                IsDeleted = false
            };

            _seasonRepositoryMock
                .Setup(r => r.GetByIdAsync(season.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(season);

            _seasonRepositoryMock
                .Setup(r => r.Remove(It.IsAny<Season>()))
                .Callback<Season>(s => s.IsDeleted = true);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await _sut.DeleteAsync(season.Id);

            // Assert
            result.Should().BeTrue();
            season.IsDeleted.Should().BeTrue();

            _seasonRepositoryMock.Verify(r => r.GetByIdAsync(season.Id, It.IsAny<CancellationToken>()), Times.Once);
            _seasonRepositoryMock.Verify(r => r.Remove(season), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            _seasonRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }
    }
}
