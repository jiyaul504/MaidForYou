using MaidForYou.Application.Common.Exceptions;
using MaidForYou.Application.Common.Models;
using System.Net;
using System.Text.Json;
using Microsoft.Data.SqlClient;

namespace MaidForYou.API.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var traceId = context.TraceIdentifier;
                var env = context.RequestServices.GetRequiredService<IHostEnvironment>();
                bool showDetails = env.IsDevelopment();

                _logger.LogError(ex, "Unhandled exception occurred. TraceId: {TraceId}", traceId);

                HttpStatusCode statusCode;
                object responseObj;

                switch (ex)
                {
                    case NotFoundException:
                        statusCode = HttpStatusCode.NotFound;
                        responseObj = ApiResponse<string>.FailureResponse(ex.Message, statusCode: (int)statusCode);
                        break;

                    case ValidationException validationEx:
                        statusCode = HttpStatusCode.BadRequest;
                        responseObj = ApiResponse<object>.ValidationFailureResponse(validationEx.Message, validationEx.Errors, (int)statusCode);
                        break;

                    case UnauthorizedAccessException:
                        statusCode = HttpStatusCode.Unauthorized;
                        responseObj = ApiResponse<string>.FailureResponse("Unauthorized", statusCode: (int)statusCode);
                        break;

                    case DomainException:
                        statusCode = HttpStatusCode.BadRequest;
                        responseObj = ApiResponse<string>.FailureResponse(ex.Message, statusCode: (int)statusCode);
                        break;

                    case SqlException sqlEx:
                        statusCode = HttpStatusCode.InternalServerError;
                        responseObj = ApiResponse<object>.FailureResponse(
                            errors: showDetails
                                ? new List<string>
                                {
                                    $"SQL Error: {sqlEx.Message}",
                                    sqlEx.InnerException != null ? $"InnerException: {sqlEx.InnerException.Message}" : null,
                                    $"StackTrace: {sqlEx.StackTrace}",
                                    $"Path: {context.Request.Path}",
                                    $"Method: {context.Request.Method}",
                                    $"TraceId: {traceId}"
                                }.Where(e => e != null).ToList()
                                : null,
                            message: "A database error occurred.",
                            statusCode: (int)statusCode
                        );
                        break;

                    default:
                        statusCode = HttpStatusCode.InternalServerError;
                        responseObj = ApiResponse<object>.FailureResponse(
                            errors: showDetails
                                ? new List<string>
                                {
                                    $"Exception: {ex.Message}",
                                    ex.InnerException != null ? $"InnerException: {ex.InnerException.Message}" : null,
                                    $"StackTrace: {ex.StackTrace}",
                                    $"Path: {context.Request.Path}",
                                    $"Method: {context.Request.Method}",
                                    $"TraceId: {traceId}"
                                }.Where(e => e != null).ToList()
                                : null,
                            message: "An unexpected error occurred.",
                            statusCode: (int)statusCode
                        );
                        break;
                }

                if (responseObj is ApiResponse<object> objResp) objResp.CorrelationId = traceId;
                else if (responseObj is ApiResponse<string> strResp) strResp.CorrelationId = traceId;

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var result = JsonSerializer.Serialize(responseObj, options);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)statusCode;

                await context.Response.WriteAsync(result);
            }
        }
    }
}
