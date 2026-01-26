using MaidForYou.Application.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MaidForYou.API.Helpers
{
    public class PaginationValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            foreach (var arg in context.ActionArguments.Values)
            {
                if (arg is PaginationQueryDto paging)
                {
                    if (paging.PageNumber <= 0)
                        context.Result = new BadRequestObjectResult("PageNumber must be greater than 0");

                    if (paging.PageSize <= 0)
                        context.Result = new BadRequestObjectResult("PageSize must be greater than 0");
                }
            }
        }
        public void OnActionExecuted(ActionExecutedContext context) { }
    }

}
