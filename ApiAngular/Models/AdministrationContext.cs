using ApiAngular.Models.Authors;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ApiAngular.Models
{
    public class AdministrationContext : IdentityDbContext<Author>
    {
        public AdministrationContext(DbContextOptions<AdministrationContext> options)
            : base(options) { }
    }
}
