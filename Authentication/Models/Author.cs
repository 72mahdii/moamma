using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Models
{
    public class Author : IdentityUser
    {
        public string NameInPersian { get; set; }
        public string Category { get; set; }
        public Author() { }
        public Author(string userName) : base(userName) { }

    }
}
