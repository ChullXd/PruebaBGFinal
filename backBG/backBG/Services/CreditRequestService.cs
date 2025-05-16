using AutoMapper;
using Microsoft.EntityFrameworkCore;
using BankBG.Data;
using BankBG.Models;
using BankBG.DTOs;

namespace BankBG.Services
{
    public class CreditRequestService
    {
        private readonly ApplicationDbContext _context; private readonly IMapper _mapper;

        public CreditRequestService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CreditRequestDto> CreateRequestAsync(CreditRequestDto requestDto, string userEmail)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null)
            {
                throw new Exception("Usuario no encontrado");
            }

            var request = _mapper.Map<CreditRequest>(requestDto);
            request.UserId = user.Id;
            request.AutoEvaluation = request.MonthlyIncome >= 1500 ? "Approved" : "Rejected";

            _context.CreditRequests.Add(request);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<CreditRequestDto>(request);
            result.ApplicantName = user.Email;
            return result;
        }

        public async Task<List<CreditRequestDto>> GetRequestsAsync(string userEmail, bool isAnalyst, string status)
        {
            var query = _context.CreditRequests.Include(r => r.User).AsQueryable();

            if (!isAnalyst)
            {
                query = query.Where(r => r.User.Email == userEmail);
            }

            if (status != "all")
            {
                query = query.Where(r => r.Status == status);
            }

            var requests = await query.ToListAsync();
            return _mapper.Map<List<CreditRequestDto>>(requests);
        }

        public async Task<CreditRequestDto> GetRequestAsync(string id, string userEmail, bool isAnalyst)
        {
            var query = _context.CreditRequests.Include(r => r.User).AsQueryable();
            if (!isAnalyst)
            {
                query = query.Where(r => r.User.Email == userEmail);
            }

            var request = await query.FirstOrDefaultAsync(r => r.Id == id);
            if (request == null)
            {
                return null;
            }

            var result = _mapper.Map<CreditRequestDto>(request);
            result.ApplicantName = request.User.Email;
            return result;
        }

        public async Task<CreditRequestDto> UpdateRequestStatusAsync(string id, string status)
        {
            var request = await _context.CreditRequests.FindAsync(id);
            if (request == null)
            {
                return null;
            }

            request.Status = status;
            await _context.SaveChangesAsync();

            var result = _mapper.Map<CreditRequestDto>(request);
            result.ApplicantName = (await _context.Users.FindAsync(request.UserId)).Email;
            return result;
        }
    }
}