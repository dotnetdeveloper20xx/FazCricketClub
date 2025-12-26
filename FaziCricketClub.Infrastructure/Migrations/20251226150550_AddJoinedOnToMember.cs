using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FaziCricketClub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddJoinedOnToMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "JoinedOn",
                table: "Members",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "BattingScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixtureId = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    BattingOrder = table.Column<int>(type: "int", nullable: false),
                    Runs = table.Column<int>(type: "int", nullable: false),
                    Balls = table.Column<int>(type: "int", nullable: false),
                    Fours = table.Column<int>(type: "int", nullable: false),
                    Sixes = table.Column<int>(type: "int", nullable: false),
                    IsOut = table.Column<bool>(type: "bit", nullable: false),
                    DismissalType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DismissalBowlerMemberId = table.Column<int>(type: "int", nullable: true),
                    DismissalFielderMemberId = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BattingScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BattingScores_Fixtures_FixtureId",
                        column: x => x.FixtureId,
                        principalTable: "Fixtures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BattingScores_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BowlingFigures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixtureId = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    Overs = table.Column<decimal>(type: "decimal(4,1)", nullable: false),
                    Maidens = table.Column<int>(type: "int", nullable: false),
                    RunsConceded = table.Column<int>(type: "int", nullable: false),
                    Wickets = table.Column<int>(type: "int", nullable: false),
                    NoBalls = table.Column<int>(type: "int", nullable: false),
                    Wides = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BowlingFigures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BowlingFigures_Fixtures_FixtureId",
                        column: x => x.FixtureId,
                        principalTable: "Fixtures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BowlingFigures_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FixtureAvailabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixtureId = table.Column<int>(type: "int", nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixtureAvailabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixtureAvailabilities_Fixtures_FixtureId",
                        column: x => x.FixtureId,
                        principalTable: "Fixtures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FixtureAvailabilities_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FixtureSelections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixtureId = table.Column<int>(type: "int", nullable: false),
                    CaptainMemberId = table.Column<int>(type: "int", nullable: true),
                    WicketKeeperMemberId = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixtureSelections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixtureSelections_Fixtures_FixtureId",
                        column: x => x.FixtureId,
                        principalTable: "Fixtures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixtureId = table.Column<int>(type: "int", nullable: false),
                    HomeTeamRuns = table.Column<int>(type: "int", nullable: true),
                    HomeTeamWickets = table.Column<int>(type: "int", nullable: true),
                    HomeTeamOvers = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AwayTeamRuns = table.Column<int>(type: "int", nullable: true),
                    AwayTeamWickets = table.Column<int>(type: "int", nullable: true),
                    AwayTeamOvers = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ResultSummary = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    WinningTeamId = table.Column<int>(type: "int", nullable: true),
                    PlayerOfTheMatchMemberId = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchResults_Fixtures_FixtureId",
                        column: x => x.FixtureId,
                        principalTable: "Fixtures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FixtureSelectionPlayers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixtureSelectionId = table.Column<int>(type: "int", nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    BattingOrder = table.Column<int>(type: "int", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsPlaying = table.Column<bool>(type: "bit", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixtureSelectionPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixtureSelectionPlayers_FixtureSelections_FixtureSelectionId",
                        column: x => x.FixtureSelectionId,
                        principalTable: "FixtureSelections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FixtureSelectionPlayers_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BattingScores_FixtureId",
                table: "BattingScores",
                column: "FixtureId");

            migrationBuilder.CreateIndex(
                name: "IX_BattingScores_MemberId",
                table: "BattingScores",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_BowlingFigures_FixtureId",
                table: "BowlingFigures",
                column: "FixtureId");

            migrationBuilder.CreateIndex(
                name: "IX_BowlingFigures_MemberId",
                table: "BowlingFigures",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_FixtureAvailabilities_FixtureId",
                table: "FixtureAvailabilities",
                column: "FixtureId");

            migrationBuilder.CreateIndex(
                name: "IX_FixtureAvailabilities_MemberId",
                table: "FixtureAvailabilities",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_FixtureSelectionPlayers_FixtureSelectionId",
                table: "FixtureSelectionPlayers",
                column: "FixtureSelectionId");

            migrationBuilder.CreateIndex(
                name: "IX_FixtureSelectionPlayers_MemberId",
                table: "FixtureSelectionPlayers",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_FixtureSelections_FixtureId",
                table: "FixtureSelections",
                column: "FixtureId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_FixtureId",
                table: "MatchResults",
                column: "FixtureId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BattingScores");

            migrationBuilder.DropTable(
                name: "BowlingFigures");

            migrationBuilder.DropTable(
                name: "FixtureAvailabilities");

            migrationBuilder.DropTable(
                name: "FixtureSelectionPlayers");

            migrationBuilder.DropTable(
                name: "MatchResults");

            migrationBuilder.DropTable(
                name: "FixtureSelections");

            migrationBuilder.DropColumn(
                name: "JoinedOn",
                table: "Members");
        }
    }
}
