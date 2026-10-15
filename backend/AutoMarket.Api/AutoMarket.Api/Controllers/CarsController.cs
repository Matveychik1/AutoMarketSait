
using AutoMarket.Api.Data;
using AutoMarket.Api.DTOs;
using AutoMarket.Api.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Text.RegularExpressions;

namespace AutoMarket.Api.Controllers;

[ApiController]
[Route("api/cars")]
public class CarsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<CarsController> _logger;

    // Тільки наші фотографії, створені CarPhotosController:
    // /uploads/cars/{32-символьний GUID}.jpg
    private static readonly Regex LocalPhotoPattern = new(
        @"^/uploads/cars/[a-f0-9]{32}\.(jpg|png|webp|avif)$",
        RegexOptions.IgnoreCase |
        RegexOptions.CultureInvariant |
        RegexOptions.Compiled
    );

    public CarsController(
        AppDbContext context,
        IWebHostEnvironment environment,
        ILogger<CarsController> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    // ========================================
    // ПУБЛІЧНИЙ КАТАЛОГ
    // ========================================

    // GET /api/cars
    [HttpGet]
    public async Task<ActionResult<List<Car>>> GetCars()
    {
        var cars = await _context.Cars
            .AsNoTracking()
            .Where(car => car.Status != "hidden")
            .OrderByDescending(car => car.AddedAt)
            .ThenByDescending(car => car.Id)
            .ToListAsync();

        return Ok(cars);
    }

    // GET /api/cars/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
        var car = await _context.Cars
            .AsNoTracking()
            .FirstOrDefaultAsync(car =>
                car.Id == id &&
                car.Status != "hidden"
            );

        if (car is null)
        {
            return NotFound(new
            {
                message = "Автомобіль не знайдено"
            });
        }

        return Ok(car);
    }

    // ========================================
    // АДМІН-ПАНЕЛЬ
    // ========================================

    // GET /api/cars/admin
    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<List<Car>>> GetAdminCars()
    {
        var cars = await _context.Cars
            .AsNoTracking()
            .OrderByDescending(car => car.AddedAt)
            .ThenByDescending(car => car.Id)
            .ToListAsync();

        return Ok(cars);
    }

    // GET /api/cars/admin/1
    [Authorize(Roles = "Admin")]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<Car>> GetAdminCar(
        int id)
    {
        var car = await _context.Cars
            .AsNoTracking()
            .FirstOrDefaultAsync(car => car.Id == id);

        if (car is null)
        {
            return NotFound(new
            {
                message = "Автомобіль не знайдено"
            });
        }

        return Ok(car);
    }

    // ========================================
    // ДОДАВАННЯ АВТОМОБІЛЯ
    // ========================================

    // POST /api/cars
    [Authorize(Roles = "Admin")]
    [ValidateAntiForgeryToken]
    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(
        [FromBody] UpdateCarRequest request)
    {
        var images = CleanList(request.Images);
        var cover = CleanOptional(request.Image);

        if (images.Count == 0 && cover is not null)
        {
            images.Add(cover);
        }

        var car = new Car
        {
            Brand = request.Brand.Trim(),
            Model = request.Model.Trim(),
            Year = request.Year,
            Price = request.Price,
            Mileage = request.Mileage,
            BodyType = request.BodyType.Trim(),
            FuelType = request.FuelType,
            Status = request.Status,

            EngineVolume = request.EngineVolume,

            Transmission = CleanOptional(
                request.Transmission
            ),

            Drivetrain = CleanOptional(
                request.Drivetrain
            ),

            PowerHp = request.PowerHp,
            PayloadKg = request.PayloadKg,
            GrossWeightKg = request.GrossWeightKg,

            BodyLength = request.BodyLength,
            BodyWidth = request.BodyWidth,
            BodyHeight = request.BodyHeight,

            Images = images,

            Image = images.Count > 0
                ? images[0]
                : string.Empty,

            Equipment = CleanList(
                request.Equipment
            ),

            Description = CleanOptional(
                request.Description
            ),

            YoutubeVideoId = CleanOptional(
                request.YoutubeVideoId
            ),

            AddedAt = DateTime.UtcNow
        };

        _context.Cars.Add(car);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetAdminCar),
            new { id = car.Id },
            car
        );
    }

    // ========================================
    // РЕДАГУВАННЯ АВТОМОБІЛЯ
    // ========================================

    // PUT /api/cars/1
    [Authorize(Roles = "Admin")]
    [ValidateAntiForgeryToken]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCar(
        int id,
        [FromBody] UpdateCarRequest request)
    {
        var car = await _context.Cars.FindAsync(id);

        if (car is null)
        {
            return NotFound(new
            {
                message = "Автомобіль не знайдено"
            });
        }

        // Зберігаємо попередній список фотографій.
        // Після оновлення визначимо, які вже
        // ніде не використовуються.
        var oldPhotoUrls = GetPhotoReferences(car);

        // ========================================
        // ОСНОВНІ ХАРАКТЕРИСТИКИ
        // ========================================

        car.Brand = request.Brand.Trim();
        car.Model = request.Model.Trim();
        car.Year = request.Year;
        car.Price = request.Price;
        car.Mileage = request.Mileage;

        car.BodyType = request.BodyType.Trim();
        car.FuelType = request.FuelType;
        car.Status = request.Status;

        // ========================================
        // ТЕХНІЧНІ ХАРАКТЕРИСТИКИ
        // ========================================

        car.EngineVolume = request.EngineVolume;

        car.Transmission = CleanOptional(
            request.Transmission
        );

        car.Drivetrain = CleanOptional(
            request.Drivetrain
        );

        car.PowerHp = request.PowerHp;
        car.PayloadKg = request.PayloadKg;
        car.GrossWeightKg = request.GrossWeightKg;

        // ========================================
        // РОЗМІРИ КУЗОВА
        // ========================================

        car.BodyLength = request.BodyLength;
        car.BodyWidth = request.BodyWidth;
        car.BodyHeight = request.BodyHeight;

        // ========================================
        // ФОТОГРАФІЇ
        // ========================================

        var newImages = CleanList(request.Images);
        var cover = CleanOptional(request.Image);

        if (
            newImages.Count == 0 &&
            cover is not null
        )
        {
            newImages.Add(cover);
        }

        car.Images = newImages;

        car.Image = newImages.Count > 0
            ? newImages[0]
            : string.Empty;

        // ========================================
        // КОМПЛЕКТАЦІЯ, ОПИС, ВІДЕО
        // ========================================

        car.Equipment = CleanList(
            request.Equipment
        );

        car.Description = CleanOptional(
            request.Description
        );

        car.YoutubeVideoId = CleanOptional(
            request.YoutubeVideoId
        );

        // ========================================
        // 1. СПОЧАТКУ ЗБЕРІГАЄМО В POSTGRESQL
        // ========================================

        await _context.SaveChangesAsync();

        // ========================================
        // 2. ПОТІМ ОЧИЩУЄМО НЕПОТРІБНІ ФОТО
        // ========================================

        // Прибираємо лише ті файли, на які
        // більше немає посилань у базі.
        await TryCleanupPhotosAsync(oldPhotoUrls);

        return Ok(car);
    }

    // ========================================
    // ЗМІНА СТАТУСУ
    // ========================================

    // PATCH /api/cars/1/status
    [Authorize(Roles = "Admin")]
    [ValidateAntiForgeryToken]
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateCarStatus(
        int id,
        [FromBody] UpdateCarStatusRequest request)
    {
        var car = await _context.Cars.FindAsync(id);

        if (car is null)
        {
            return NotFound(new
            {
                message = "Автомобіль не знайдено"
            });
        }

        car.Status = request.Status;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            car.Id,
            car.Brand,
            car.Model,
            car.Status,
            message = "Статус автомобіля оновлено"
        });
    }

    // ========================================
    // ВИДАЛЕННЯ АВТОМОБІЛЯ
    // ========================================

    // DELETE /api/cars/1
    [Authorize(Roles = "Admin")]
    [ValidateAntiForgeryToken]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
        var car = await _context.Cars.FindAsync(id);

        if (car is null)
        {
            return NotFound(new
            {
                message = "Автомобіль не знайдено"
            });
        }

        // Запам'ятовуємо фотографії автомобіля.
        var photoUrls = GetPhotoReferences(car);

        // ========================================
        // 1. ВИДАЛЯЄМО АВТОМОБІЛЬ ІЗ POSTGRESQL
        // ========================================

        _context.Cars.Remove(car);

        await _context.SaveChangesAsync();

        // ========================================
        // 2. ОЧИЩУЄМО ФОТО, ЯКІ БІЛЬШЕ
        //    НЕ ВИКОРИСТОВУЮТЬСЯ
        // ========================================

        await TryCleanupPhotosAsync(photoUrls);

        return NoContent();
    }

    // ========================================
    // ОЧИЩЕННЯ ФОТОГРАФІЙ
    // ========================================

    // Отримуємо всі адреси фото автомобіля:
    // головне фото + галерея.
    private static List<string> GetPhotoReferences(
        Car car)
    {
        var urls = new List<string>();

        if (!string.IsNullOrWhiteSpace(car.Image))
        {
            urls.Add(car.Image.Trim());
        }

        if (car.Images is not null)
        {
            urls.AddRange(
                car.Images.Where(
                    url => !string.IsNullOrWhiteSpace(url)
                )
                .Select(url => url.Trim())
            );
        }

        return urls
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    // Безпечна обгортка:
    // якщо очищення не вдалося, операція з БД
    // усе одно вважається успішною.
    private async Task TryCleanupPhotosAsync(
        IEnumerable<string> candidateUrls)
    {
        try
        {
            await CleanupUnusedPhotosAsync(candidateUrls);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Не вдалося завершити очищення фотографій автомобіля."
            );
        }
    }

    private async Task CleanupUnusedPhotosAsync(
        IEnumerable<string> candidateUrls)
    {
        // ========================================
        // КРОК 1. ВІДБИРАЄМО ТІЛЬКИ НАШІ ФАЙЛИ
        // ========================================

        var localPhotos = candidateUrls
            .Where(url =>
                !string.IsNullOrWhiteSpace(url) &&
                LocalPhotoPattern.IsMatch(url)
            )
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (localPhotos.Count == 0)
        {
            return;
        }

        // ========================================
        // КРОК 2. ПЕРЕВІРЯЄМО ВСЮ БАЗУ
        // ========================================

        // Перевіряємо і головне фото, і галереї
        // всіх автомобілів, включно з прихованими.
        var references = await _context.Cars
            .AsNoTracking()
            .Select(car => new
            {
                car.Image,
                car.Images
            })
            .ToListAsync();

        var usedPhotos = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase
        );

        foreach (var reference in references)
        {
            if (!string.IsNullOrWhiteSpace(
                reference.Image
            ))
            {
                usedPhotos.Add(
                    reference.Image.Trim()
                );
            }

            if (reference.Images is not null)
            {
                foreach (var image in reference.Images)
                {
                    if (!string.IsNullOrWhiteSpace(image))
                    {
                        usedPhotos.Add(image.Trim());
                    }
                }
            }
        }

        // ========================================
        // КРОК 3. ОТРИМУЄМО ПАПКУ З ФОТО
        // ========================================

        var photosDirectory = Path.Combine(
            _environment.ContentRootPath,
            "uploads",
            "cars"
        );

        if (!Directory.Exists(photosDirectory))
        {
            return;
        }

        // ========================================
        // КРОК 4. ВИДАЛЯЄМО НЕВИКОРИСТАНІ
        // ========================================

        foreach (var photoUrl in localPhotos)
        {
            // Якщо хоча б один автомобіль
            // використовує це фото — не видаляємо.
            if (usedPhotos.Contains(photoUrl))
            {
                continue;
            }

            // Regex вище гарантує, що адреса:
            // /uploads/cars/{GUID}.{дозволений формат}
            //
            // Тому не можна підставити довільний шлях.
            var fileName = photoUrl[
                "/uploads/cars/".Length..
            ];

            var filePath = Path.Combine(
                photosDirectory,
                fileName
            );


            try
            {
                // ====================================
                // 1. ВИДАЛЕННЯ ОСНОВНОЇ ФОТОГРАФІЇ
                // ====================================

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                // ====================================
                // 2. ВИДАЛЕННЯ WEBP-ПРЕВ'Ю
                // ====================================

                // Новий завантажувач Magick.NET створює:
                //
                // GUID.webp
                // GUID_thumb.webp
                //
                // Старі JPG/PNG-файли не мають прев'ю.

                if (string.Equals(
                    Path.GetExtension(fileName),
                    ".webp",
                    StringComparison.OrdinalIgnoreCase))
                {
                    var imageId =
                        Path.GetFileNameWithoutExtension(fileName);

                    var thumbnailName =
                        $"{imageId}_thumb.webp";

                    var thumbnailPath = Path.Combine(
                        photosDirectory,
                        thumbnailName
                    );

                    if (System.IO.File.Exists(thumbnailPath))
                    {
                        System.IO.File.Delete(thumbnailPath);
                    }
                }

                _logger.LogInformation(
                    "Очищено фотографію автомобіля: {PhotoUrl}",
                    photoUrl
                );
            }

            catch (IOException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Не вдалося видалити фотографію: {PhotoUrl}",
                    photoUrl
                );
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Недостатньо прав для видалення фотографії: {PhotoUrl}",
                    photoUrl
                );
            }
        }
    }

    // ========================================
    // ДОПОМІЖНІ МЕТОДИ
    // ========================================

    private static string? CleanOptional(
        string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private static List<string> CleanList(
        IEnumerable<string>? items)
    {
        return (items ?? Enumerable.Empty<string>())
            .Where(item =>
                !string.IsNullOrWhiteSpace(item)
            )
            .Select(item => item.Trim())
            .Distinct()
            .ToList();
    }
}
