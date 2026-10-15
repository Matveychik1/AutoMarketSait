
using AutoMarket.Api.Data;
using AutoMarket.Api.Services;

using ImageMagick;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// ЗАХИСТ MAGICK.NET
// ========================================

// Налаштовуємо ресурси до першої обробки фото.

// Максимальна ширина фотографії
ResourceLimits.Width = 10_000;

// Максимальна висота фотографії
ResourceLimits.Height = 10_000;

// Ліміт оперативної пам'яті піксельного кешу
ResourceLimits.Memory = 256UL * 1024 * 1024;

// Ліміт дискового кешу
ResourceLimits.Disk = 1024UL * 1024 * 1024;

// Максимум потоків ImageMagick
ResourceLimits.Thread = 2;

// ========================================
// КОНТРОЛЕРИ
// ========================================

builder.Services.AddControllersWithViews();

builder.Services.AddProblemDetails();

// ========================================
// SWAGGER
// ========================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ========================================
// POSTGRESQL
// ========================================

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Не знайдено DefaultConnection у налаштуваннях."
    );

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// ========================================
// ASP.NET CORE IDENTITY
// ========================================

builder.Services
    .AddIdentity<IdentityUser, IdentityRole>(options =>
    {
        options.User.RequireUniqueEmail = true;

        // Вимоги до пароля
        options.Password.RequiredLength = 12;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;

        // Блокування після 5 неправильних паролів
        options.Lockout.DefaultLockoutTimeSpan =
            TimeSpan.FromMinutes(15);

        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// ========================================
// COOKIE АДМІНІСТРАТОРА
// ========================================

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "AutoMarket.Admin";

    options.Cookie.HttpOnly = true;

    options.Cookie.SecurePolicy =
        CookieSecurePolicy.Always;

    options.Cookie.SameSite =
        SameSiteMode.Strict;

    options.ExpireTimeSpan =
        TimeSpan.FromHours(8);

    options.SlidingExpiration = false;

    // Для API повертаємо HTTP 401
    // замість перенаправлення на сторінку входу.
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode =
                StatusCodes.Status401Unauthorized;

            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);

        return Task.CompletedTask;
    };

    // Для API повертаємо HTTP 403,
    // якщо у користувача немає доступу.
    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode =
                StatusCodes.Status403Forbidden;

            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);

        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();

// ========================================
// CSRF ЗАХИСТ
// ========================================

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";

    options.Cookie.Name = "AutoMarket.Antiforgery";

    options.Cookie.HttpOnly = true;

    options.Cookie.SecurePolicy =
        CookieSecurePolicy.Always;

    options.Cookie.SameSite =
        SameSiteMode.Strict;
});

// ========================================
// RATE LIMITING
// ========================================

builder.Services.AddRateLimiter(options =>
{
    // Код відповіді при перевищенні лімітів
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;

    // ====================================
    // 1. ГЛОБАЛЬНИЙ ЛІМІТ API
    // ====================================

    // 120 запитів на хвилину з однієї IP.
    // Не застосовується до /uploads.

    options.GlobalLimiter =
        PartitionedRateLimiter.Create<HttpContext, string>(
            context =>
            {
                if (!context.Request.Path
                    .StartsWithSegments("/api"))
                {
                    return RateLimitPartition
                        .GetNoLimiter("non-api");
                }

                // Поки використовуємо IP безпосереднього
                // підключення. Для AWS налаштуємо
                // довірений reverse proxy.
                var clientIp =
                    context.Connection.RemoteIpAddress?
                        .MapToIPv4()
                        .ToString()
                    ?? "unknown";

                return RateLimitPartition
                    .GetFixedWindowLimiter(
                        partitionKey: $"api:{clientIp}",
                        factory: _ =>
                            new FixedWindowRateLimiterOptions
                            {
                                PermitLimit = 120,

                                Window =
                                    TimeSpan.FromMinutes(1),

                                QueueLimit = 0,

                                AutoReplenishment = true
                            }
                    );
            }
        );

    // ====================================
    // 2. ЛІМІТ ВХОДУ В АДМІНКУ
    // ====================================

    // Максимум 5 запитів на хвилину з IP.
    // Використовується в AuthController:
    //
    // [EnableRateLimiting("admin-login")]

    options.AddPolicy("admin-login", context =>
    {
        var clientIp =
            context.Connection.RemoteIpAddress?
                .MapToIPv4()
                .ToString()
            ?? "unknown";

        return RateLimitPartition
            .GetFixedWindowLimiter(
                partitionKey: $"admin-login:{clientIp}",
                factory: _ =>
                    new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 5,

                        Window =
                            TimeSpan.FromMinutes(1),

                        QueueLimit = 0,

                        AutoReplenishment = true
                    }
            );
    });

    // ====================================
    // 3. ЛІМІТ ЗАВАНТАЖЕННЯ ФОТОГРАФІЙ
    // ====================================

    // Максимум 2 одночасні запити на завантаження.
    // Третій запит отримує HTTP 429,
    // якщо попередні два ще обробляються.
    //
    // Використовується в CarPhotosController:
    //
    // [EnableRateLimiting("photo-upload")]

    options.AddConcurrencyLimiter(
        "photo-upload",
        limiterOptions =>
        {
            limiterOptions.PermitLimit = 2;

            // Без черги очікування
            limiterOptions.QueueLimit = 0;

            limiterOptions.QueueProcessingOrder =
                QueueProcessingOrder.OldestFirst;
        }
    );

    // ====================================
    // 4. ВІДПОВІДЬ ПРИ ПЕРЕВИЩЕННІ ЛІМІТУ
    // ====================================

    options.OnRejected = async (context, cancellationToken) =>
    {
        var response = context.HttpContext.Response;

        response.StatusCode =
            StatusCodes.Status429TooManyRequests;

        // Додаємо Retry-After, якщо відповідний
        // лімітер повідомив час очікування.
        if (context.Lease.TryGetMetadata(
            MetadataName.RetryAfter,
            out TimeSpan retryAfter))
        {
            response.Headers.RetryAfter =
                Math.Max(
                    1,
                    (int)Math.Ceiling(
                        retryAfter.TotalSeconds
                    )
                ).ToString();
        }

        await response.WriteAsJsonAsync(
            new
            {
                message =
                    "Забагато запитів. Спробуйте трохи пізніше."
            },
            cancellationToken
        );
    };
});

