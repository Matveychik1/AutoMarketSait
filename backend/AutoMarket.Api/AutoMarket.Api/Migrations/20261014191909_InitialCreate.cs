using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AutoMarket.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Brand = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Mileage = table.Column<int>(type: "integer", nullable: false),
                    BodyType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "available"),
                    FuelType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    EngineVolume = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    Transmission = table.Column<string>(type: "text", nullable: true),
                    Drivetrain = table.Column<string>(type: "text", nullable: true),
                    PowerHp = table.Column<int>(type: "integer", nullable: true),
                    PayloadKg = table.Column<int>(type: "integer", nullable: true),
                    GrossWeightKg = table.Column<int>(type: "integer", nullable: true),
                    BodyLength = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    BodyWidth = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    BodyHeight = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    Image = table.Column<string>(type: "text", nullable: false),
                    Images = table.Column<List<string>>(type: "text[]", nullable: false),
                    Equipment = table.Column<List<string>>(type: "text[]", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    YoutubeVideoId = table.Column<string>(type: "text", nullable: true),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cars", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_cars_AddedAt",
                table: "cars",
                column: "AddedAt");

            migrationBuilder.CreateIndex(
                name: "IX_cars_Brand_Model",
                table: "cars",
                columns: new[] { "Brand", "Model" });

            migrationBuilder.CreateIndex(
                name: "IX_cars_Status",
                table: "cars",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cars");
        }
    }
}
