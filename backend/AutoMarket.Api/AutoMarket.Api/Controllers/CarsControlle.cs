
using Microsoft.AspNetCore.Mvc;

namespace AutoMarket.Api.Controllers;

[ApiController]
[Route("api/cars")]
public class CarsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetCars()
    {
        var cars = new[]
        {
            new
            {
                Id = 1,
                Brand = "Mercedes-Benz",
                Model = "Sprinter",
                Year = 2021,
                Price = 29800,
                Status = "available"
            },
            new
            {
                Id = 2,
                Brand = "Volkswagen",
                Model = "Crafter",
                Year = 2020,
                Price = 26500,
                Status = "reserved"
            }
        };

        return Ok(cars);
    }
}
