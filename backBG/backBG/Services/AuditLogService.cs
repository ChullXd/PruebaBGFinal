using BankBG.Data;
using BankBG.Models;

namespace BankBG.Services
{
    public class AuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(string userId, string action, string details)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                Details = details
            };
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}