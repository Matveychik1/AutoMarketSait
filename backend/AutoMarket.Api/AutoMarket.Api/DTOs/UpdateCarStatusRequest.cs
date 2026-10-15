
using System.ComponentModel.DataAnnotations;

namespace AutoMarket.Api.DTOs;

public class UpdateCarStatusRequest
{
    [Required]
    [RegularExpression(
        "^(available|reserved|sold|hidden)$",
        ErrorMessage = "Неправильний статус автомобіля."
    )]
    public string Status { get; set; } = string.Empty;
}
