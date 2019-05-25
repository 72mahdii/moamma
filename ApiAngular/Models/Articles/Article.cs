using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ApiAngular.Models.Comments;

namespace ApiAngular.Models.Articles
{
    public class Article
    {
        public long Id { get; set; }
        [Required(ErrorMessage = "عنوان مقاله نمیتواند خالی باشد")]
        public string Title { get; set; }
        [Required(ErrorMessage = "تگ مقاله نمیتوان خالی باشد")]
        public string Category { get; set; }
        [Required(ErrorMessage = "هیچ متنی برای این مقاله در نظر گرفته نشده است")]
        public string Content { get; set; }
        [Required(ErrorMessage = "خلاصه مقاله نمیتواند خالی باشد")]
        public string Summary { get; set; }
        public string Tag { get; set; }
        public string AuthorId { get; set; }
        public bool Archive { get; set; }
        public DateTime CrtDate { get; set; }
        public int Likes { get; set; }
        public List<Comment> Comments { get; set; }

    }
}
