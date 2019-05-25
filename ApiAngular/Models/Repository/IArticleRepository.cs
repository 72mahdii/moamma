
using ApiAngular.Models.Authors;

namespace ApiAngular.Models.Repository
{
    public interface IArticleRep
    {
        FrontAuthor LoggedInAuthor { get; set; }

    }
}
