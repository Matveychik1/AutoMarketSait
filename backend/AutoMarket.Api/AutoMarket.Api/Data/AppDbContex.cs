
using AutoMarket.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AutoMarket.Api.Data;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Car> Cars => Set<Car>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Car>(entity =>
        {
            entity.ToTable("cars");

            entity.HasKey(car => car.Id);

            entity.Property(car => car.Brand)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(car => car.Model)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(car => car.BodyType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(car => car.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("available");

            entity.Property(car => car.FuelType)
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(car => car.Price)
                .HasPrecision(12, 2);

            entity.Property(car => car.EngineVolume)
                .HasPrecision(5, 2);

            entity.Property(car => car.BodyLength)
                .HasPrecision(6, 2);

            entity.Property(car => car.BodyWidth)
                .HasPrecision(6, 2);

            entity.Property(car => car.BodyHeight)
                .HasPrecision(6, 2);

            entity.Property(car => car.Images)
                .HasColumnType("text[]");

            entity.Property(car => car.Equipment)
                .HasColumnType("text[]");

            entity.Property(car => car.AddedAt)
                .IsRequired();

            entity.HasIndex(car => car.Status);
            entity.HasIndex(car => car.AddedAt);
            entity.HasIndex(car => new { car.Brand, car.Model });
        });
    }
}
