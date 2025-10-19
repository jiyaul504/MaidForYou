namespace MaidForYou.Application.Common.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        public int StatusCode { get; set; } = 200;
        public string? CorrelationId { get; set; }
        public Dictionary<string, string[]> ValidationErrors { get; set; }
            = new Dictionary<string, string[]>();

        public static ApiResponse<T> SuccessResponse(T data, string message = "Request successful", int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                StatusCode = statusCode,
                CorrelationId = Guid.NewGuid().ToString()
            };
        }

        public static ApiResponse<T> FailureResponse(string message, List<string>? errors = null, int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>(),
                StatusCode = statusCode,
                CorrelationId = Guid.NewGuid().ToString()
            };
        }

        public static ApiResponse<T> ValidationFailureResponse(
            string message,
            IDictionary<string, string[]> validationErrors,
            int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Data = default,
                StatusCode = statusCode,
                CorrelationId = Guid.NewGuid().ToString(),
                Errors = new List<string>(),
                ValidationErrors = new Dictionary<string, string[]>(validationErrors) 
            };
        }


    }
}
