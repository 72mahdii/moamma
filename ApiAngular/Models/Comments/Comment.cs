using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Models.Comments
{
    public class Comment
    {

        public long Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Text { get; set; }
        public bool Approved { get; set; }
        public long ArticleId { get; set; }
        public List<ReplyComment> ReplyComments { get; set; }

    }
}
