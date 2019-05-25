using ApiAngular.Models.Articles;
using ApiAngular.Models.Authors;
using ApiAngular.Models.Comments;
using Microsoft.EntityFrameworkCore;

namespace ApiAngular.Models
{
    public class StorageContext : DbContext
    {
        public StorageContext(DbContextOptions<StorageContext> options) : base(options) { }

        public DbSet<Article> Article { get; set; }
        public DbSet<FrontAuthor> Author { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<ReplyComment> ReplyComment { get; set; }
        public DbSet<DeletedArticle> DeletedArticle { get; set; }
    }
}
