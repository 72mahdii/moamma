using ApiAngular.Models;
using ApiAngular.Models.Articles;
using ApiAngular.Models.Authors;
using ApiAngular.Models.Comments;
using ApiAngular.Models.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Controllers
{
    [Route("api/[controller]")]
    public class RepositoryController : Controller
    {
        /*___Properties___*/
        #region Properties
        private StorageContext _storageContext;
        private IArticleRep _articleRepository;
        private IHostingEnvironment _host;

        public RepositoryController(
            StorageContext strgContext,
            IArticleRep artRep,
            IHostingEnvironment hst)
        {
            _storageContext = strgContext;
            _articleRepository = artRep ?? throw new ArgumentNullException(nameof(artRep));
            _host = hst;
        }

        #endregion
        /*---________---*/


        /*___Get Data__*/
        #region GetData
        [HttpGet]
        [Route("[action]")]
        public ActionResult<GetData> GetData()
        {
            GetData data = new GetData();
            IQueryable<Article> articles = _storageContext.Article.Include(a => a.Comments)
                .Where(a => !a.Archive).OrderByDescending(a => a.CrtDate);
            foreach (Article a in articles)
            {
                if (a.Comments.Count != 0)
                {
                    foreach (Comment c in a.Comments.ToList())
                    {
                        if (c.Approved)
                        {
                            c.ReplyComments =
                            _storageContext.ReplyComment.Where(r => r.CommentId == c.Id).ToList();

                        }
                        else
                        {
                            a.Comments.Remove(c);
                        }
                    }

                }
            }
            data.Articles = articles.ToList();
            data.Authors = _storageContext.Author
                .Where(a => a.UserName != "Fox__").ToList();
            return data;
        }
        #endregion

        /*___Get Articles___*/
        #region GetArticles
        [HttpGet]
        [Route("[action]")]
        public ActionResult<List<Article>> GetArticles()
        {
            IQueryable<Article> articles = _storageContext.Article.Include(a => a.Comments)
                .Where(a => !a.Archive).OrderByDescending(a => a.CrtDate);
            foreach (Article a in articles)
            {
                if (a.Comments != null || a.Comments.Count > 0)
                {
                    foreach (Comment c in a.Comments)
                    {
                        if (c.Approved)
                        {
                            c.ReplyComments =
                            _storageContext.ReplyComment.Where(r => r.CommentId == c.Id).ToList();

                        }
                        else
                        {
                            a.Comments.Remove(c);
                        }
                    }

                }
            }
            return articles.ToList();

        }
        #endregion

        /*___Get Authors___*/
        #region GetAuthors
        [HttpGet]
        [Route("[action]")]
        public ActionResult<List<FrontAuthor>> GetAuthors()
        {
            return _storageContext.Author
                .Where(a => a.UserName != "Fox__").ToList();
        }
        #endregion


        /*___Send Comment___*/
        #region SendComment
        [HttpPost]
        [Route("[action]")]
        public ActionResult<string> SendComment([FromBody]SendComment cmt)
        {
            try
            {
                Comment comment = new Comment
                {
                    Approved = false,
                    ArticleId = cmt.ArticleId,
                    Email = cmt.Email,
                    Name = cmt.Name,
                    Text = cmt.Text
                };
                _storageContext.Comment.Add(comment);
                _storageContext.SaveChanges();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }

        #endregion

        /*___Search___*/
        #region Search
        [HttpPost]
        [Route("[action]")]
        public ActionResult<List<Article>> Search([FromBody]Search word)
        {
            string[] listOfWords;
            if (word.Words != null && word.Words != "")
            {
                listOfWords = word.Words.Split(' ');
            }
            else
            {
                return null;
            }
            List<Article> foundList = new List<Article>();
            foreach (string w in listOfWords)
            {
                if (word.Cat != "all")
                {
                    var list = from article
                           in _storageContext.Article
                               where article.Title.Contains(w)
                                        && article.Category == word.Cat
                               select article;
                    if (list.ToList().Count() != 0)
                    {
                        foreach (Article a in list.ToList())
                        {
                            foundList.Add(a);
                        }
                    }
                }
                else
                {
                    var list = from article
                           in _storageContext.Article
                               where article.Title.Contains(w)
                               select article;
                    if (list.ToList().Count() != 0)
                    {
                        foreach (Article a in list.ToList())
                        {
                            foundList.Add(a);
                        }
                    }
                }

            }
            for (int i = 0; i < foundList.Count; i++)
            {
                for (int j = 0; j < foundList.Count; j++)
                {
                    if (foundList[i].Id == foundList[j].Id && j != i)
                    {
                        foundList.RemoveAt(j);
                    }
                }
            }
            return foundList;
        }

        #endregion

    }


}
