using Microsoft.AspNetCore.Identity;

namespace ApiAngular.Models.Authors
{
    public class Author : IdentityUser
    {
        public string NameInPersian { get; set; }
        public string Category { get; set; }
        public Author() { }
        public Author(string userName) : base(userName) { }
    }
}
