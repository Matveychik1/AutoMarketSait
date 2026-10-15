
using AutoMarket.Api.DTOs;

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AutoMarket.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IAntiforgery _antiforgery;

    public AuthController(
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        IAntiforgery antiforgery)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _antiforgery = antiforgery;
    }

    // ========================================
    // GET /api/auth/csrf
    // ========================================

    [AllowAnonymous]
    [HttpGet("csrf")]
    public IActionResult GetCsrfToken()
    {
        Response.Headers.CacheControl = "no-store";

        var tokens = _antiforgery.GetAndStoreTokens(
            HttpContext
        );

        return Ok(new
        {
            requestToken = tokens.RequestToken
        });
    }

    // ========================================
    // POST /api/auth/login
    // ========================================

    [AllowAnonymous]
    [ValidateAntiForgeryToken]

    // Не більше 5 спроб на хвилину з однієї IP.
    [EnableRateLimiting("admin-login")]

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(
            request.Email.Trim()
        );

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Неправильний email або пароль."
            });
        }

        var result =
            await _signInManager.PasswordSignInAsync(
                user,
                request.Password,
                isPersistent: false,
                lockoutOnFailure: true
            );

        if (!result.Succeeded)
        {
            return Unauthorized(new
            {
                message =
                    "Неправильні дані або вхід тимчасово заблоковано."
            });
        }

        if (!await _userManager.IsInRoleAsync(
            user, "Admin"))
        {
            await _signInManager.SignOutAsync();

            return Forbid();
        }

        return Ok(new
        {
            message = "Вхід виконано успішно.",
            email = user.Email,
            role = "Admin"
        });
    }

    // ========================================
    // GET /api/auth/me
    // ========================================

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public IActionResult Me()
    {
        Response.Headers.CacheControl = "no-store";

        return Ok(new
        {
            isAuthenticated = true,
            email = User.Identity?.Name,
            role = "Admin"
        });
    }

    // ========================================
    // POST /api/auth/logout
    // ========================================

    [Authorize(Roles = "Admin")]
    [ValidateAntiForgeryToken]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return Ok(new
        {
            message = "Ви вийшли з адмін-панелі."
        });
    }
}
