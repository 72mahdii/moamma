using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Models
{
    public class AdministrationContext : IdentityDbContext<Author>
    {
        public AdministrationContext(DbContextOptions<AdministrationContext> options)
            : base(options) { }
    }
}
