using Microsoft.AspNetCore.Identity;

namespace BankBG.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Role { get; set; }
    }
}