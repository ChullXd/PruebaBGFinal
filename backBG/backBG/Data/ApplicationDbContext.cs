using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BankBG.Models;

namespace BankBG.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        public DbSet<CreditRequest> CreditRequests { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
    }
}