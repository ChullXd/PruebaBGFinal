using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BankBG.DTOs;
using BankBG.Services;

namespace BankBG.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequestsController : ControllerBase
    {
        private readonly CreditRequestService _requestService; private readonly AuditLogService _auditLogService;
        public RequestsController(CreditRequestService requestService, AuditLogService auditLogService)
        {
            _requestService = requestService;
            _auditLogService = auditLogService;
        }

        [HttpPost]
        [Authorize(Roles = "Applicant")]
        public async Task<IActionResult> CreateRequest([FromBody] CreditRequestDto requestDto)
        {
            var request = await _requestService.CreateRequestAsync(requestDto, User.Identity.Name);
            await _auditLogService.LogAsync(User.Identity.Name, "CreateRequest", $"Created request {request.Id}");
            return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, request);
        }

        [HttpGet]
        [Authorize(Roles = "Applicant,Analyst")]
        public async Task<IActionResult> GetRequests([FromQuery] string status = "all")
        {
            var requests = await _requestService.GetRequestsAsync(User.Identity.Name, User.IsInRole("Analyst"), status);
            return Ok(requests);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Applicant,Analyst")]
        public async Task<IActionResult> GetRequest(string id)
        {
            var request = await _requestService.GetRequestAsync(id, User.Identity.Name, User.IsInRole("Analyst"));
            if (request == null)
            {
                return NotFound();
            }
            return Ok(request);
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "Analyst")]
        public async Task<IActionResult> UpdateRequestStatus(string id, [FromBody] UpdateStatusDto statusDto)
        {
            var request = await _requestService.UpdateRequestStatusAsync(id, statusDto.Status);
            if (request == null)
            {
                return NotFound();
            }
            await _auditLogService.LogAsync(User.Identity.Name, "UpdateRequestStatus", $"Updated request {id} to {statusDto.Status}");
            return Ok(request);
        }
    }
}
