
using AutoMarket.Api.Data;

using Microsoft.EntityFrameworkCore;

using System.Text.RegularExpressions;

namespace AutoMarket.Api.Services;

public sealed class OrphanCarPhotoCleanupService
    : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    private readonly IWebHostEnvironment _environment;

    private readonly ILogger<OrphanCarPhotoCleanupService>
        _logger;

    // ========================================
    // НАЛАШТУВАННЯ
    // ========================================

    // Файли повинні існувати не менше 24 годин,
    // перш ніж їх можна буде прибрати.
    private static readonly TimeSpan FileLifetime =
        TimeSpan.FromHours(24);

    // Перевіряємо сервер кожні 6 годин.
    private static readonly TimeSpan CheckInterval =
        TimeSpan.FromHours(6);

    // Основні фотографії:
    // GUID.webp, GUID.jpg, GUID.png, GUID.avif
    private static readonly Regex MainPhotoRegex = new(
        @"^[a-f0-9]{32}\.(webp|jpg|png|avif)$",
        RegexOptions.IgnoreCase |
        RegexOptions.CultureInvariant |
        RegexOptions.Compiled
    );

    // Прев'ю:
    // GUID_thumb.webp
    private static readonly Regex ThumbnailRegex = new(
        @"^[a-f0-9]{32}_thumb\.webp$",
        RegexOptions.IgnoreCase |
        RegexOptions.CultureInvariant |
        RegexOptions.Compiled
    );

    // Тимчасові файли Magick.NET:
    // GUID.webp.tmp
    // GUID_thumb.webp.tmp
    private static readonly Regex TempRegex = new(
        @"^[a-f0-9]{32}(_thumb)?\.webp\.tmp$",
        RegexOptions.IgnoreCase |
        RegexOptions.CultureInvariant |
        RegexOptions.Compiled
    );

    // ========================================
    // КОНСТРУКТОР
    // ========================================

    public OrphanCarPhotoCleanupService(
        IServiceScopeFactory scopeFactory,
        IWebHostEnvironment environment,
        ILogger<OrphanCarPhotoCleanupService> logger)
    {
        _scopeFactory = scopeFactory;
        _environment = environment;
        _logger = logger;
    }

    // ========================================
    // ФОНОВА РОБОТА
    // ========================================

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        // Перевірка одразу після запуску сервера,
        // потім через кожні 6 годин.

        using var timer = new PeriodicTimer(
            CheckInterval
        );

        try
        {
            do
            {
                try
                {
                    await CleanupAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                    when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Помилка автоматичного очищення фото."
                    );
                }
            }
            while (
                await timer.WaitForNextTickAsync(
                    stoppingToken
                )
            );
        }
        catch (OperationCanceledException)
            when (stoppingToken.IsCancellationRequested)
        {
            // Нормальна зупинка ASP.NET Core.
        }
    }

    // ========================================
    // ОЧИЩЕННЯ
    // ========================================

    private async Task CleanupAsync(
        CancellationToken cancellationToken)
    {
        var photosDirectory = Path.Combine(
            _environment.ContentRootPath,
            "uploads",
            "cars"
        );

        if (!Directory.Exists(photosDirectory))
        {
            return;
        }

        // ====================================
        // 1. ОТРИМУЄМО ВСІ ФОТО З POSTGRESQL
        // ====================================

        using var scope =
            _scopeFactory.CreateScope();

        var db = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var cars = await db.Cars
            .AsNoTracking()
            .Select(car => new
            {
                car.Image,
                car.Images
            })
            .ToListAsync(cancellationToken);

        // HashSet дозволяє швидко перевіряти,
        // чи використовується фотографія.
        var usedImages = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase
        );

        foreach (var car in cars)
        {
            // Головне фото
            if (!string.IsNullOrWhiteSpace(car.Image))
            {
                usedImages.Add(
                    car.Image.Trim()
                );
            }

            // Усі фотографії галереї
            if (car.Images is not null)
            {
                foreach (var image in car.Images)
                {
                    if (!string.IsNullOrWhiteSpace(image))
                    {
                        usedImages.Add(
                            image.Trim()
                        );
                    }
                }
            }
        }

        // ====================================
        // 2. ПЕРЕВІРЯЄМО ФАЙЛИ
        // ====================================

        var oldestAllowedDate =
            DateTime.UtcNow - FileLifetime;

        var deletedCount = 0;

        foreach (var filePath in
            Directory.EnumerateFiles(photosDirectory))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var file = new FileInfo(filePath);

            // Не чіпаємо файли, які були
            // завантажені менше 24 годин тому.
            if (file.LastWriteTimeUtc > oldestAllowedDate)
            {
                continue;
            }

            string? mainPhotoUrl = null;

            // ====================================
            // 3. ВИЗНАЧАЄМО ТИП ФАЙЛУ
            // ====================================

            if (MainPhotoRegex.IsMatch(file.Name))
            {
                // Звичайна фотографія
                mainPhotoUrl =
                    $"/uploads/cars/{file.Name}";
            }
            else if (
                ThumbnailRegex.IsMatch(file.Name)
            )
            {
                // Прев'ю прив'язане до GUID.webp.
                var imageId = file.Name[..32];

                mainPhotoUrl =
                    $"/uploads/cars/{imageId}.webp";
            }
            else if (TempRegex.IsMatch(file.Name))
            {
                // Тимчасовий файл не може бути
                // повноцінною фотографією каталогу.
                mainPhotoUrl = null;
            }
            else
            {
                // Не чіпаємо сторонні файли.
                continue;
            }

            // ====================================
            // 4. ПЕРЕВІРКА ВИКОРИСТАННЯ
            // ====================================

            // Файл не видаляємо, якщо він
            // використовується будь-яким авто.
            if (
                mainPhotoUrl is not null &&
                usedImages.Contains(mainPhotoUrl)
            )
            {
                continue;
            }

            // Додаткова перевірка на випадок,
            // якщо адресу прев'ю колись збережуть
            // безпосередньо в базі.
            var ownUrl =
                $"/uploads/cars/{file.Name}";

            if (usedImages.Contains(ownUrl))
            {
                continue;
            }

            // ====================================
            // 5. ВИДАЛЯЄМО НЕПОТРІБНИЙ ФАЙЛ
            // ====================================

            try
            {
                file.Delete();

                deletedCount++;

                _logger.LogInformation(
                    "Видалено непотрібне фото: {Photo}",
                    file.Name
                );
            }
            catch (IOException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Не вдалося видалити файл {Photo}",
                    file.Name
                );
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Недостатньо прав для файлу {Photo}",
                    file.Name
                );
            }
        }

        // ====================================
        // 6. ЗАПИСУЄМО РЕЗУЛЬТАТ У ЖУРНАЛ
        // ====================================

        if (deletedCount > 0)
        {
            _logger.LogInformation(
                "Автоматично очищено {Count} фотофайлів.",
                deletedCount
            );
        }
    }
}
