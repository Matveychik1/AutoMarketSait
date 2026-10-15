
using ImageMagick;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AutoMarket.Api.Controllers;

[ApiController]
[Route("api/car-photos")]
[Authorize(Roles = "Admin")]
public class CarPhotosController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<CarPhotosController> _logger;

    // ========================================
    // ОБМЕЖЕННЯ
    // ========================================

    // Максимальний розмір файлу — 15 МБ
    private const long MaxFileSize =
        15L * 1024 * 1024;

    // Максимальна кількість пікселів
    private const long MaxPixels = 40_000_000;

    // Основне фото — до 1920 px
    private const int MaxImageSize = 1920;

    // Прев'ю для каталогу
    private const int ThumbnailWidth = 480;
    private const int ThumbnailHeight = 360;

    // Дозволені типи файлів
    private static readonly string[] AllowedContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    // ========================================
    // КОНСТРУКТОР
    // ========================================

    public CarPhotosController(
        IWebHostEnvironment environment,
        ILogger<CarPhotosController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    // ========================================
    // POST /api/car-photos
    // ========================================

    [HttpPost]
    [ValidateAntiForgeryToken]

    // Максимум 2 одночасні завантаження
    [EnableRateLimiting("photo-upload")]

    // Максимальний розмір HTTP-запиту — 16 МБ
    [RequestSizeLimit(16L * 1024 * 1024)]
    public IActionResult Upload([FromForm] IFormFile? file)
    {
        // ========================================
        // 1. ПЕРЕВІРКА ФАЙЛУ
        // ========================================

        if (file is null)
        {
            return BadRequest(new
            {
                message = "Файл не передано."
            });
        }

        if (file.Length == 0)
        {
            return BadRequest(new
            {
                message = "Файл порожній."
            });
        }

        if (file.Length > MaxFileSize)
        {
            return BadRequest(new
            {
                message =
                    "Фотографія повинна бути не більшою за 15 МБ."
            });
        }

        if (!AllowedContentTypes.Contains(
            file.ContentType,
            StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message =
                    "Дозволені формати JPG, PNG та WebP."
            });
        }

        // ========================================
        // 2. ПАПКА ДЛЯ ФОТОГРАФІЙ
        // ========================================

        var directory = Path.Combine(
            _environment.ContentRootPath,
            "uploads",
            "cars"
        );

        Directory.CreateDirectory(directory);

        // Генеруємо безпечну унікальну назву
        var imageId = Guid.NewGuid().ToString("N");

        var mainFileName = $"{imageId}.webp";

        var thumbnailFileName =
            $"{imageId}_thumb.webp";

        var mainPath = Path.Combine(
            directory,
            mainFileName
        );

        var thumbnailPath = Path.Combine(
            directory,
            thumbnailFileName
        );

        // Тимчасові файли для безпечного запису
        var mainTempPath = mainPath + ".tmp";

        var thumbnailTempPath =
            thumbnailPath + ".tmp";

        var completed = false;

        try
        {
            // ========================================
            // 3. ВІДКРИТТЯ ФОТОГРАФІЇ
            // ========================================

            using var stream = file.OpenReadStream();

            using var image = new MagickImage(stream);

            // Перевіряємо фактичний формат
            if (image.Format != MagickFormat.Jpeg &&
                image.Format != MagickFormat.Png &&
                image.Format != MagickFormat.WebP)
            {
                return BadRequest(new
                {
                    message =
                        "Непідтримуваний формат зображення."
                });
            }

            // ========================================
            // 4. ПЕРЕВІРКА РОЗДІЛЬНОЇ ЗДАТНОСТІ
            // ========================================

            if (image.Width <= 0 || image.Height <= 0)
            {
                return BadRequest(new
                {
                    message = "Некоректне зображення."
                });
            }

            if ((long)image.Width * image.Height > MaxPixels)
            {
                return BadRequest(new
                {
                    message =
                        "Фотографія має занадто велику роздільну здатність."
                });
            }

            // ========================================
            // 5. ОРІЄНТАЦІЯ ФОТО
            // ========================================

            // Правильно повертаємо фото зі смартфонів
            image.AutoOrient();

            // ========================================
            // 6. ВИДАЛЕННЯ МЕТАДАНИХ
            // ========================================

            // Видаляємо EXIF, GPS та інші профілі
            image.Strip();

            // ========================================
            // 7. СТИСНЕННЯ ОСНОВНОГО ФОТО
            // ========================================

            // Не збільшуємо маленькі фотографії.
            // Зберігаємо правильні пропорції.

            if (image.Width > MaxImageSize ||
                image.Height > MaxImageSize)
            {
                image.Resize(
                    new MagickGeometry(
                        MaxImageSize,
                        MaxImageSize
                    )
                );
            }

            // Основна фотографія у WebP
            image.Format = MagickFormat.WebP;

            image.Quality = 82;

            image.Write(
                mainTempPath,
                MagickFormat.WebP
            );

            // ========================================
            // 8. СТВОРЕННЯ ПРЕВ'Ю
            // ========================================

            using var thumbnail = image.Clone();

            if (thumbnail.Width > ThumbnailWidth ||
                thumbnail.Height > ThumbnailHeight)
            {
                thumbnail.Resize(
                    new MagickGeometry(
                        ThumbnailWidth,
                        ThumbnailHeight
                    )
                );
            }

            // Маленьке WebP для карток автомобілів
            thumbnail.Format = MagickFormat.WebP;

            thumbnail.Quality = 72;

            thumbnail.Write(
                thumbnailTempPath,
                MagickFormat.WebP
            );

            // ========================================
            // 9. ЗБЕРЕЖЕННЯ ГОТОВИХ ФАЙЛІВ
            // ========================================

            System.IO.File.Move(
                mainTempPath,
                mainPath
            );

            System.IO.File.Move(
                thumbnailTempPath,
                thumbnailPath
            );

            completed = true;

            _logger.LogInformation(
                "Успішно оптимізовано фото {ImageId}",
                imageId
            );

            // ========================================
            // 10. ПОВЕРТАЄМО URL ДЛЯ REACT
            // ========================================

            return Ok(new
            {
                url = $"/uploads/cars/{mainFileName}",

                thumbnailUrl =
                    $"/uploads/cars/{thumbnailFileName}"
            });
        }

        // ========================================
        // ПОМИЛКИ MAGICK.NET
        // ========================================

        catch (MagickException ex)
        {
            _logger.LogWarning(
                ex,
                "Помилка обробки зображення"
            );

            return BadRequest(new
            {
                message =
                    "Не вдалося обробити фотографію. Перевір файл."
            });
        }

        // ========================================
        // ІНШІ ПОМИЛКИ
        // ========================================

        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Неочікувана помилка під час завантаження фотографії"
            );

            return StatusCode(500, new
            {
                message =
                    "На сервері сталася помилка під час завантаження фотографії."
            });
        }

        // ========================================
        // ОЧИЩЕННЯ ТИМЧАСОВИХ ФАЙЛІВ
        // ========================================

        finally
        {
            // При успішному завершенні
            // прибираємо лише тимчасові файли.
            //
            // При помилці прибираємо і тимчасові,
            // і частково створені готові файли.

            var pathsToClean = completed
                ? new[]
                {
                    mainTempPath,
                    thumbnailTempPath
                }
                : new[]
                {
                    mainTempPath,
                    thumbnailTempPath,
                    mainPath,
                    thumbnailPath
                };

            foreach (var path in pathsToClean)
            {
                try
                {
                    if (System.IO.File.Exists(path))
                    {
                        System.IO.File.Delete(path);
                    }
                }
                catch (IOException ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Не вдалося очистити файл {Path}",
                        path
                    );
                }
                catch (UnauthorizedAccessException ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Недостатньо прав для очищення файлу {Path}",
                        path
                    );
                }
            }
        }
    }
}
