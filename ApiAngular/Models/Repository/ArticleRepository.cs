using ApiAngular.Models.Authors;

namespace ApiAngular.Models.Repository
{
    public class ArticleRepository : IArticleRep
    {
        public FrontAuthor LoggedInAuthor { get; set; }

        public ArticleRepository(FrontAuthor user) => LoggedInAuthor = user;
    }
}