// ========================================
// АВТОМАТИЧНЕ ОЧИЩЕННЯ ФОТОГРАФІЙ
// ========================================

builder.Services.AddHostedService<
    OrphanCarPhotoCleanupService
>();

// ========================================
// СТВОРЕННЯ WEB APPLICATION
// ========================================

var app = builder.Build();

// ========================================
// ОБРОБКА ПОМИЛОК У PRODUCTION
// ========================================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
    app.UseHsts();
}

// ========================================
// ПАПКА ФОТОГРАФІЙ
// ========================================

var uploadsDirectory = Path.Combine(
    app.Environment.ContentRootPath,
    "uploads"
);

Directory.CreateDirectory(
    Path.Combine(uploadsDirectory, "cars")
);

// ========================================
// СТАТИЧНІ ФАЙЛИ
// ========================================

// Відкриваємо лише папку uploads.
// Решта файлів проєкту залишаються приватними.

var contentTypes =
    new FileExtensionContentTypeProvider();

contentTypes.Mappings[".avif"] = "image/avif";

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        uploadsDirectory
    ),

    RequestPath = "/uploads",

    ContentTypeProvider = contentTypes
});

// ========================================
// SWAGGER ЛИШЕ ДЛЯ DEVELOPMENT
// ========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ========================================
// MIDDLEWARE
// ========================================

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

// Після маршрутизації, щоб працювали
// політики з атрибутів контролерів.
app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

// ========================================
// СТВОРЕННЯ АДМІНІСТРАТОРА
// ТІЛЬКИ ПІД ЧАС ЛОКАЛЬНОЇ РОЗРОБКИ
// ========================================

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();

    var roleManager =
        scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

    var userManager =
        scope.ServiceProvider
            .GetRequiredService<UserManager<IdentityUser>>();

    const string adminRole = "Admin";

    // Створюємо роль Admin, якщо її ще немає
    if (!await roleManager.RoleExistsAsync(adminRole))
    {
        var roleResult =
            await roleManager.CreateAsync(
                new IdentityRole(adminRole)
            );

        if (!roleResult.Succeeded)
        {
            throw new InvalidOperationException(
                string.Join(
                    "; ",
                    roleResult.Errors
                        .Select(e => e.Description)
                )
            );
        }
    }

    // Дані адміністратора з User Secrets
    var adminEmail =
        builder.Configuration["AdminBootstrap:Email"];

    var adminPassword =
        builder.Configuration["AdminBootstrap:Password"];

    if (!string.IsNullOrWhiteSpace(adminEmail)
        && !string.IsNullOrWhiteSpace(adminPassword))
    {
        var existingUser =
            await userManager.FindByEmailAsync(adminEmail);

        // Не надаємо роль адміністратора
        // вже існуючому користувачу автоматично.
        if (existingUser is null)
        {
            var admin = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var createResult =
                await userManager.CreateAsync(
                    admin,
                    adminPassword
                );

            if (!createResult.Succeeded)
            {
                throw new InvalidOperationException(
                    "Не вдалося створити адміністратора: "
                    + string.Join(
                        "; ",
                        createResult.Errors
                            .Select(e => e.Description)
                    )
                );
            }

            var roleResult =
                await userManager.AddToRoleAsync(
                    admin,
                    adminRole
                );

            if (!roleResult.Succeeded)
            {
                throw new InvalidOperationException(
                    "Не вдалося призначити роль Admin."
                );
            }
        }
    }
}

app.Run();
