
using System.ComponentModel.DataAnnotations;

namespace AutoMarket.Api.DTOs;

public class CreateCarRequest
{
    [Required]
    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Model { get; set; } = string.Empty;

    [Range(1900, 2100)]
    public int Year { get; set; }

    [Range(
        typeof(decimal),
        "0.01",
        "999999999",
        ParseLimitsInInvariantCulture = true
    )]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Mileage { get; set; }

    [Required]
    [MaxLength(100)]
    public string BodyType { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Дизель|Бензин)$")]
    public string FuelType { get; set; } = "Дизель";

    [Required]
    [RegularExpression("^(available|reserved|sold|hidden)$")]
    public string Status { get; set; } = "available";
}
