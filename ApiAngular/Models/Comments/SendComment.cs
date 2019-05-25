using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Models.Comments
{
    public class SendComment
    {
        public string Text { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public long ArticleId { get; set; }
    }
}
