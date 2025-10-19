using MaidForYou.Application.Helpers;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.Application.Services;
using MaidForYou.Domain.Entities;
using MaidForYou.Infrastructure.Repositories;
using MaidForYou.Infrastructure.Security;

namespace MaidForYou.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddScoped<IUnitOfWork>(sp =>
                new UnitOfWork(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IBookingService, BookingService>();
            services.AddScoped<IMaidService, MaidService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IAuthService,AuthService>();


            //Register JWT Token Service
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            // Encryption Helper Service
            services.Configure<EncryptionSettings>(configuration.GetSection("Encryption"));
            services.AddSingleton<EncryptionHelperService>();

            return services;
        }
    }
}


