namespace BankBG.Models 
{
    public class CreditRequest 
    { 
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } 
        public ApplicationUser User { get; set; }
        public decimal Amount { get; set; } 
        public int Term { get; set; } 
        public decimal MonthlyIncome { get; set; } 
        public int EmploymentLength { get; set; } 
        public string Status { get; set; } = "Pending"; 
        public string AutoEvaluation { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    } 
}