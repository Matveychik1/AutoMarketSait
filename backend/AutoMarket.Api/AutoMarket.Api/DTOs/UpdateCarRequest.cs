
using System.ComponentModel.DataAnnotations;

namespace AutoMarket.Api.DTOs;

// Успадковуємо обов'язкові поля з CreateCarRequest:
// марка, модель, рік, ціна, пробіг, тип кузова,
// паливо та статус.
public class UpdateCarRequest : CreateCarRequest
{
    public string? Transmission { get; set; }
    public string? Drivetrain { get; set; }

    [Range(
        typeof(decimal),
        "0.01",
        "99",
        ParseLimitsInInvariantCulture = true
    )]
    public decimal? EngineVolume { get; set; }

    [Range(1, 10000)]
    public int? PowerHp { get; set; }

    [Range(0, int.MaxValue)]
    public int? PayloadKg { get; set; }

    [Range(0, int.MaxValue)]
    public int? GrossWeightKg { get; set; }

    // Розміри кузова в метрах
    [Range(
        typeof(decimal),
        "0.01",
        "100",
        ParseLimitsInInvariantCulture = true
    )]
    public decimal? BodyLength { get; set; }

    [Range(
        typeof(decimal),
        "0.01",
        "100",
        ParseLimitsInInvariantCulture = true
    )]
    public decimal? BodyWidth { get; set; }

    [Range(
        typeof(decimal),
        "0.01",
        "100",
        ParseLimitsInInvariantCulture = true
    )]
    public decimal? BodyHeight { get; set; }

    // Поки це URL фотографій.
    // Завантаження файлів підключимо пізніше.
    public string? Image { get; set; }
    public List<string> Images { get; set; } = new();

    public List<string> Equipment { get; set; } = new();

    public string? Description { get; set; }

    [MaxLength(11)]
    public string? YoutubeVideoId { get; set; }
}
