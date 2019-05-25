using ApiAngular.Models.Articles;
using ApiAngular.Models.Authors;
using System.Collections.Generic;

namespace ApiAngular.Models.Repository
{
    public class GetData
    {
        public List<FrontAuthor> Authors { get; set; }
        public List<Article> Articles { get; set; }
    }
}
