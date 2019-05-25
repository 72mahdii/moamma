using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Models.Articles
{
    public class ArticleModel
    {
        public string Title { get; set; }
        public string Category { get; set; }
        public string Tag { get; set; }
        public string Summary { get; set; }
        public string Content { get; set; }
        public bool Archive { get; set; }
    }
}
