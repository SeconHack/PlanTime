using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;

namespace PlanTime.Api.Controllers.V1;

[AllowAnonymous]
public class ProfessionController : ApiControllerV1
{
    [HttpPost("create")]
    public async Task<IActionResult> Create()
    {
        
        return Ok();
    }
}