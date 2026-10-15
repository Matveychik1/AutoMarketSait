
namespace AutoMarket.Api.Models;

public class Car
{
    public int Id { get; set; }

    // Основна інформація
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public int Mileage { get; set; }
    public string BodyType { get; set; } = string.Empty;

    // Статуси: available, reserved, sold, hidden
    public string Status { get; set; } = "available";

    // Двигун і технічні характеристики
    public string FuelType { get; set; } = "Дизель";
    public decimal? EngineVolume { get; set; }
    public string? Transmission { get; set; }
    public string? Drivetrain { get; set; }
    public int? PowerHp { get; set; }
    public int? PayloadKg { get; set; }
    public int? GrossWeightKg { get; set; }

    // Розміри кузова в метрах
    public decimal? BodyLength { get; set; }
    public decimal? BodyWidth { get; set; }
    public decimal? BodyHeight { get; set; }

    // Фотографії: зберігаємо адреси, а не самі файли
    public string Image { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();

    // Комплектація та опис
    public List<string> Equipment { get; set; } = new();
    public string? Description { get; set; }
    public string? YoutubeVideoId { get; set; }

    // Дата додавання
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
