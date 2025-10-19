using MaidForYou.Domain.Entities;
using MaidForYou.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace MaidForYou.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Maid> Maids { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Address as Value Object
            modelBuilder.Entity<Maid>()
                .OwnsOne(m => m.Address);

            modelBuilder.Entity<Customer>()
                .OwnsOne(c => c.Address);

            // Money as Value Object in Payment
            modelBuilder.Entity<Payment>()
                .OwnsOne(p => p.Amount, money =>
                {
                    money.Property(m => m.Amount)
                         .IsRequired();

                    money.Property(m => m.Currency)
                         .HasMaxLength(10)
                         .IsRequired();
                });
        }

    }
}
