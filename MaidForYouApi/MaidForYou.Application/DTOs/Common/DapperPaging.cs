using Dapper;
using MaidForYou.Application.DTOs.Common;
using System.Data;

namespace MaidForYou.Infrastructure.Common
{
    public static class DapperPaging
    {
        public static async Task<PagedResultDto<T>> GetPageAsync<T>(
            IDbConnection connection,
            IDbTransaction transaction,
            string tableOrQuery,
            string orderByColumn,
            int pageNumber,
            int pageSize)
        {
            // Total count
            var countSql = $"SELECT COUNT(1) FROM {tableOrQuery}";
            var totalRecords = await connection.ExecuteScalarAsync<int>(
                countSql, transaction: transaction);

            // Page data
            var dataSql = $@"
                SELECT *
                FROM {tableOrQuery}
                ORDER BY {orderByColumn} DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

            var data = await connection.QueryAsync<T>(
                dataSql,
                new
                {
                    Offset = (pageNumber - 1) * pageSize,
                    PageSize = pageSize
                },
                transaction);

            return new PagedResultDto<T>
            {
                Items = data.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords
            };
        }
    }
}
