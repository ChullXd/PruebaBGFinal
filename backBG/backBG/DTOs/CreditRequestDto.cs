namespace BankBG.DTOs
{
    public class CreditRequestDto
    {
        public string Id { get; set; }
        public string ApplicantName { get; set; }
        public decimal Amount { get; set; }
        public int Term { get; set; }
        public decimal MonthlyIncome { get; set; }
        public int EmploymentLength { get; set; }
        public string Status { get; set; }
        public string AutoEvaluation { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}