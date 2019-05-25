using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Models.Articles
{
    public class DeletedArticle
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string Content { get; set; }
        public string Summary { get; set; }
        public string Tag { get; set; }
        public string AuthorId { get; set; }
        public DateTime CrtDate { get; set; }
    }
}
